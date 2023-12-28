import { verifyToken } from "@/lib/server/auth-utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";

export default function UserLogin() {
  const token = cookies().get("token")?.value;
  if (token && verifyToken(token, (auth) => auth.role === "user"))
    redirect("/user/dashboard");

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" async></Script>
      <div
        id="g_id_onload"
        data-client_id="730424519169-ttsnlbjvio129marg0h2gsmvkphsr8lr.apps.googleusercontent.com"
        data-context="signup"
        data-ux_mode="popup"
        data-login_uri="http://localhost/api/admin/user"
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
