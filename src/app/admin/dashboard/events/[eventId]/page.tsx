import { fetchContestById } from "@/app/api/events/route";
import Events from "@/components/Events";
import { notFound } from "next/navigation";

export default async function Event({
  params,
}: {
  params: { eventId: string };
}) {
  const eventData = await fetchContestById(params.eventId, {
    contestEntries: true,
  });

  if (eventData === null) notFound();

  return <Events.Page eventData={eventData} />;
}
