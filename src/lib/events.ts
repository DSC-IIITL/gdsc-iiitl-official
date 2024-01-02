import prisma from "./db/prisma";

export async function getEventsByCursor({
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
    orderBy: ord ? { startDate: ord } : undefined,
  });

  return events;
}

export async function getEventsByOffset({
  offset,
  limit,
  ord,
}: {
  offset: number;
  limit: number;
  ord: "asc" | "desc";
}) {
  const events = await prisma.event.findMany({
    take: limit,
    skip: offset,
    orderBy: { startDate: ord },
  });

  return events;
}
