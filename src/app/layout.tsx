import * as React from "react";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDSC IIITL",
  description: "Welcome to the official website of GDSC IIIT Lucknow.",
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
