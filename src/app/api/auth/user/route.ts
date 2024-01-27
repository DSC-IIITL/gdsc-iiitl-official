import prisma from "@/lib/db/prisma";
import { resolvePath } from "@/lib/resolve-path";
import { signToken } from "@/lib/server/auth-utils";
import { extractEnrollmentNumber } from "@/lib/utils";
import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.formData();

  const redirectTo =
    new URL(request.url).searchParams.get("redirect") || "/user";

  const client = new OAuth2Client();

  // Validate the reuqest first
  // Check for the csrf cookie
  const csrf_token_cookie = request.cookies.get("g_csrf_token")?.value;
  if (!csrf_token_cookie) {
    return Response.json(
      {
        message: "No csrf token in cookies found",
        error: "Invalid request",
      },
      { status: 400 }
    );
  }

  const csrf_token_body = body.get("g_csrf_token");
  if (!csrf_token_body) {
    return Response.json(
      {
        message: "No csrf token in body found",
        error: "Invalid request",
      },
      { status: 400 }
    );
  }

  if (csrf_token_cookie !== csrf_token_body) {
    return Response.json(
      {
        message: "Csrf token mismatch",
        error: "Invalid request",
      },
      { status: 400 }
    );
  }

  const credential = body.get("credential")?.toString();

  if (!credential)
    return Response.json(
      { message: "No credential found", error: "Invalid request" },
      { status: 400 }
    );

  // Verify the credential
  try {
    const payload = await verify(client, credential);

    // Got the paylod with user details
    // Store it in the database if its a new user
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      const email = payload.email;
      const name = payload.name;
      if (!name || !email) throw new Error("Invalid payload");
      try {
        const enrollmentNumber = extractEnrollmentNumber(email);
        // Create a new user
        const newUser = await prisma.user.create({
          data: {
            id: enrollmentNumber,
            email,
            name: name,
          },
        });

        // Sign a token and send it
        const token = signToken({
          id: newUser.id,
          email: newUser.email,
          role: "user",
          name: newUser.name,
        });

        // Set the token and redirect to the user page
        const response = NextResponse.redirect(resolvePath(redirectTo), {
          status: 302,
        });

        response.cookies.set("token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        });

        return response;
      } catch (err) {
        return Response.json(
          {
            message: "Invalid email",
            error: "Invalid request",
          },
          { status: 400 }
        );
      }
    }
    // User already exists
    // Update the user's name if it has changed
    const email = payload.email;
    const name = payload.name;
    if (!name || !email) throw new Error("Invalid payload");
    if (user.name !== name) {
      await prisma.user.update({
        where: { email },
        data: { name },
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: "user",
      name: payload.name || user.name,
    });

    // Set the token and redirect to the user page
    const response = NextResponse.redirect(resolvePath(redirectTo), {
      status: 302,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err) {
    return Response.json(
      {
        message: err instanceof Error ? err.message : "Invalid credential",
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const redirectTo =
    new URL(request.url).searchParams.get("redirect") || "/user";

  // Redirect to the user page if the cookie is set
  const token = request.cookies.get("token")?.value;

  if (token) {
    return Response.redirect(resolvePath(redirectTo));
  }

  return Response.redirect(resolvePath("/auth/user/login"));
}

async function verify(client: OAuth2Client, token: string) {
  const CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
  if (!CLIENT_ID) throw new Error("No client id found in env");
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid token");
  }
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return payload;
}
