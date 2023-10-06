"use client";

import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { ContestResult } from "@/app/api/events/route";
import { Delete as DeleteIcon, Sync as SyncIcon } from "@mui/icons-material";
import { useFetch } from "@/hooks/useFetch";
import { RefreshContestEntriesResponse } from "@/app/api/events/refresh/route";
import ContestEntriesTable from "./atoms/ContestEntriesTable";

export type EventPageProps = {
  eventData: ContestResult;
};

export default function EventPage({ eventData }: EventPageProps) {
  const { data, loading, refetch } = useFetch<RefreshContestEntriesResponse>(
    {
      input: "/api/events/refresh",
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ id: eventData.id }),
      },
    },
    {
      newStudents: [],
      updatedEntries: null,
    }
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
      <Typography variant="h2">{eventData.name}</Typography>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
        }}
      >
        <LoadingButton
          color="primary"
          startIcon={<SyncIcon />}
          onClick={() => refetch()}
          loading={loading}
        >
          Update Entries
        </LoadingButton>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button color="error" startIcon={<DeleteIcon />}>
          Delete Event
        </Button>
      </Box>
      <Paper>
        {eventData.contestEntries?.map((entry) => {
          return (
            <LoadingButton
              key={entry.id}
              loading={false}
              loadingPosition="start"
              variant="contained"
              color="primary"
              sx={{ width: "100%" }}
            >
              {entry.studentId}
            </LoadingButton>
          );
        })}
        <ContestEntriesTable />
        {JSON.stringify(data)}
      </Paper>
    </Box>
  );
}
