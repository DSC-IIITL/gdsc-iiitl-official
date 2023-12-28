import { getEvents } from "@/app/api/events/route";
import { UnderConstruction } from "@/components/Construction";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { cursor?: string; limit?: string; sort?: string };
}) {
  // Fetch all the events with pagination enabled
  const cursor = searchParams.cursor ?? undefined;
  const limit = parseInt(searchParams.limit ?? "10");
  const sort = (() => {
    const param = searchParams.sort;
    if (param === "asc" || param === "desc") return param;
    else return undefined;
  })();
  const events = await getEvents({ cursor, limit, ord: sort });

  console.log({ events });

  return <UnderConstruction />;
}
