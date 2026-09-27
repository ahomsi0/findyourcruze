import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";

const navigation = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Compare", href: "/compare" },
  { label: "My garage", href: "/garage" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="header-cta" href="/find">
          Find my car <ArrowUpRight aria-hidden="true" size={14} />
        </Link>
      </div>
    </header>
  );
}
