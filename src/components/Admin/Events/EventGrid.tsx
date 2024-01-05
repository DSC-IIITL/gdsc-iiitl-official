import { Prisma } from "@prisma/client";
import EventCard from "./EventCard";

export type EventGridProps = {
  events: Prisma.EventGetPayload<Record<string, never>>[];
};

export default function EventGrid(props: EventGridProps) {
  return props.events.map((event) => <EventCard key={event.id} {...event} />);
}
