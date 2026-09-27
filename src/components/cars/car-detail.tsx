"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CircleAlert,
  Gauge,
  Leaf,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CarActions } from "@/components/cars/car-actions";
import { CarImage } from "@/components/cars/car-image";
import { cars } from "@/data/cars";
import { demoMarket } from "@/data/market";
import { calculateOwnershipCost } from "@/features/affordability/calculate-ownership-cost";
import { rankCars } from "@/features/recommendation/rank-cars";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { formatCurrency, formatFuelType } from "@/lib/format";
import { categoryLabels, scoreCategories, type Car } from "@/types/car";
import { useRecommendationStore } from "@/store/recommendation-store";

export function CarDetail({ car }: { car: Car }) {
  const hydrated = useStoresHydrated();
  const answers = useRecommendationStore((state) => state.answers);
  const likedCarIds = useRecommendationStore((state) => state.likedCarIds);
  const dislikedCarIds = useRecommendationStore(
    (state) => state.dislikedCarIds,
  );
  const recommendations = useMemo(
    () => rankCars(cars, answers, { likedCarIds, dislikedCarIds }),
    [answers, dislikedCarIds, likedCarIds],
  );
  const recommendation = recommendations.find(
    (entry) => entry.carId === car.id,
  );
  const hasPreferences = Boolean(
    answers.budget && answers.monthlyKm && answers.bodyType,
  );
  const ownership = calculateOwnershipCost(car, answers, demoMarket);
  const similarCars = cars
    .filter((other) => other.id !== car.id)
    .map((other) => ({
      car: other,
      overlap:
        Number(other.bodyType === car.bodyType) * 2 +
        Number(other.fuelType === car.fuelType) +
        Number(other.make === car.make),
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((item) => item.car);

  const financeLabel =
    answers.purchaseMethod === "cash"
      ? "No finance payment assumed for this estimate."
      : "Estimate assumes a 20% down payment over 48 months at 9% APR.";

  return (
    <div className="app-shell">
      <AppHeader backHref="/results" backLabel="Back to your matches" />
      <main className="app-main">
        <section className="detail-hero">
          <CarImage car={car} className="detail-photo" />
          <div className="detail-title">
            <span className="section-kicker">
              <Sparkles aria-hidden="true" size={12} /> Motch car guide · Demo
              data
            </span>
            <h1>
              {car.make} {car.model}
            </h1>
            <p className="detail-subtitle">
              {car.trim} · {car.yearStart}–{car.yearEnd} model years
            </p>
            <p className="detail-price">
              {formatCurrency(car.priceMin)} — {formatCurrency(car.priceMax)}
              <span>Illustrative Lebanon market range</span>
            </p>
            <CarActions carId={car.id} />
            <dl className="detail-specs">
              <div>
                <dt>Power</dt>
                <dd>{car.horsepower} hp</dd>
              </div>
              <div>
                <dt>Fuel type</dt>
                <dd>{formatFuelType(car.fuelType)}</dd>
              </div>
              <div>
                <dt>Drivetrain</dt>
                <dd>{car.drivetrain}</dd>
              </div>
              <div>
                <dt>Transmission</dt>
                <dd>{car.transmission}</dd>
              </div>
              <div>
                <dt>Consumption</dt>
                <dd>
                  {car.fuelConsumption
                    ? `${car.fuelConsumption} L / 100 km`
                    : `${car.electricConsumption} kWh / 100 km`}
                </dd>
              </div>
              <div>
                <dt>0–100 km/h</dt>
                <dd>
                  {car.zeroToHundred
                    ? `${car.zeroToHundred} sec`
                    : "Not available"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="detail-section">
          <h2>Your Motch snapshot</h2>
          <div className="detail-score-grid">
            {scoreCategories.map((category) => (
              <div className="detail-score" key={category}>
                <span>{categoryLabels[category]}</span>
                <strong>
                  {car.scores[category]}
                  <small> / 10</small>
                </strong>
                <div
                  aria-label={`${categoryLabels[category]}: ${car.scores[category]} out of 10`}
                  className="detail-score-bar"
                  role="meter"
                  aria-valuenow={car.scores[category]}
                  aria-valuemin={0}
                  aria-valuemax={10}
                >
                  <span style={{ width: `${car.scores[category] * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2>Why it could fit you</h2>
          <div className="strength-tradeoff-grid">
            <div className="strength-panel">
              <h3>
                <ShieldCheck aria-hidden="true" size={15} /> Good things to know
              </h3>
              <ul>
                {(hasPreferences && recommendation?.reasons.length
                  ? recommendation.reasons
                  : car.strengths
                ).map((item) => (
                  <li key={item}>
                    <Check aria-hidden="true" size={13} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="strength-panel tradeoff">
              <h3>
                <CircleAlert aria-hidden="true" size={15} /> Trade-offs
              </h3>
              <ul>
                {(hasPreferences && recommendation?.tradeoffs.length
                  ? recommendation.tradeoffs
                  : car.weaknesses
                ).map((item) => (
                  <li key={item}>
                    <CircleAlert aria-hidden="true" size={13} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="estimate-note">
            {hydrated && hasPreferences && recommendation
              ? `Your current match score is ${recommendation.match}%, based on the answers saved in this browser.`
              : "Save a few preferences with Motch to see a personal match score here."}
          </p>
        </section>

        <section className="detail-section">
          <h2>
            <Gauge aria-hidden="true" size={19} /> Ownership reality check
          </h2>
          <div className="cost-panel">
            <div className="cost-row">
              <span>Vehicle price (mid-range)</span>
              <strong>{formatCurrency(ownership.vehiclePrice)}</strong>
            </div>
            <div className="cost-row">
              <span>Estimated down payment</span>
              <strong>{formatCurrency(ownership.downPayment)}</strong>
            </div>
            <div className="cost-row">
              <span>Finance payment</span>
              <strong>{formatCurrency(ownership.financePayment)} / mo</strong>
            </div>
            <div className="cost-row">
              <span>
                {car.fuelType === "electric" ? "Electricity" : "Fuel"} ·{" "}
                {answers.monthlyKm ?? 1000} km / mo
              </span>
              <strong>{formatCurrency(ownership.energy)} / mo</strong>
            </div>
            <div className="cost-row">
              <span>Insurance estimate</span>
              <strong>{formatCurrency(ownership.insurance)} / mo</strong>
            </div>
            <div className="cost-row">
              <span>Maintenance reserve</span>
              <strong>{formatCurrency(ownership.maintenance)} / mo</strong>
            </div>
            <div className="cost-row">
              <span>Registration estimate</span>
              <strong>{formatCurrency(ownership.registration)} / mo</strong>
            </div>
            <div className="cost-total">
              <span>Estimated monthly cost</span>
              <strong>{formatCurrency(ownership.totalMonthly)}</strong>
            </div>
          </div>
          <p className="estimate-note">
            <Leaf aria-hidden="true" size={12} /> Estimates use{" "}
            {demoMarket.name} assumptions: fuel $
            {demoMarket.fuelPricePerLiter.toFixed(2)}/L, electricity $
            {demoMarket.electricityPricePerKwh.toFixed(2)}/kWh, insurance $
            {demoMarket.monthlyInsurance}/mo and registration $
            {demoMarket.annualRegistration}/year. {financeLabel} Actual costs
            can differ significantly.
          </p>
        </section>

        <section className="detail-section">
          <h2>Cars with a similar feel</h2>
          <div className="garage-grid">
            {similarCars.map((similar) => (
              <Link
                className="garage-card"
                href={`/cars/${similar.slug}`}
                key={similar.id}
              >
                <CarImage car={similar} />
                <div className="garage-card-body">
                  <h2>
                    {similar.make} {similar.model}
                  </h2>
                  <p>
                    {similar.bodyType} · {formatCurrency(similar.priceMin)}–
                    {formatCurrency(similar.priceMax)}
                  </p>
                  <span className="brand-link">
                    Take a closer look <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <p className="mock-disclaimer">
          All vehicle descriptions, ratings and ownership calculations are
          mock/demo information to help explore Motch. Confirm vehicle
          condition, local availability and current market prices independently.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
