import { Box } from "@mui/material";
import Image from "next/image";

export default function GDSCBanner() {
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
      <Image
        src="/gdsc.png"
        alt="GDSC Logo"
        width={128}
        height={128}
        style={{ borderRadius: "50%" }}
      />
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
