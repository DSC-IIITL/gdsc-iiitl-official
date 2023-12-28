import Image from "next/image";
import GDSCLogoImage from "../../../public/gdsc.png";

export default function GDSCLogo() {
  return (
    <Image
      src={GDSCLogoImage}
      alt="GDSC Logo"
      width={128}
      height={128}
      style={{ borderRadius: "50%", userSelect: "none" }}
    />
  );
}
