import React from "react";
import { verifyToken } from "@/lib/server/auth-utils";
import type { Metadata } from "next";
import { cookies } from "next/headers";
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
  const token = cookies().get("token")?.value;
  if (!token || !verifyToken(token, (auth) => auth.role === "admin"))
    redirect("/auth/admin/signin");

  return (
    <html lang="en">
      <body>
        <AdminDashboard.Layout>{children}</AdminDashboard.Layout>
      </body>
    </html>
  );
}
