import prisma from "@/lib/db/prisma";
import { checkAuth } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// TODO: Find a better way to handle api response types in Next.js
export type GetEvents = Prisma.EventGetPayload<Record<string, never>>[];

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

    const events = await getEvents({ cursor, limit, ord });

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: events,
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

export type GetEvent = Prisma.EventGetPayload<{
  include: {
    submissions: true;
  };
}>;

export async function fetchEventById(
  id: Prisma.EventWhereInput["id"]
): Promise<GetEvent | null> {
  const event = await prisma.event.findFirst({
    where: {
      id,
    },
    include: {
      submissions: true,
    },
  });

  return event;
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

    const event = await fetchEventById(req.id);

    if (event === null) throw new Error("Event not found");
    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: event,
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
