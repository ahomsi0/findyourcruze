import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link aria-label="FindYourCruze home" className="brand-mark" href="/">
      <span className="brand-icon" aria-hidden="true">
        <svg fill="none" viewBox="0 0 32 32">
          <path
            d="M8 25c0-5 3.4-8 7.8-8s7.2-2.5 7.2-8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.8"
          />
          <circle cx="8" cy="25" r="1.6" fill="#d9e2d4" />
          <circle cx="23" cy="9" r="3.2" fill="#e56e4b" />
          <circle cx="23" cy="9" r="1.1" fill="#183633" />
        </svg>
      </span>
      {!compact && (
        <span className="brand-word">
          findyour<span>cruze</span>
        </span>
      )}
    </Link>
  );
}

export function BrandLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="brand-link" href={href}>
      {children}
      <ArrowUpRight aria-hidden="true" size={14} />
    </Link>
  );
}
