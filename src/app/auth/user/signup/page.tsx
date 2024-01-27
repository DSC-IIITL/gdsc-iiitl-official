import AuthPage from "@/components/Auth";
import { resolvePath } from "@/lib/resolve-path";
import { verifyToken } from "@/lib/server/auth-utils";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "User Signup | GDSC IIITL",
  description: "Signup to GDSC IIIT Lucknow.",
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

  return <AuthPage.UserSignup baseUrl={BASE_URL} />;
}
