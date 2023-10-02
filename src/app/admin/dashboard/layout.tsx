import Dashboard from "@/components/Dashboard";
import { verifyToken } from "@/lib/server/auth-utils";
import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
  if (!token || !verifyToken(token)) redirect("/signin");

  return (
    <html lang="en">
      <body>
        <Dashboard.Layout>{children}</Dashboard.Layout>
      </body>
    </html>
  );
}
