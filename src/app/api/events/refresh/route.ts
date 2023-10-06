import { checkAuth } from "@/lib/server/auth-utils";
import { NextRequest, NextResponse } from "next/server";
import { getSheetIdFromUrl, getSheetsData } from "@/lib/sheets";
import { generateMessage } from "@/lib/server/response-utils";
import prisma from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export type RefreshContestEntriesResponse =
  | {
      updatedEntries: Prisma.BatchPayload;
      newStudents:
        | {
            [x: string]: string | undefined;
          }[]
        | undefined;
    }
  | {
      updatedEntries: null;
      newStudents:
        | {
            [x: string]: string | undefined;
          }[]
        | undefined;
    };

export async function refreshContestEntries(
  id: string
): Promise<RefreshContestEntriesResponse> {
  // get the sheets id and student ids
  const [contest, allStudents] = await prisma.$transaction([
    prisma.contest.findUnique({
      where: {
        id,
      },
      include: {
        contestEntries: true,
      },
    }),
    prisma.student.findMany({
      select: {
        id: true,
      },
    }),
  ]);

  if (contest === null) throw new Error("Contest not found");
  const allStudentIds = new Set();
  allStudents.forEach((student) => allStudentIds.add(student.id));

  // fetch the data from sheets
  const sheetData = await getSheetsData(
    getSheetIdFromUrl(contest.responseSheetLink)
  );

  // New contest entries
  const newContestEntries = sheetData?.rows.filter((row) => {
    const enrollmentNumber = row["Enrollment Number"];
    if (enrollmentNumber === undefined) return false;
    return (
      contest.contestEntries.find(
        (entry) => entry.studentId === enrollmentNumber.toLowerCase()
      ) === undefined
    );
  });

  console.log({ newContestEntries });

  // New students
  const newStudents = sheetData?.rows.filter((row) => {
    return !allStudentIds.has(row["Enrollment Number"]?.toLowerCase());
  });

  // Create the new contest entries of existing students
  if (newContestEntries && newContestEntries.length > 0) {
    const updatedEntries = await prisma.contestEntry.createMany({
      // TODO: Fix this
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore U MF TS
      data: [
        ...newContestEntries
          .map((entry) => {
            if (entry["Enrollment Number"] === undefined) return null;
            return {
              contestId: contest.id,
              studentId: entry["Enrollment Number"].toLowerCase(),
              entry: entry,
              score: 0,
            };
          })
          .filter((entry) => entry !== null),
      ],
    });
    return { updatedEntries, newStudents };
  }
  return { updatedEntries: null, newStudents };
}

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

    const updatedEntries = await refreshContestEntries(req.id);

    return NextResponse.json(
      generateMessage({
        message: "Success",
        data: updatedEntries,
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
