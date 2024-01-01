"use client";

import { Box, SxProps, Theme, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GDSCLogo from "./GDSCLogo";

export default function GDSCHeader({
  sx,
}: {
  sx?: SxProps<Theme> | undefined;
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "1rem",
        gap: "2.5rem",
      }}
    >
      <GDSCLogo
        height={matches ? 64 : undefined}
        width={matches ? 64 : undefined}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {matches ? (
          <>
            <h3 style={{ margin: 0 }}>Leaderboard 2023-24</h3>
            <h5 style={{ margin: 0, opacity: 0.9 }}>GDSC IIITL</h5>
          </>
        ) : (
          <>
            <h1 style={{ margin: 0 }}>Leaderboard 2023-24</h1>
            <h3 style={{ margin: 0, opacity: 0.9 }}>GDSC IIITL</h3>
          </>
        )}
      </Box>
    </Box>
  );
}
