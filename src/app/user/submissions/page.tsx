import UserSubmissions from "@/components/User/Submissions";

export default function DashboardSubmissions({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string };
}) {
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
    />
  );
}
