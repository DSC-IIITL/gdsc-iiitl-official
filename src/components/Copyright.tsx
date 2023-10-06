import { Typography, Link, TypographyProps } from "@mui/material";

export default function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://dsc.iiitl.ac.in">
        GDSC IIITL
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
