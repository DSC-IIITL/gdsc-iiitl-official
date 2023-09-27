import { Box } from "@mui/material";
import Image from "next/image";
import GDSCLogo from "./GDSCLogo";

export default function GDSCHeader() {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        padding: "1rem",
        gap: "2.5rem",
      }}
    >
      <GDSCLogo />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <h1 style={{ margin: 0 }}>Leaderboard 2023-24</h1>
        <h3 style={{ margin: 0, opacity: 0.9 }}>GDSC IIITL</h3>
      </Box>
    </Box>
  );
}
