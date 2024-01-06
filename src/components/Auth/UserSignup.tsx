"use client";

import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { Toaster } from "react-hot-toast";
import GDSCBanner from "../Logos/GDSCBanner";
import Copyright from "../Copyright";
import Script from "next/script";

type SignupPageProps = {
  baseUrl?: string;
};

export default function Signup(props: SignupPageProps) {
  const BASE_URL = props.baseUrl ?? "http://localhost";
  return (
    <>
      <Toaster position="top-center" />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <GDSCBanner />
          <Typography component="h1" variant="h5">
            User Signup
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Script src="https://accounts.google.com/gsi/client" async></Script>
            <div
              id="g_id_onload"
              data-client_id="730424519169-ttsnlbjvio129marg0h2gsmvkphsr8lr.apps.googleusercontent.com"
              data-context="signup"
              data-ux_mode="popup"
              data-login_uri={`${BASE_URL}/api/auth/user`}
              data-auto_prompt="false"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signup"
              data-size="large"
              data-locale="en-US"
              data-logo_alignment="left"
            ></div>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
}
