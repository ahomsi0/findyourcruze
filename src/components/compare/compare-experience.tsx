"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Scale } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cars } from "@/data/cars";
import { demoMarket } from "@/data/market";
import { calculateOwnershipCost } from "@/features/affordability/calculate-ownership-cost";
import {
  categoryLabels,
  scoreCategories,
  type Car,
  type ScoreCategory,
} from "@/types/car";
import { formatCurrency } from "@/lib/format";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useGarageStore } from "@/store/garage-store";
import { useRecommendationStore } from "@/store/recommendation-store";

interface CompareMetric {
  label: string;
  values: Array<{ display: string; score: number }>;
  priority?: ScoreCategory;
}

function metricsFor(
  selectedCars: Car[],
  monthlyKm: number,
  purchaseMethod: string | undefined,
): CompareMetric[] {
  return [
    {
      label: "Price range",
      values: selectedCars.map((car) => ({
        display: `${formatCurrency(car.priceMin)}–${formatCurrency(car.priceMax)}`,
        score: car.priceMax,
      })),
    },
    {
      label: "Estimated monthly ownership",
      values: selectedCars.map((car) => {
        const estimate = calculateOwnershipCost(
          car,
          {
            monthlyKm,
            purchaseMethod: purchaseMethod as
              "cash" | "financing" | "either" | undefined,
          },
          demoMarket,
        );
        return {
          display: `${formatCurrency(estimate.totalMonthly)} / mo`,
          score: estimate.totalMonthly,
        };
      }),
    },
    {
      label: "Energy consumption",
      values: selectedCars.map((car) =>
        car.fuelType === "electric"
          ? {
              display: `${car.electricConsumption} kWh / 100 km`,
              score: car.electricConsumption ?? 0,
            }
          : {
              display: `${car.fuelConsumption} L / 100 km`,
              score: car.fuelConsumption ?? 0,
            },
      ),
    },
    {
      label: "Horsepower",
      values: selectedCars.map((car) => ({
        display: `${car.horsepower} hp`,
        score: car.horsepower,
      })),
      priority: "performance",
    },
    {
      label: "0–100 km/h",
      values: selectedCars.map((car) => ({
        display: car.zeroToHundred ? `${car.zeroToHundred} sec` : "—",
        score: car.zeroToHundred ?? 20,
      })),
    },
    ...scoreCategories.map((category) => ({
      label: categoryLabels[category],
      values: selectedCars.map((car) => ({
        display: `${car.scores[category]} / 10`,
        score: car.scores[category],
      })),
      priority: category,
    })),
  ];
}

function performanceScore(metric: CompareMetric, value: number): number {
  if (
    metric.label === "Price range" ||
    metric.label === "Estimated monthly ownership" ||
    metric.label === "0–100 km/h"
  ) {
    return Math.max(
      12,
      Math.min(
        100,
        100 -
          (value / Math.max(...metric.values.map((entry) => entry.score), 1)) *
            72,
      ),
    );
  }
  return Math.min(
    100,
    Math.max(
      12,
      value <= 10
        ? value * 10
        : (value / Math.max(...metric.values.map((entry) => entry.score), 1)) *
            100,
    ),
  );
}

export function CompareExperience() {
  const hydrated = useStoresHydrated();
  const compareIds = useGarageStore((state) => state.compareIds);
  const addToCompare = useGarageStore((state) => state.addToCompare);
  const removeFromCompare = useGarageStore((state) => state.removeFromCompare);
  const answers = useRecommendationStore((state) => state.answers);
  const selectedCars = useMemo(
    () =>
      compareIds
        .map((id) => cars.find((car) => car.id === id))
        .filter((car) => car !== undefined)
        .slice(0, 3),
    [compareIds],
  );
  const priority = answers.priorities?.[0];
  const metrics = useMemo(
    () =>
      metricsFor(
        selectedCars,
        answers.monthlyKm ?? 1000,
        answers.purchaseMethod,
      ),
    [answers.monthlyKm, answers.purchaseMethod, selectedCars],
  );

  if (!hydrated)
    return (
      <div className="app-shell">
        <SiteHeader />
        <main className="app-main">
          <div className="loading-state">Preparing your comparison…</div>
        </main>
        <SiteFooter />
      </div>
    );

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <div className="page-intro">
          <span className="section-kicker">
            <Scale aria-hidden="true" size={12} /> Side by side, on your terms
          </span>
          <h1>Compare the feeling and the facts.</h1>
          <p>
            Choose up to three cars. Each one makes a different kind of sense;
            your priorities help decide which details matter most.
          </p>
        </div>

        <div aria-label="Choose cars to compare" className="compare-pick-list">
          {cars.map((car) => {
            const selected = compareIds.includes(car.id);
            const disabled = !selected && compareIds.length >= 3;
            return (
              <button
                aria-pressed={selected}
                className={`compare-pick ${selected ? "selected" : ""}`}
                disabled={disabled}
                key={car.id}
                onClick={() =>
                  selected ? removeFromCompare(car.id) : addToCompare(car.id)
                }
                type="button"
              >
                {selected ? <Check aria-hidden="true" size={11} /> : null}
                {car.make} {car.model}
              </button>
            );
          })}
        </div>

        {selectedCars.length >= 2 ? (
          <>
            <p className="priority-note">
              {priority
                ? `Based on your priorities, ${categoryLabels[priority].toLowerCase()} matters highly to you.`
                : "This comparison highlights practical differences without naming one car as the winner."}
            </p>
            <div
              aria-label="Car comparison"
              className="compare-grid"
              role="region"
            >
              <div>At a glance</div>
              {Array.from({ length: 3 }).map((_, index) => {
                const car = selectedCars[index];
                return (
                  <div
                    className="compare-car-heading"
                    key={car?.id ?? `empty-${index}`}
                  >
                    {car ? (
                      <>
                        <strong>
                          {car.make} {car.model}
                        </strong>
                        <span>
                          {car.yearStart}–{car.yearEnd}
                        </span>
                        <Link href={`/cars/${car.slug}`}>
                          View details <ArrowRight size={10} />
                        </Link>
                      </>
                    ) : (
                      <span>Add one more car</span>
                    )}
                  </div>
                );
              })}
              {metrics.map((metric) => (
                <CompareRow
                  key={metric.label}
                  metric={metric}
                  priority={priority}
                  selectedCars={selectedCars}
                />
              ))}
            </div>
            <p className="mock-disclaimer">
              Ownership cost and vehicle details are illustrative demo estimates
              for the Lebanon market. They are not live listing data; confirm a
              specific car’s condition and terms before making a decision.
            </p>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Scale size={19} />
            </div>
            <h2>Pick at least two cars to compare</h2>
            <p>
              Use the choices above. Start with your FindYourCruze matches or
              add cars you’ve saved in your garage.
            </p>
            <Link className="solid-button" href="/find">
              Find my car <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function CompareRow({
  metric,
  selectedCars,
  priority,
}: {
  metric: CompareMetric;
  selectedCars: Car[];
  priority?: ScoreCategory;
}) {
  const reduceMotion = useReducedMotion();
  const prioritize = priority && metric.priority === priority;

  return (
    <>
      <div>
        {metric.label}
        {prioritize && (
          <span className="priority-star" aria-label="One of your priorities">
            {" "}
            · priority
          </span>
        )}
      </div>
      {Array.from({ length: 3 }).map((_, index) => {
        const value = metric.values[index];
        const car = selectedCars[index];
        if (!value || !car)
          return (
            <div aria-hidden="true" key={`blank-${metric.label}-${index}`} />
          );
        return (
          <div className="compare-value" key={car.id}>
            {value.display}
            {metric.label !== "Energy consumption" && (
              <div className="compare-bar">
                <motion.span
                  animate={{
                    width: `${performanceScore(metric, value.score)}%`,
                  }}
                  initial={{
                    width: reduceMotion
                      ? `${performanceScore(metric, value.score)}%`
                      : 0,
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.55,
                    ease: "easeOut",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
