import Auth from "@/components/Auth";
import { verifyToken } from "@/lib/server/auth-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token, (auth) => auth.role === "admin"))
    redirect("/admin/dashboard");

  return <Auth.SignIn />;
}
