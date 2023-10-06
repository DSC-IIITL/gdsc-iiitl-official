import * as React from "react";

import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";

export const metadata = {
  title: "GDSC Leaderboard",
  description: "2023-24 Leaderboard for events by GDSC IIITL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
