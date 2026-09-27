import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "./brand";

export function AppHeader({
  backHref = "/",
  backLabel = "Back to FindYourCruze",
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <Brand />
        <Link className="app-back" href={backHref}>
          <ArrowLeft aria-hidden="true" size={15} /> {backLabel}
        </Link>
      </div>
    </header>
  );
}
