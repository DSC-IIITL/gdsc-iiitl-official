import * as React from "react";
import Box from "@mui/material/Box";
import Leaderboard from "@/components/Leaderboard";
import GDSCHeader from "@/components/Logos/GDSCHeader";
import getLeaderboardData from "@/lib/leaderboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | GDSC IIITL",
  description: "Leaderboard for GDSC IIIT Lucknow.",
};

export default async function HomePage() {
  const leaderboardData = await getLeaderboardData();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        padding: "2rem",
      }}
    >
      <GDSCHeader
        sx={{
          margin: "auto",
        }}
      />
      <Leaderboard
        sx={{
          maxWidth: "1440px",
          margin: "auto",
          minHeight: `640px`, // TODO: Remove this hardcoding for 10 rows
        }}
        data={leaderboardData}
      />
    </Box>
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
