import React from "react";
import { verifyToken } from "@/lib/server/auth-utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import UserDashboard from "@/components/User/Dashboard";

// PROTECTED ROUTES

export const metadata: Metadata = {
  title: "User Dashboard | GDSC IIITL",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = headers().get("x-url"); // From the middleware

  const token = cookies().get("token")?.value;
  if (!token || !verifyToken(token, (auth) => auth.role === "user"))
    redirect(
      url == null
        ? `/auth/user/login`
        : `/auth/user/login?redirect=${encodeURIComponent(url)}`
    );

  return (
    <html lang="en">
      <body>
        <UserDashboard.Layout>{children}</UserDashboard.Layout>
      </body>
    </html>
  );
}
