import { UnderConstruction } from "@/components/Construction";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";

type Params = {
  params: { eventId: string };
};

export async function generateMetadata({ params }: Params) {
  const eventData = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!eventData) return notFound();

  return {
    title: `${eventData.name} | GDSC IIITL`,
    description: eventData.description,
  };
}

export default async function EventPage({ params }: Params) {
  const eventData = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!eventData) return notFound();

  console.log({ eventData });

  return <UnderConstruction />;
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
