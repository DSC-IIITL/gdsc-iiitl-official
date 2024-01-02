"use client";

import { Box, Button, ButtonGroup, Grid, Skeleton } from "@mui/material";
import { Prisma } from "@prisma/client";
import { createContext, useEffect, useState } from "react";
import EventGrid from "./EventGrid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "@/lib/utils";
import { getAxios } from "@/lib/axios.config";

export type EventsPageProps = {
  limit: number;
  page: number;
  order: Prisma.SortOrder;
};

export const EventsContext = createContext<{
  deleteEvent: (
    id: Prisma.EventGetPayload<Record<string, never>>["id"]
  ) => Promise<void>;
  updateEvent: (
    id: Prisma.EventGetPayload<Record<string, never>>["id"],
    data: Partial<Prisma.EventGetPayload<Record<string, never>>>
  ) => Promise<void>;
  refresh: () => Promise<void>;
}>({
  deleteEvent: async () => {},
  updateEvent: async () => {},
  refresh: async () => {},
});

export default function EventsPage(props: EventsPageProps) {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<
    Prisma.EventGetPayload<Record<string, never>>[]
  >([]);

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleUpdate = async (
    id: Prisma.EventGetPayload<Record<string, never>>["id"],
    data: Partial<Prisma.EventGetPayload<Record<string, never>>>
  ) => {
    try {
      const res = await getAxios().put(`/events/${id}`, {
        ...data,
      });
      const updatedEvent = res.data.data;
      console.log({ updatedEvent });
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
      console.error(err);
    }
  };

  const handleDelete = async (
    data: Prisma.EventGetPayload<Record<string, never>>["id"]
  ) => {
    try {
      const res = await getAxios().delete(`/events/${data}`);
      const deletedEvent = res.data.data;
      console.log({ deletedEvent });
      // Set the events to the updated events
      setEvents((events) => events.filter((event) => event.id !== data));
    } catch (err) {
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
    <EventsContext.Provider
      value={{
        deleteEvent: handleDelete,
        updateEvent: handleUpdate,
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
    </EventsContext.Provider>
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
