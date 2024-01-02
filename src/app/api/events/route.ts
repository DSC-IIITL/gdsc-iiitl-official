import prisma from "@/lib/db/prisma";
import { getEventsByCursor, getEventsByOffset } from "@/lib/events";
import { checkAuth } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// TODO: Find a better way to handle api response types in Next.js
export type GetEvents = Prisma.EventGetPayload<Record<string, never>>[];

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
    // PUBLIC ROUTE

    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    const skip = parseInt(request.nextUrl.searchParams.get("skip") ?? "0");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "100");
    const ord = (request.nextUrl.searchParams.get("ord") ?? "desc") as
      | "asc"
      | "desc";

    const events = cursor
      ? await getEventsByCursor({ cursor, limit, ord })
      : await getEventsByOffset({ offset: skip, limit, ord });

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

/**
 * Creates a new event
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

    // Get the body
    const body = await request.json();

    const event = await prisma.event.create({
      data: {
        ...body,
      },
    });

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
