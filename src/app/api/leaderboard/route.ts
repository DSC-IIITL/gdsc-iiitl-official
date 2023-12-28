import getLeaderboardData, { refreshLeaderboard } from "@/lib/leaderboard";
import { checkAuth } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // PUBLIC ROUTE

  // Fetch the leaderboard
  try {
    const leaderboardData = await getLeaderboardData();

    return NextResponse.json(
      generateMessage({
        message: "Leaderboard fetched successfully",
        data: leaderboardData,
      }),
      {
        headers: {
          "Cache-Control": "public, max-age=3600", // 1 hour
        },
        status: 200,
      }
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

export async function PUT(request: NextRequest) {
  try {
    const isAuthorized = checkAuth(
      request,
      (authData) => authData.role === "admin"
    );

    if (!isAuthorized) {
      throw new Error("Unauthorized");
    }

    // Refresh the leaderboard
    const leaderboardData = await refreshLeaderboard();

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: leaderboardData,
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
