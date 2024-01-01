import { verifyToken } from "@/lib/server/auth-utils";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Login | GDSC IIITL",
  description: "Login to GDSC IIIT Lucknow.",
};

export default function UserLogin() {
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token, (auth) => auth.role === "user"))
    redirect("/user/dashboard");

  const BASE_URL = process.env["BASE_URL"] ?? "http://localhost";

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async></Script>
      <div
        id="g_id_onload"
        data-client_id="730424519169-ttsnlbjvio129marg0h2gsmvkphsr8lr.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-login_uri={`${BASE_URL}/api/auth/user`}
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin"
        data-size="large"
        data-locale="en-US"
        data-logo_alignment="left"
      ></div>
    </>
  );
}
