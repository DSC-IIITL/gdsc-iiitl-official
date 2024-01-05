import { verifyToken } from "@/lib/server/auth-utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import Auth from "@/components/Auth";

export const metadata: Metadata = {
  title: "User Login | GDSC IIITL",
  description: "Login to GDSC IIIT Lucknow.",
};

export default function UserLogin() {
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token, (auth) => auth.role === "user"))
    redirect("/user");

  const BASE_URL = process.env["BASE_URL"] ?? "http://localhost";

  return <Auth.Login baseUrl={BASE_URL} />;
}
