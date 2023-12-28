import prisma from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateMessage, isValidBody } from "@/lib/server/response-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidBody(body, ["email", "password", "name"]))
      throw new Error("Invalid request");
    const { email, password, name } = body;

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (admin !== null) {
      // Account already exists
      return NextResponse.json(
        generateMessage({
          message: "Account already exists",
          error: "Account already exists",
        }),
        { status: 409 }
      );
    }

    // Create a new account
    const hashedPassword = await bcrypt.hash(password, 10);
    // TODO: Validate the fields from the request body
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Return success message
    return NextResponse.json(
      generateMessage({
        message: "Account created successfully",
        data: {
          email: newAdmin.email,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      generateMessage({
        message: "Something went wrong",
        error: err instanceof Error ? err.message : "Something went wrong",
      }),
      { status: err instanceof Error ? 401 : 500 }
    );
  }
}
