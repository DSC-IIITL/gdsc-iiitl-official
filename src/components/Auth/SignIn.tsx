"use client";

import * as React from "react";
import {
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GDSCBanner from "@/components/Logos/GDSCBanner";
import { useRouter, useSearchParams } from "next/navigation";
import Copyright from "@/components/Copyright";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // Get the redirect uri
  const redirectUri = useSearchParams().get("redirect");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("SUBMIT");
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    console.log(data);
    try {
      const response = await fetch("/api/auth/admin/signin", {
        method: "POST",
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          rememberMe: data.get("remember") === "remember" ? true : false,
        }),
      });
      if (response.ok === false) {
        throw new Error("Invalid Credentials");
      }
      // TODO: Do something with the response
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const json = await response.json();
      toast.success("Signed in successfully");
      router.push(redirectUri || "/admin");
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
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              name="remember"
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/admin/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
}
