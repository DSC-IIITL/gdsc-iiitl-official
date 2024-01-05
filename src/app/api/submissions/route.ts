import { checkAuth, getAuthData } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import {
  getSubmissionsByCursor,
  getSubmissionsByOffset,
} from "@/lib/submissions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const isAuthorized = checkAuth(
      request,
      (data) => data.role === "admin" || data.role === "user"
    );
    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }
    const tokenData = getAuthData(request.cookies.get("token")?.value);
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    const skip = parseInt(request.nextUrl.searchParams.get("skip") ?? "0");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "100");
    const ord = (request.nextUrl.searchParams.get("ord") ?? "desc") as
      | "asc"
      | "desc";

    if (tokenData.role === "admin") {
      // Get all the submissions and return them
      const submissions = cursor
        ? await getSubmissionsByCursor({ cursor, limit, ord })
        : await getSubmissionsByOffset({ offset: skip, limit, ord });

      return NextResponse.json(
        generateMessage({
          message: "Success",
          data: submissions,
        }),
        { status: 200 }
      );
    }

    // Get the submissions for the user and return them
    const submissions = cursor
      ? await getSubmissionsByCursor({
          cursor,
          limit,
          ord,
          where: {
            userId: tokenData.id,
          },
        })
      : await getSubmissionsByOffset({
          offset: skip,
          limit,
          ord,
          where: {
            userId: tokenData.id,
          },
        });

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: submissions,
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
