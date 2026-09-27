import type { Car } from "@/types/car";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";
import type { MarketAssumptions } from "@/data/market";
import { calculateFinancing } from "./calculate-financing";
import { calculateFuelCost } from "./calculate-fuel-cost";

export interface OwnershipCostEstimate {
  vehiclePrice: number;
  downPayment: number;
  financePayment: number;
  energy: number;
  insurance: number;
  maintenance: number;
  registration: number;
  totalMonthly: number;
}

export function calculateOwnershipCost(
  car: Car,
  answers: QuestionnaireAnswers,
  market: MarketAssumptions,
): OwnershipCostEstimate {
  const vehiclePrice = (car.priceMin + car.priceMax) / 2;
  const shouldFinance = answers.purchaseMethod !== "cash";
  const downPayment = shouldFinance ? vehiclePrice * 0.2 : 0;
  const financePayment = shouldFinance
    ? calculateFinancing(
        vehiclePrice,
        downPayment,
        market.financeApr,
        market.financeMonths,
      ).monthlyPayment
    : 0;
  const energy = calculateFuelCost(car, answers.monthlyKm ?? 1000, market);
  const insurance = market.monthlyInsurance;
  const maintenance = car.estimatedAnnualMaintenance / 12;
  const registration = market.annualRegistration / 12;
  const totalMonthly =
    financePayment + energy + insurance + maintenance + registration;

  return {
    vehiclePrice,
    downPayment,
    financePayment,
    energy,
    insurance,
    maintenance,
    registration,
    totalMonthly,
  };
}
