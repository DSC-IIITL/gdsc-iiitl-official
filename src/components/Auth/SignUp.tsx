"use client";

import * as React from "react";
import {
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Grid,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GDSCBanner from "@/components/Logos/GDSCBanner";
import { useRouter } from "next/navigation";
import Copyright from "@/components/Copyright";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("SUBMIT");
    event.preventDefault();

    // Check if the passwords match
    const password = event.currentTarget["password"].value;
    const confirmPassword = event.currentTarget["confirm-password"].value;
    if (password !== confirmPassword) {
      console.log({ password, confirmPassword });
      toast.error("Passwords do not match");
      return;
    }

    const data = new FormData(event.currentTarget);
    setLoading(true);
    console.log(data);
    try {
      const response = await fetch("/api/auth/admin/signup", {
        method: "POST",
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          name: data.get("name"),
        }),
      });
      if (response.ok === false) {
        throw new Error("Something went wrong. Try again later.");
      }
      // TODO: Do something with the response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const json = await response.json();
      toast.success("Signed up successfully");
      router.push("/auth/admin/signin");
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          }}
        >
          <GDSCBanner />
          <Typography component="h1" variant="h5">
            Admin Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="new-password"
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              Sign Up
            </LoadingButton>
            <Grid container gap={"0.25rem"} alignItems={"center"}>
              {"Already have an account?"}
              <Link href="/auth/admin/signin" variant="body2">
                {"Sign In"}
              </Link>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
}
