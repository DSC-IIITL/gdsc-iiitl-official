import Image from "next/image";
import GithubImage from "../../public/github2.png";

export default function GithubLogo() {
  return (
    <Image
      src={GithubImage}
      alt="Github Logo"
      width={30}
      height={30}
      style={{ borderRadius: "50%", userSelect: "none" }}
    />
  );
}
