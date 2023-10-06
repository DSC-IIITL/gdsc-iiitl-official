import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateMessage, isValidBody } from "@/lib/server/response-utils";
import { signToken } from "@/lib/server/auth-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidBody(body, ["email", "password", "rememberMe"]))
      throw new Error("Invalid request");
    const { email, password, rememberMe } = body;
    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (admin === null) {
      return NextResponse.json(
        generateMessage({
          message: "Invalid email or password",
          error: "Invalid email or password",
        }),
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch === false) {
      return NextResponse.json(
        generateMessage({
          message: "Invalid email or password",
          error: "Invalid email or password",
        }),
        { status: 401 }
      );
    }

    // Successfully authenticated -> Set cookies if rememberMe and redirect to dashboard
    if (rememberMe === true) {
      const token = signToken(
        { id: admin.id, email: admin.email, role: "admin", name: "" },
        {
          expiresIn: "30d",
        }
      );
      return NextResponse.json(
        generateMessage({
          message: "Successfully authenticated",
        }),
        {
          status: 200,
          headers: {
            "Set-Cookie": `token=${token}; Max-Age=${
              60 * 60 * 24 * 30
            }; Path=/; HttpOnly; SameSite=Lax`,
          },
        }
      );
    } else {
      const token = signToken({
        id: admin.id,
        email: admin.email,
        role: "admin",
        name: "",
      });
      return NextResponse.json(
        generateMessage({
          message: "Successfully authenticated",
        }),
        {
          status: 200,
          headers: {
            "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Lax`,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Error)
      return NextResponse.json(
        generateMessage({
          message: "Something went wrong",
          error: err.message,
        }),
        { status: 500 }
      );
  }
}
