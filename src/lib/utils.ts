// Example usage:
// const prismaDateString = "2023-09-28T14:30:00.000Z";
// const formattedDate = formatPrismaDateForUI(prismaDateString);

import { ReadonlyURLSearchParams } from "next/navigation";

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

export function SeqBrandColor() {
  const colors = ["#34A853", "#EA4335", "#4285F4", "#FBBC05"] as const;

  let idx = -1;

  return function getColor() {
    const color = colors[idx];
    idx = (idx + 1) % colors.length;
    return color;
  };
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractEnrollmentNumber(email: string) {
  // Email will be of form <enrollment_number>@iiitl.ac.in
  const enrollmentNumber = email.split("@")[0];
  const domain = email.split("@")[1];
  if (domain !== "iiitl.ac.in") {
    throw new Error("Invalid email");
  }
  return enrollmentNumber;
}

export function createQueryString(
  searchParams: ReadonlyURLSearchParams,
  params: Record<string, string>
) {
  const newSearchParams = new URLSearchParams(searchParams);
  for (const [key, value] of Object.entries(params)) {
    newSearchParams.set(key, value);
  }
  return newSearchParams.toString();
}
