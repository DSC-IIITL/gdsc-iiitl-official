import { getAuthData } from "@/lib/server/auth-utils";
import { generateMessage } from "@/lib/server/response-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (token === undefined)
      return NextResponse.json(
        generateMessage({
          message: "No token provided",
        }),
        { status: 200 }
      );

    const verifiedToken = getAuthData(token);
    return NextResponse.json(
      generateMessage({
        message: "Successfully authenticated",
        data: verifiedToken,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      generateMessage({
        message: err instanceof Error ? err.message : "Something went wrong...",
        error: "unknown",
      }),
      { status: err instanceof Error ? 401 : 500 }
    );
  }
}
