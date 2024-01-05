// import { UnderConstruction } from "@/components/Construction";
import AdminEvents from "@/components/Admin/Events";

export default function DashboardEvents({
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
