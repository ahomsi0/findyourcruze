import { describe, expect, it } from "vitest";
import { cars } from "@/data/cars";
import { demoMarket } from "@/data/market";
import { calculateFuelCost } from "./calculate-fuel-cost";

describe("fuel and electricity estimates", () => {
  it("uses distance, consumption and demo fuel price", () => {
    const corolla = cars.find((car) => car.id === "toyota-corolla");
    expect(corolla).toBeDefined();
    expect(calculateFuelCost(corolla!, 1000, demoMarket)).toBeCloseTo(74.8);
  });

  it("uses electricity consumption for EVs", () => {
    const seagull = cars.find((car) => car.id === "byd-seagull");
    expect(seagull).toBeDefined();
    expect(calculateFuelCost(seagull!, 1000, demoMarket)).toBeCloseTo(14.7);
  });
});
