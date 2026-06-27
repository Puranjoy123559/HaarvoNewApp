import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  href?: string; // if set, clicking the logo navigates here
}

export default function Logo({ variant = "light", className = "h-8", href }: LogoProps) {
  const src = variant === "dark" ? "/haarvo-logo-dark.png" : "/haarvo-logo.png";

  // eslint-disable-next-line @next/next/no-img-element
  const image = <img src={src} alt="Haarvo" className={`w-auto ${className}`} />;

  // When an href is given, wrap the logo in a link (Next.js client-side navigation)
  if (href) {
    return (
      <Link href={href} className="inline-block">
        {image}
      </Link>
    );
  }

  return image;
}