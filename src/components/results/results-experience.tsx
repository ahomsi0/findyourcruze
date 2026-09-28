"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, CircleHelp, Heart, Scale } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CarImage } from "@/components/cars/car-image";
import { cars } from "@/data/cars";
import { demoMarket } from "@/data/market";
import { calculateOwnershipCost } from "@/features/affordability/calculate-ownership-cost";
import { filterCars } from "@/features/recommendation/filters";
import { rankCars } from "@/features/recommendation/rank-cars";
import { formatCurrency } from "@/lib/format";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useGarageStore } from "@/store/garage-store";
import { useRecommendationStore } from "@/store/recommendation-store";

export function ResultsExperience() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const reduceMotion = useReducedMotion();
  const answers = useRecommendationStore((state) => state.answers);
  const likedCarIds = useRecommendationStore((state) => state.likedCarIds);
  const dislikedCarIds = useRecommendationStore(
    (state) => state.dislikedCarIds,
  );
  const addCar = useGarageStore((state) => state.addCar);
  const addToCompare = useGarageStore((state) => state.addToCompare);
  const setCompare = useGarageStore((state) => state.setCompare);
  const carIdsInGarage = useGarageStore((state) => state.carIds);
  const compareIds = useGarageStore((state) => state.compareIds);

  const candidates = useMemo(() => filterCars(cars, answers), [answers]);
  const results = useMemo(
    () => rankCars(cars, answers, { likedCarIds, dislikedCarIds }).slice(0, 3),
    [answers, dislikedCarIds, likedCarIds],
  );
  const readyForResults = Boolean(
    answers.budget && answers.monthlyKm && answers.bodyType,
  );

  if (!hydrated)
    return (
      <>
        <AppHeader />
        <main className="app-main">
          <div className="loading-state">Gathering your matches…</div>
        </main>
      </>
    );

  if (!readyForResults) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main">
          <div className="empty-state">
            <div className="empty-icon">
              <CircleHelp size={20} />
            </div>
            <h2>Let’s get to know your needs first</h2>
            <p>
              A few quick questions give FindYourCruze enough context to make
              the shortlist useful.
            </p>
            <Link className="solid-button" href="/find">
              Start finding my car <ArrowRight size={14} />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="app-shell">
        <AppHeader backHref="/find" backLabel="Adjust my answers" />
        <main className="app-main">
          <div className="empty-state">
            <div className="empty-icon">
              <CircleHelp size={20} />
            </div>
            <h2>Your search is a little too specific</h2>
            <p>
              The current demo collection has no cars that satisfy every hard
              requirement. Loosen one choice and we’ll keep looking.
            </p>
            <Link className="solid-button" href="/find">
              Adjust my answers <ArrowRight size={14} />
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const compareAll = () => {
    setCompare(results.map((result) => result.carId));
    router.push("/compare");
  };

  return (
    <div className="app-shell">
      <AppHeader backHref="/" backLabel="Back to FindYourCruze" />
      <main className="app-main">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="results-intro"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
          <span className="section-kicker">
            {candidates.length
              ? `A clearer place to start · ${candidates.length} cars fit your essentials`
              : "No exact fits · closest options from our demo market"}
          </span>
          <h1>
            We’ve seen enough.
            <br />
            <em>Here are your three.</em>
          </h1>
          <p>
            {candidates.length
              ? "Matched to your practical needs, your priorities and the cars you liked."
              : "These options come closest to your choices. Review each trade-off to see where it differs from your brief."}
          </p>
        </motion.div>

        <div className="results-grid">
          {results.map((result, index) => {
            const car = cars.find((item) => item.id === result.carId);
            if (!car) return null;
            const ownership = calculateOwnershipCost(car, answers, demoMarket);
            const saved = carIdsInGarage.includes(car.id);
            const currentCompare = compareIds.includes(car.id);
            return (
              <motion.article
                animate={{ opacity: 1, y: 0 }}
                className="match-card"
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                key={car.id}
                transition={{
                  duration: reduceMotion ? 0 : 0.32,
                  delay: reduceMotion ? 0 : index * 0.08,
                }}
              >
                <div className="match-card-image">
                  <CarImage car={car} />
                  <span className="rank-label">#{index + 1}</span>
                  <span
                    aria-label={`${result.match}% match`}
                    className="match-score-pill"
                  >
                    {result.match}% fit
                  </span>
                </div>
                <div className="match-card-body">
                  <div className="match-card-title-row">
                    <div>
                      <h2>
                        {car.make} {car.model}
                      </h2>
                      <p>
                        {car.yearStart}–{car.yearEnd} · {car.bodyType}
                      </p>
                    </div>
                    <div className="match-price">
                      {formatCurrency(car.priceMin)}
                      <span>from · up to {formatCurrency(car.priceMax)}</span>
                    </div>
                  </div>
                  <ul className="match-reasons">
                    {result.reasons.map((reason) => (
                      <li key={reason}>
                        <Check aria-hidden="true" size={13} /> {reason}
                      </li>
                    ))}
                  </ul>
                  <p className="match-tradeoff">
                    <span>Worth knowing</span>
                    {result.tradeoffs[0]}
                  </p>
                  <details className="reason-details">
                    <summary>Why did FindYourCruze recommend this?</summary>
                    <div className="score-list">
                      {result.scoreBreakdown.map((point) => (
                        <div
                          className={`score-line ${point.points < 0 ? "negative" : ""}`}
                          key={`${point.label}-${point.points}`}
                        >
                          <span>{point.label}</span>
                          <strong>
                            {point.points > 0 ? "+" : ""}
                            {point.points}
                          </strong>
                        </div>
                      ))}
                      <p className="estimate-note">
                        An explainable demo score, based on the preferences you
                        shared. It is not a probability of satisfaction.
                      </p>
                    </div>
                  </details>
                  <p className="estimate-note">
                    Estimated ownership:{" "}
                    {formatCurrency(ownership.totalMonthly)} / month with demo
                    market assumptions.
                  </p>
                  <div className="match-card-actions">
                    <Link href={`/cars/${car.slug}`}>
                      View car <ArrowRight aria-hidden="true" size={12} />
                    </Link>
                    <button
                      aria-label={
                        saved
                          ? `${car.make} ${car.model} is saved in your garage`
                          : `Save ${car.make} ${car.model} to your garage`
                      }
                      className="text-button"
                      onClick={() => addCar(car.id)}
                      type="button"
                    >
                      {saved ? (
                        "Saved"
                      ) : (
                        <>
                          <Heart aria-hidden="true" size={12} /> Save
                        </>
                      )}
                    </button>
                    <button
                      aria-label={
                        currentCompare
                          ? `${car.make} ${car.model} is on your compare list`
                          : `Add ${car.make} ${car.model} to compare`
                      }
                      className="text-button"
                      disabled={!currentCompare && compareIds.length >= 3}
                      onClick={() => addToCompare(car.id)}
                      type="button"
                    >
                      {currentCompare ? (
                        "Comparing"
                      ) : (
                        <>
                          <Scale aria-hidden="true" size={12} /> Compare
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="result-compare-row">
          <button className="solid-button" onClick={compareAll} type="button">
            Compare these three <Scale aria-hidden="true" size={14} />
          </button>
          <Link className="outline-button" href="/garage">
            Go to my garage <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </div>
        <p className="mock-disclaimer">
          FindYourCruze’s vehicle details and ownership figures are illustrative
          demo estimates, not live listings or financial advice. Actual prices,
          financing terms, fuel costs, insurance and maintenance vary by vehicle
          condition, seller and market.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
