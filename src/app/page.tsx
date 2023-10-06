import * as React from "react";
import Box from "@mui/material/Box";
import Leaderboard from "../components/Leaderboard";
import { getSheetsData } from "@/lib/sheets";
import GDSCHeader from "@/components/GDSCHeader";
import { notFound } from "next/navigation";

export default async function HomePage() {
  if (!process.env.SHEET_ID) {
    return notFound();
  }
  const sheetData = await getSheetsData(process.env.SHEET_ID);

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
      <Leaderboard
        cols={sheetData?.headers || []}
        rows={sheetData?.rows || []}
      />
    </Box>
  );
}
