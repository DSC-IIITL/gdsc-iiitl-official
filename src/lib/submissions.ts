import { Prisma } from "@prisma/client";
import prisma from "./db/prisma";

export type GetSubmissionsType =
  | Awaited<ReturnType<typeof getSubmissionsByCursor>>
  | Awaited<ReturnType<typeof getSubmissionsByOffset>>;

export async function getSubmissionsByCursor({
  cursor,
  limit,
  ord,
  where,
}: {
  cursor?: string;
  limit?: number;
  ord?: "asc" | "desc";
  where?: Prisma.EventSubmissionWhereInput;
}) {
  const submissions = await prisma.eventSubmission.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: ord ? { submissionTime: ord } : undefined,
    include: {
      event: {
        select: {
          id: true,
          name: true,
          endDate: true,
        },
      },
    },
    where,
  });

  return submissions;
}

export async function getSubmissionsByOffset({
  offset,
  limit,
  ord,
  where,
}: {
  offset: number;
  limit: number;
  ord: "asc" | "desc";
  where?: Prisma.EventSubmissionWhereInput;
}) {
  const submissions = await prisma.eventSubmission.findMany({
    take: limit,
    skip: offset,
    orderBy: { submissionTime: ord },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          endDate: true,
        },
      },
    },
    where,
  });

  return submissions;
}
