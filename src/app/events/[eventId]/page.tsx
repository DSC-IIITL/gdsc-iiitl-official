import { UnderConstruction } from "@/components/Construction";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const eventData = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!eventData) return notFound();

  console.log({ eventData });

  return <UnderConstruction />;
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
