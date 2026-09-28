import Link from "next/link";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <Brand />
          <p>Find the car that fits you.</p>
        </div>
        <div className="footer-links">
          <Link href="/find">Find your car</Link>
          <Link href="/catalogue">Browse cars</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/garage">My garage</Link>
        </div>
        <p className="footer-note">Demo estimates only · Lebanon market</p>
      </div>
    </footer>
  );
}
