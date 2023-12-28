import prisma from "@/lib/db/prisma";
import { checkAuth, verifyToken } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { NextRequest, NextResponse } from "next/server";

async function getSubmission(eventId: string, userId: string) {
  const eventSubmission = await prisma.eventSubmission.findFirst({
    where: {
      eventId,
      userId,
    },
  });

  return eventSubmission;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeBody(body: any) {
  delete body.user;
  delete body.userId;
  delete body.event;
  delete body.eventId;
  delete body.submissionTime;
  return body;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "user"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const tokenData = verifyToken(request.cookies.get("token")?.value);

    const body = sanitizeBody(await request.json());

    // Check if there is an earlier submission
    const earlierSubmission = await getSubmission(params.eventId, tokenData.id);

    if (earlierSubmission !== null) {
      throw new Error(
        "Multiple submissions are not allowed. To update your submission, use the PUT method instead."
      );
    }

    const eventSubmission = await prisma.eventSubmission.create({
      data: {
        ...body,
        user: {
          connect: {
            id: tokenData.id,
          },
        },
        event: {
          connect: {
            id: params.eventId,
          },
        },
        submissionTime: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: eventSubmission,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "user"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    const tokenData = verifyToken(request.cookies.get("token")?.value);

    const body = sanitizeBody(await request.json());

    // Check if there is an earlier submission
    const earlierSubmission = await getSubmission(params.eventId, tokenData.id);

    if (earlierSubmission === null) {
      throw new Error(
        "No earlier submission found. To create a new submission, use the POST method instead."
      );
    }

    // Update the submission
    const eventSubmission = await prisma.eventSubmission.update({
      where: {
        id: earlierSubmission.id,
      },
      data: {
        ...body,
        submissionTime: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: eventSubmission,
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
