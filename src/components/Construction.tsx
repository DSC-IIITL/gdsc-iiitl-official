import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import ConstructionImage from "../../public/construction.svg";
import GDSCBanner from "./Logos/GDSCBanner";

export function UnderConstruction() {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          gap: "2.5rem",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <GDSCBanner />
        <Typography variant="h4" gutterBottom>
          Page Under Construction
        </Typography>
        <Image src={ConstructionImage} alt="Construction Image" height={150} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          We&apos;re working on something awesome. Please check back later.
        </Typography>
      </Box>
    </Container>
  );
}
