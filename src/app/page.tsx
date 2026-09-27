import Link from "next/link";
import { ArrowRight, Check, Clock3, Compass, ShieldCheck } from "lucide-react";
import { MatchmakingPreview } from "@/components/home/matchmaking-preview";
import { HowItWorks } from "@/components/home/how-it-works";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" /> A more human way to shop for
              a car
            </div>
            <h1>
              Stop searching
              <br />
              through <em>hundreds</em>
              <br />
              of cars.
            </h1>
            <p className="hero-description">
              Tell us how you drive. Motch will narrow your options down to the
              cars that actually fit you.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/find">
                Find my car <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <a className="text-action" href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-note">
              <ShieldCheck aria-hidden="true" size={15} /> Thoughtful picks. No
              pressure.
            </div>
            <div className="hero-metrics">
              <div>
                <strong>~2 min</strong>
                <span>to get started</span>
              </div>
              <span className="metric-divider" />
              <div>
                <strong>20 cars</strong>
                <span>in our demo market</span>
              </div>
              <span className="metric-divider" />
              <div>
                <strong>3 matches</strong>
                <span>worth your time</span>
              </div>
            </div>
          </div>
          <MatchmakingPreview />
        </section>

        <div className="trust-strip">
          <span>Car shopping, with a little more clarity</span>
          <span className="trust-item">
            <Check size={14} /> Your priorities matter
          </span>
          <span className="trust-item">
            <Check size={14} /> Honest trade-offs
          </span>
          <span className="trust-item">
            <Check size={14} /> Running costs included
          </span>
        </div>

        <HowItWorks />

        <section className="closing-cta">
          <div className="closing-orb" />
          <div className="closing-content">
            <span className="section-kicker">
              Your next chapter starts here
            </span>
            <h2>
              There’s a car that
              <br />
              <em>just makes sense.</em>
            </h2>
            <p>
              Let’s find it together. A few quick questions are all it takes to
              get moving.
            </p>
            <Link className="button-light" href="/find">
              Find my car <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="closing-mark" aria-hidden="true">
            m<span>.</span>
          </div>
          <div className="closing-meta">
            <span>
              <Clock3 size={13} /> No account needed
            </span>
            <span>
              <Compass size={13} /> Built for your everyday
            </span>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
