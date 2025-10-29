import { cn } from "@/lib/utils";
import Link from "next/link";
import LogoSvg from "@/assets/logo.png";
import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <Link {...props} href="/">
      <Image
        src={LogoSvg}
        alt="logo"
        className={cn("w-auto h-5", className)}
      />
    </Link>
  );
}
