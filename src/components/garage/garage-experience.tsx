"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Heart, Scale, Trash2 } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CarImage } from "@/components/cars/car-image";
import { formatCurrency } from "@/lib/format";
import { cars } from "@/data/cars";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useGarageStore } from "@/store/garage-store";

export function GarageExperience() {
  const hydrated = useStoresHydrated();
  const carIds = useGarageStore((state) => state.carIds);
  const compareIds = useGarageStore((state) => state.compareIds);
  const addToCompare = useGarageStore((state) => state.addToCompare);
  const removeFromCompare = useGarageStore((state) => state.removeFromCompare);
  const removeCar = useGarageStore((state) => state.removeCar);
  const savedCars = useMemo(
    () =>
      carIds
        .map((id) => cars.find((car) => car.id === id))
        .filter((car) => car !== undefined),
    [carIds],
  );

  if (!hydrated)
    return (
      <div className="app-shell">
        <SiteHeader />
        <main className="app-main">
          <div className="loading-state">Opening your garage…</div>
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
            <Heart aria-hidden="true" size={12} /> Saved for later
          </span>
          <h1>My garage</h1>
          <p>
            A small collection of cars you’re considering. Everything stays on
            this device.
          </p>
        </div>
        {savedCars.length ? (
          <>
            <div className="garage-grid">
              {savedCars.map((car) => {
                const inCompare = compareIds.includes(car.id);
                const full = compareIds.length >= 3;
                return (
                  <article className="garage-card" key={car.id}>
                    <CarImage car={car} />
                    <div className="garage-card-body">
                      <h2>
                        {car.make} {car.model}
                      </h2>
                      <p>
                        {car.yearStart}–{car.yearEnd} ·{" "}
                        {formatCurrency(car.priceMin)}–
                        {formatCurrency(car.priceMax)}
                      </p>
                      <div className="garage-card-actions">
                        <Link
                          className="outline-button"
                          href={`/cars/${car.slug}`}
                        >
                          View <ArrowRight size={12} />
                        </Link>
                        <button
                          className="outline-button"
                          disabled={!inCompare && full}
                          onClick={() =>
                            inCompare
                              ? removeFromCompare(car.id)
                              : addToCompare(car.id)
                          }
                          type="button"
                        >
                          <Scale size={12} /> {inCompare ? "Added" : "Compare"}
                        </button>
                        <button
                          aria-label={`Remove ${car.make} ${car.model} from garage`}
                          className="danger-quiet"
                          onClick={() => removeCar(car.id)}
                          type="button"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="result-compare-row">
              <span className="garage-counter">
                <Scale size={13} /> {compareIds.length} of 3 selected for
                comparison
              </span>
              <Link className="solid-button" href="/compare">
                Compare cars <ArrowRight size={14} />
              </Link>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Heart size={19} />
            </div>
            <h2>Your garage is ready for a first pick</h2>
            <p>
              Save a car from your matches and it’ll be here when you come back.
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
