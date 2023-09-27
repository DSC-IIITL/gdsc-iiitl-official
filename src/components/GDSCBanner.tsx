import Image from "next/image";
import GDSCBannerImage from "../../public/gdsc-banner.png";

export default function GDSCBanner() {
  return (
    <Image
      src={GDSCBannerImage}
      alt="GDSC Logo"
      style={{ borderRadius: "4rem", userSelect: "none" }}
    />
  );
}
