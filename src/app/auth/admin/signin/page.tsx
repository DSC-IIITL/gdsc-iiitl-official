import Auth from "@/components/Auth";
import { resolvePath } from "@/lib/resolve-path";
import { verifyToken } from "@/lib/server/auth-utils";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Login | GDSC IIITL",
  description: "Login to GDSC IIIT Lucknow.",
};

export default function LoginPage() {
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token, (auth) => auth.role === "admin"))
    redirect(resolvePath("/admin").toString());

  return <Auth.SignIn />;
}
