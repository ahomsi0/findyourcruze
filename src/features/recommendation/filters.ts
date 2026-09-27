import type { Car } from "@/types/car";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";
import { demoMarket } from "@/data/market";
import { calculateFinancing } from "@/features/affordability/calculate-financing";

const budgetCeilings: Record<
  NonNullable<QuestionnaireAnswers["budget"]>,
  number
> = {
  "under-7500": 7500,
  "7500-10000": 10000,
  "10000-15000": 15000,
  "15000-20000": 20000,
  "20000-30000": 30000,
  "30000-plus": Number.POSITIVE_INFINITY,
};

export function getBudgetCeiling(
  answers: QuestionnaireAnswers,
): number | undefined {
  return answers.budget ? budgetCeilings[answers.budget] : undefined;
}

export function filterCars(cars: Car[], answers: QuestionnaireAnswers): Car[] {
  const budget = getBudgetCeiling(answers);

  return cars.filter((car) => {
    if (budget !== undefined && car.priceMin > budget) return false;
    if (answers.fuels?.length && !answers.fuels.includes(car.fuelType))
      return false;
    if (
      answers.bodyType &&
      answers.bodyType !== "open" &&
      car.bodyType !== answers.bodyType
    )
      return false;

    if (answers.purchaseMethod === "financing" && answers.maxMonthlyPayment) {
      const downPayment = car.priceMin * 0.2;
      const estimatedPayment = calculateFinancing(
        car.priceMin,
        downPayment,
        demoMarket.financeApr,
        demoMarket.financeMonths,
      ).monthlyPayment;
      if (estimatedPayment > answers.maxMonthlyPayment) return false;
    }

    return true;
  });
}

export function getBudgetFit(car: Car, budget: number | undefined): number {
  if (budget === undefined) return 4;
  if (car.priceMax <= budget * 0.85) return 10;
  if (car.priceMin <= budget && car.priceMax <= budget) return 8;
  if (car.priceMin <= budget) return 5;
  return 0;
}
