import prisma from "./db/prisma";

export async function getEvents({
  cursor,
  limit,
  ord,
}: {
  cursor?: string;
  limit?: number;
  ord?: "asc" | "desc";
}) {
  const events = await prisma.event.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: ord ? { id: ord } : undefined,
  });

  return events;
}
