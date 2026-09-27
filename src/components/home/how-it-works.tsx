import { ArrowDownLeft, ArrowUpRight, HeartHandshake } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Start with real life",
    copy: "Tell us your budget, routines and the trade-offs you’re comfortable with.",
    icon: ArrowDownLeft,
  },
  {
    number: "02",
    title: "Find your taste",
    copy: "A quick visual round helps us understand what makes you stop and look.",
    icon: HeartHandshake,
  },
  {
    number: "03",
    title: "Meet your matches",
    copy: "Get three considered picks, plus the reasons and ownership costs behind them.",
    icon: ArrowUpRight,
  },
];

export function HowItWorks() {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-heading">
        <span className="section-kicker">A better way to choose</span>
        <h2>
          Less scrolling.
          <br />
          <span>More certainty.</span>
        </h2>
        <p>
          FindYourCruze turns a big, noisy decision into a few clear choices you
          can feel good about.
        </p>
      </div>
      <div className="steps-grid">
        {steps.map(({ number, title, copy, icon: Icon }) => (
          <article className="step-card" key={number}>
            <div className="step-card-top">
              <span>{number}</span>
              <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
