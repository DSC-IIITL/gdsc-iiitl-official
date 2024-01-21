import React from "react";
import { verifyToken } from "@/lib/server/auth-utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/Admin/Dashboard";

// PROTECTED ROUTES

export const metadata: Metadata = {
  title: "Dashboard | GDSC IIITL",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = headers().get("x-url"); // From the middleware

  const token = cookies().get("token")?.value;
  if (!token || !verifyToken(token, (auth) => auth.role === "admin"))
    redirect(
      url == null
        ? `/auth/admin/signin`
        : `/auth/admin/signin?redirect=${encodeURIComponent(url)}`
    );

  return (
    <html lang="en">
      <body>
        <AdminDashboard.Layout>{children}</AdminDashboard.Layout>
      </body>
    </html>
  );
}
