import { UnderConstruction } from "@/components/Construction";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";

export default async function Event({
  params,
}: {
  params: { eventId: string };
}) {
  const eventData = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (eventData === null) notFound();

  return <UnderConstruction />;
}
