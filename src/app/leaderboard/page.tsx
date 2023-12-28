import * as React from "react";
import Box from "@mui/material/Box";
import Leaderboard from "@/components/Leaderboard";
import GDSCHeader from "@/components/Logos/GDSCHeader";
import getLeaderboardData from "@/lib/leaderboard";

export default async function HomePage() {
  const leaderboardData = await getLeaderboardData();

  return (
    <Box
      sx={{
        display: "grid",
        width: "80%",
        height: "80%",
        gridTemplateRows: "auto 1fr",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        gap: "2rem",
      }}
    >
      <GDSCHeader />
      <Leaderboard data={leaderboardData} />
    </Box>
  );
}
