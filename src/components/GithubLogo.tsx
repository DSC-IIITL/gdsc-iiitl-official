import Image from "next/image";
import GithubImage from "../../public/github.png";

export default function GithubLogo() {
  return (
    <Image
      src={GithubImage}
      alt="Github Logo"
      width={50}
      height={50}
      style={{ borderRadius: "50%", userSelect: "none" }}
    />
  );
}
