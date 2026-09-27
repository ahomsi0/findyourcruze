import type { Car } from "@/types/car";
import type { MarketAssumptions } from "@/data/market";

export function calculateFuelCost(
  car: Car,
  monthlyKm: number,
  market: MarketAssumptions,
): number {
  if (car.fuelType === "electric") {
    return (
      (monthlyKm / 100) *
      (car.electricConsumption ?? 0) *
      market.electricityPricePerKwh
    );
  }
  return (
    (monthlyKm / 100) * (car.fuelConsumption ?? 0) * market.fuelPricePerLiter
  );
}
