import SignInPage from "@/components/SignIn";
import { verifyToken } from "@/lib/server/auth-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token)) redirect("/admin/dashboard");

  return <SignInPage.SignIn />;
}
