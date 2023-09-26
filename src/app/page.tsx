import * as React from "react";
import Box from "@mui/material/Box";
import Leaderboard from "../components/Leaderboard";
import { getSheetsData } from "@/lib/sheets";
import GDSCBanner from "@/components/GDSCBanner";

export default async function HomePage() {
  const sheetData = await getSheetsData();

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
      <GDSCBanner />
      <Leaderboard
        cols={sheetData?.headers || []}
        rows={sheetData?.rows || []}
      />
    </Box>
  );
}
