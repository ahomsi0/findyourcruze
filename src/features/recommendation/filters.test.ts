import { describe, expect, it } from "vitest";
import { cars } from "@/data/cars";
import { filterCars } from "./filters";

describe("hard recommendation filters", () => {
  it("honors the selected budget ceiling", () => {
    const results = filterCars(cars, { budget: "under-7500" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((car) => car.priceMin <= 7500)).toBe(true);
  });

  it("removes fuel types and body styles the user ruled out", () => {
    const results = filterCars(cars, { fuels: ["hybrid"], bodyType: "sedan" });
    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(
        (car) => car.fuelType === "hybrid" && car.bodyType === "sedan",
      ),
    ).toBe(true);
  });

  it("does not treat a low fuel economy preference as a hard filter", () => {
    const results = filterCars(cars, { fuelEconomy: 10 });
    expect(results).toHaveLength(cars.length);
  });
});
