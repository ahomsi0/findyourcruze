import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link aria-label="Motch home" className="brand-mark" href="/">
      <span className="brand-icon" aria-hidden="true">
        m
      </span>
      {!compact && (
        <span className="brand-word">
          motch<span>.</span>
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
