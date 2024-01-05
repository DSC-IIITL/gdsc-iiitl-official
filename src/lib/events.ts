import prisma from "./db/prisma";

export async function getEventsByCursor({
  cursor,
  limit,
  ord,
  q,
}: {
  cursor?: string;
  limit?: number;
  ord?: "asc" | "desc";
  q?: string;
}) {
  const events = await prisma.event.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
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
  q,
}: {
  offset: number;
  limit: number;
  ord: "asc" | "desc";
  q?: string;
}) {
  const events = await prisma.event.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    take: limit,
    skip: offset,
    orderBy: { startDate: ord },
  });

  return events;
}
