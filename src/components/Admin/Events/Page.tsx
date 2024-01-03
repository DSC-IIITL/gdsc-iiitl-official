"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  Fab,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import EventGrid from "./EventGrid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "@/lib/utils";
import { getAxios } from "@/lib/axios.config";
import Forms from "@/components/Forms";
import { EventsContext } from "@/contexts/EventsContext";
import toast, { Toaster } from "react-hot-toast";

export type EventsPageProps = {
  limit: number;
  page: number;
  order: Prisma.SortOrder;
};

export default function EventsPage(props: EventsPageProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<
    Prisma.EventGetPayload<Record<string, never>>[]
  >([]);
  const [newEventOpen, setNewEventOpen] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleUpdate = async (
    id: Prisma.EventDeleteArgs["where"]["id"],
    data: Prisma.EventUpdateInput
  ) => {
    try {
      const res = await getAxios().put(`/events/${id}`, {
        ...data,
      });
      const updatedEvent = res.data.data;
      console.log({ updatedEvent });
      toast.success("Updated event successfully");
      // Set the events to the updated events
      setEvents((events) =>
        events.map((event) => {
          if (event.id === id) {
            return updatedEvent;
          }
          return event;
        })
      );
    } catch (err) {
      toast.error("Unable to update event");
      console.error(err);
    }
  };

  const handleDelete = async (data: Prisma.EventDeleteArgs["where"]["id"]) => {
    try {
      const res = await getAxios().delete(`/events/${data}`);
      const deletedEvent = res.data.data;
      console.log({ deletedEvent });
      toast.success("Deleted event successfully");
      // Set the events to the updated events
      setEvents((events) => events.filter((event) => event.id !== data));
    } catch (err) {
      toast.error("Unable to delete event");
      console.error(err);
    }
  };

  const handleCreate = async (data: Prisma.EventCreateInput) => {
    try {
      const res = await getAxios().post(`/events`, {
        ...data,
      });
      const createdEvent = res.data.data;
      console.log({ createdEvent });
      toast.success("Created event successfully");
      // Set the events to the updated events
      setEvents((events) => [...events, createdEvent]);
    } catch (err) {
      toast.error("Unable to create event");
      console.error(err);
    }
  };
  useEffect(() => {
    // Fetch the events from the API
    setLoading(true);
    fetch(
      `/api/events?limit=${props.limit}&skip=${
        (props.page - 1) * props.limit
      }&ord=${props.order}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        setEvents(data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props.limit, props.order, props.page]);

  // Fetch the events from the API
  return (
    <>
      <Toaster position="top-center" />
      <EventsContext.Provider
        value={{
          deleteEvent: handleDelete,
          updateEvent: handleUpdate,
          createEvent: handleCreate,
          refresh: async () => {
            router.push(
              pathName +
                "?" +
                createQueryString(searchParams, {
                  page: props.page.toString(),
                })
            );
          },
        }}
      >
        {loading ? (
          <EventGridSkeleton />
        ) : (
          <>
            <EventGrid events={events} />
            <ButtonGroup variant="outlined" aria-label="Pagination Buttons">
              <Button
                disabled={props.page <= 1}
                onClick={() =>
                  router.push(
                    pathName +
                      "?" +
                      createQueryString(searchParams, {
                        page: (props.page - 1).toString(),
                      })
                  )
                }
              >
                Previous
              </Button>
              <Button
                onClick={() =>
                  router.push(
                    pathName +
                      "?" +
                      createQueryString(searchParams, {
                        page: (props.page + 1).toString(),
                      })
                  )
                }
                disabled={events.length < props.limit}
              >
                Next
              </Button>
            </ButtonGroup>
          </>
        )}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: "2rem",
            right: "clamp(2rem, 5vw, 5rem)",
          }}
          onClick={() => setNewEventOpen((newEventOpen) => !newEventOpen)}
        >
          <AddIcon />
        </Fab>
        <Dialog
          onClose={() => setNewEventOpen(false)}
          open={newEventOpen}
          sx={{
            h2: {
              padding: "0",
            },
            ".MuiPaper-root": {
              padding: "16px 24px",
            },
          }}
        >
          <Stack gap={"24px"}>
            <DialogTitle>Create Event</DialogTitle>
            <Forms.Event
              close={() => setNewEventOpen(false)}
              mode="create"
              onCreate={async (data) => {
                await handleCreate(data);
              }}
              closeOnSubmit={true}
            />
          </Stack>
        </Dialog>
      </EventsContext.Provider>
    </>
  );
}

export function EventGridSkeleton({
  cols = 3,
  rows = 3,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, id) => (
        <Grid container wrap="nowrap" key={id}>
          {Array.from(new Array(cols)).map((_, index) => (
            <Box key={index} sx={{ width: 210, marginRight: 0.5, my: 5 }}>
              <Skeleton variant="rectangular" width={210} height={118} />
              <Box sx={{ pt: 0.5 }}>
                <Skeleton animation={"wave"} />
                <Skeleton width="60%" />
              </Box>
            </Box>
          ))}
        </Grid>
      ))}
    </>
  );
}
