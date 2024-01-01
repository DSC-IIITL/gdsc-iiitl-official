import Image from "next/image";
import GDSCLogoImage from "../../../public/gdsc.png";

export default function GDSCLogo({
  width = 128,
  height = 128,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={GDSCLogoImage}
      alt="GDSC Logo"
      width={width}
      height={height}
      style={{ borderRadius: "50%", userSelect: "none" }}
    />
  );
}
