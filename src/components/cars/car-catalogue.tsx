"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { CarImage } from "@/components/cars/car-image";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cars } from "@/data/cars";
import { formatCurrency } from "@/lib/format";
import {
  bodyTypeLabels,
  bodyTypes,
  fuelTypeLabels,
  fuelTypes,
  type BodyType,
  type FuelType,
} from "@/types/car";

type CatalogueSort = "make" | "price-low" | "price-high" | "newest";

export function CarCatalogue() {
  const [query, setQuery] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | "all">("all");
  const [fuelType, setFuelType] = useState<FuelType | "all">("all");
  const [sort, setSort] = useState<CatalogueSort>("make");

  const visibleCars = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = cars.filter((car) => {
      const matchesQuery =
        !normalizedQuery ||
        [car.make, car.model, car.trim, car.bodyType, car.fuelType]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(normalizedQuery));
      return (
        matchesQuery &&
        (bodyType === "all" || car.bodyType === bodyType) &&
        (fuelType === "all" || car.fuelType === fuelType)
      );
    });

    return filtered.sort((a, b) => {
      if (sort === "price-low") return a.priceMin - b.priceMin;
      if (sort === "price-high") return b.priceMin - a.priceMin;
      if (sort === "newest") return b.yearEnd - a.yearEnd;
      return a.make.localeCompare(b.make) || a.model.localeCompare(b.model);
    });
  }, [bodyType, fuelType, query, sort]);

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <div className="page-intro">
          <span className="section-kicker">The FindYourCruze collection</span>
          <h1>Browse all cars</h1>
          <p>
            Explore every car in our demo market. Search by make or model, then
            narrow the list by body style or fuel type.
          </p>
        </div>

        <section aria-label="Search and filter cars" className="catalogue-tools">
          <label className="catalogue-search">
            <Search aria-hidden="true" size={17} />
            <input
              aria-label="Search by make, model or trim"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search make, model or trim"
              type="search"
              value={query}
            />
          </label>
          <div className="catalogue-selects">
            <label>
              <span>Body style</span>
              <select
                aria-label="Filter by body style"
                onChange={(event) =>
                  setBodyType(event.target.value as BodyType | "all")
                }
                value={bodyType}
              >
                <option value="all">All body styles</option>
                {bodyTypes.map((type) => (
                  <option key={type} value={type}>
                    {bodyTypeLabels[type]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Fuel</span>
              <select
                aria-label="Filter by fuel type"
                onChange={(event) =>
                  setFuelType(event.target.value as FuelType | "all")
                }
                value={fuelType}
              >
                <option value="all">All fuel types</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>
                    {fuelTypeLabels[type]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select
                aria-label="Sort cars"
                onChange={(event) =>
                  setSort(event.target.value as CatalogueSort)
                }
                value={sort}
              >
                <option value="make">Make A–Z</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="newest">Newest model years</option>
              </select>
            </label>
          </div>
        </section>

        <p aria-live="polite" className="catalogue-count">
          Showing <strong>{visibleCars.length}</strong> of {cars.length} cars
        </p>

        {visibleCars.length ? (
          <div className="catalogue-grid">
            {visibleCars.map((car) => (
              <article className="catalogue-card" key={car.id}>
                <div className="catalogue-card-image">
                  <CarImage car={car} />
                </div>
                <div className="catalogue-card-body">
                  <div className="catalogue-tags">
                    <span>{bodyTypeLabels[car.bodyType]}</span>
                    <span>{fuelTypeLabels[car.fuelType]}</span>
                  </div>
                  <h2>
                    {car.make} {car.model}
                  </h2>
                  <p className="catalogue-years">
                    {car.yearStart}–{car.yearEnd}
                    {car.trim ? ` · ${car.trim}` : ""}
                  </p>
                  <div className="catalogue-card-bottom">
                    <p>
                      From <strong>{formatCurrency(car.priceMin)}</strong>
                    </p>
                    <Link href={`/cars/${car.slug}`}>
                      Details <ArrowRight aria-hidden="true" size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state catalogue-empty">
            <div className="empty-icon">
              <Search aria-hidden="true" size={19} />
            </div>
            <h2>No cars found</h2>
            <p>Try another search or clear one of the filters.</p>
            <button
              className="outline-button"
              onClick={() => {
                setQuery("");
                setBodyType("all");
                setFuelType("all");
              }}
              type="button"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
