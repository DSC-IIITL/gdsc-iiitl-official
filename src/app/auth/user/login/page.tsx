import { verifyToken } from "@/lib/server/auth-utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import Auth from "@/components/Auth";
import { resolvePath } from "@/lib/resolve-path";

export const metadata: Metadata = {
  title: "User Login | GDSC IIITL",
  description: "Login to GDSC IIIT Lucknow.",
};

export default function UserLogin({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const redirectTo = searchParams.redirect ?? "/user";
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token, (auth) => auth.role === "user"))
    redirect(resolvePath(redirectTo).toString());

  const BASE_URL = process.env["BASE_URL"] ?? "http://localhost";

  return <Auth.UserLogin baseUrl={BASE_URL} />;
}
