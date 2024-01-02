import AdminEvents from "@/components/Admin/Events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | GDSC IIITL",
  description: "Explore the events conducted by GDSC IIIT Lucknow.",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string };
}) {
  return (
    <AdminEvents.Page
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
    />
  );
}

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
