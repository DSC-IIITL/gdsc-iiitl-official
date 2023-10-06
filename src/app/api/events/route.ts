import prisma from "@/lib/db/prisma";
import { checkAuth } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// TODO: Find a better way to handle api response types in Next.js
export type ContestResults = Prisma.ContestGetPayload<Record<string, never>>[];

export async function fetchContests({
  cursor,
  limit,
  ord,
}: {
  cursor?: string;
  limit?: number;
  ord?: "asc" | "desc";
}) {
  const contests = await prisma.contest.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: ord ? { id: ord } : undefined,
  });

  return contests;
}

/**
 * Returns the list of all events
 * No params passed -> limits results to 100 events
 * params:
 *   cursor -> cursor to start from
 *   limit -> number of events to return
 *   ord -> Order by -> "asc" | "desc"
 */
export async function GET(request: NextRequest) {
  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "admin"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "100");
    const ord = (request.nextUrl.searchParams.get("ord") ?? undefined) as
      | "asc"
      | "desc"
      | undefined;

    const contests = await fetchContests({ cursor, limit, ord });

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: contests,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      generateMessage({
        message: err instanceof Error ? err.message : "Something went wrong",
        error: err instanceof Error ? err.message : "unknown",
      }),
      {
        status: err instanceof Error ? 401 : 500,
      }
    );
  }
}

export type ContestResult = Prisma.ContestGetPayload<{
  include: {
    contestEntries: true;
  };
}>;

export async function fetchContestById(
  id: Prisma.ContestWhereInput["id"]
): Promise<ContestResult | null> {
  const contest = await prisma.contest.findFirst({
    where: {
      id,
    },
    include: {
      contestEntries: true,
    },
  });

  return contest;
}

/**
 * Returns the event with the given id
 */
export async function POST(request: NextRequest) {
  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "admin"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const req = await request.json();
    if (req.id === undefined) throw new Error("id is required");

    const contest = await fetchContestById(req.id);

    if (contest === null) throw new Error("Contest not found");
    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: contest,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      generateMessage({
        message: err instanceof Error ? err.message : "Something went wrong",
        error: err instanceof Error ? err.message : "unknown",
      }),
      {
        status: err instanceof Error ? 401 : 500,
      }
    );
  }
}
