"use client";

import * as React from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ContestResults } from "@/app/api/events/route";
import { useFetch } from "@/hooks/useFetch";
import EventCard from "../atoms/EventCard";

export default function Events() {
  const {
    data: events,
    loading,
    refetch,
  } = useFetch<ContestResults>(
    {
      input: "/api/events",
      init: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      },
    },
    []
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gap: "2rem",
      }}
    >
      <Typography variant="h2">Events</Typography>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          display: "grid",
          gridTemplateRows: !loading ? "auto 1fr" : "",
          placeItems: !loading ? "" : "center",
          gap: "1rem",
          minHeight: "15rem",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {/* TODO: Add a searchbar and other things here */}
            <LoadingButton onClick={() => refetch()} loading={loading}>
              Refresh
            </LoadingButton>
            {events === null || events.length === 0 ? (
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Typography textAlign={"center"} variant={"h5"}>
                  No events found
                </Typography>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    eventDate={event.startTime}
                    eventTitle={event.name}
                    formLink={event.formLink}
                    responseSheetLink={event.responseSheetLink}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
