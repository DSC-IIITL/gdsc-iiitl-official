// Example usage:
// const prismaDateString = "2023-09-28T14:30:00.000Z";
// const formattedDate = formatPrismaDateForUI(prismaDateString);
// console.log(formattedDate); // Output: "Sep 28, 2023, 2:30:00 PM"
export function formatDate(dateString: string | Date): string {
  let date = dateString;
  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  // Format the date using the options
  const formattedDate = date.toLocaleString("en-US", options);

  return formattedDate;
}

export function getSegmentsFromPath(path: string): string[] {
  return path
    .split("?")[0]
    .split("/")
    .filter((segment) => segment !== "");
}
