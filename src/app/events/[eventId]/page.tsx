import { fetchEventById } from "@/app/api/events/route";
import { notFound } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const eventData = await fetchEventById(params.eventId);

  if (!eventData) return notFound();

  return <div>Event Page {eventData.name}</div>;
}
