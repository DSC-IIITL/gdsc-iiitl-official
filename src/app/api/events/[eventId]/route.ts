import prisma from "@/lib/db/prisma";
import { checkAuth } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export type GetEvent = Prisma.EventGetPayload<{
  include: {
    submissions: true;
  };
}>;

async function fetchEventById(
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
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "admin"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const event = await fetchEventById(params.eventId);

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

/**
 * Updates the event with the given id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const id = params.eventId;

  // Get the body
  const body = await request.json();

  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "admin"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const event = await prisma.event.update({
      where: {
        id,
      },
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

/**
 * Deletes the event with the given id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const id = params.eventId;

  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "admin"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const event = await prisma.event.delete({
      where: {
        id,
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
