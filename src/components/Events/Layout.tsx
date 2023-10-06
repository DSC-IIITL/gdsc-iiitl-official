"use client";

import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import GrainIcon from "@mui/icons-material/Grain";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { usePathname, useRouter } from "next/navigation";
import { getSegmentsFromPath } from "@/lib/utils";

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

type routeIcons = {
  root: JSX.Element;
  generic: JSX.Element;
  nestedRoutes?: {
    [key: string]: routeIcons;
  };
};

const breadcrumbIcons: routeIcons = {
  root: <HomeIcon />,
  generic: <GrainIcon />,
  nestedRoutes: {
    events: {
      root: <CalendarViewMonthIcon />,
      generic: <EmojiEventsIcon />,
    },
  },
};

// TODO: Make this process O(n)
const getIcon = (paths: string[]): JSX.Element => {
  let currRoute = breadcrumbIcons;
  for (const path of paths) {
    const nestedRoutes = currRoute?.nestedRoutes;
    if (nestedRoutes?.[path]) {
      currRoute = nestedRoutes[path];
    } else {
      return currRoute.generic;
    }
  }
  return currRoute.root;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathName = usePathname();

  const segments = getSegmentsFromPath(pathName);
  const prevSegments = segments.slice(0, segments.indexOf("events")).join("/");
  const nestedSegments = segments.slice(segments.indexOf("events"));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: "2rem",
      }}
    >
      <div role="presentation" onClick={handleClick}>
        <Breadcrumbs aria-label="breadcrumb">
          {nestedSegments.map((route, idx) => {
            if (idx === nestedSegments.length - 1) {
              return (
                <Typography
                  key={route}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& .MuiSvgIcon-root": {
                      marginRight: "0.5rem",
                    },
                  }}
                  color="text.primary"
                >
                  {getIcon(nestedSegments.slice(0, idx + 1))}
                  {route}
                </Typography>
              );
            }
            return (
              <Link
                key={route}
                underline="hover"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& .MuiSvgIcon-root": {
                    marginRight: "0.5rem",
                  },
                  cursor: "pointer",
                }}
                color="inherit"
                onClick={() =>
                  router.push(
                    `/${prevSegments}/${nestedSegments
                      .slice(0, idx + 1)
                      .join("/")}`
                  )
                }
              >
                {getIcon(nestedSegments.slice(0, idx + 1))}
                {route}
              </Link>
            );
          })}
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
}
