"use client";

import Image from "next/image";
import GDSCBannerImage from "../../../public/gdsc-banner.png";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

export default function GDSCBanner() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  if (matches)
    return (
      <Image
        src={GDSCBannerImage}
        alt="GDSC Logo"
        style={{ borderRadius: "4rem", userSelect: "none" }}
        width={400}
      />
    );

  return (
    <Image
      src={GDSCBannerImage}
      alt="GDSC Logo"
      style={{ borderRadius: "4rem", userSelect: "none" }}
    />
  );
}
