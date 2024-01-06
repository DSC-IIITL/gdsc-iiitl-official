import UserSubmissions from "@/components/User/Submissions";
import prisma from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export default async function DashboardSubmissions({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; new?: string };
}) {
  try {
    const newSubmissionEvent =
      (searchParams.new &&
        (await prisma.event.findUnique({
          where: {
            id: searchParams.new,
          },
        }))) ||
      undefined;

    return (
      <UserSubmissions.Page
        limit={10}
        order={(() => {
          if (searchParams.sort === "desc") {
            return "desc";
          } else {
            return "asc";
          }
        })()}
        page={(() => {
          try {
            if (!searchParams.page) {
              return 1;
            }
            return parseInt(searchParams.page);
          } catch (err) {
            return 1;
          }
        })()}
        newSubmissionEvent={newSubmissionEvent}
      />
    );
  } catch (err) {
    return redirect("/user/submissions");
  }
}
