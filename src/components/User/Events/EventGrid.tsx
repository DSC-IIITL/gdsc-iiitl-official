import { Prisma } from "@prisma/client";
import EventCard from "./EventCard";
import { Typography } from "@mui/material";

export type EventGridProps = {
  events: Prisma.EventGetPayload<Record<string, never>>[];
};

export default function EventGrid(props: EventGridProps) {
  return props.events.length > 0 ? (
    props.events.map((event) => <EventCard key={event.id} {...event} />)
  ) : (
    <Typography variant="h6">
      No events found. Please check back later.
    </Typography>
  );
}
