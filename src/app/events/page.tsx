import { UnderConstruction } from "@/components/Construction";
import { getEvents } from "@/lib/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | GDSC IIITL",
  description: "Explore the events conducted by GDSC IIIT Lucknow.",
};

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

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
