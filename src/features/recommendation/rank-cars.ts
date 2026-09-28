import type { Car } from "@/types/car";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";
import type { RecommendationResult } from "@/types/recommendation";
import { demoMarket } from "@/data/market";
import { calculateFinancing } from "@/features/affordability/calculate-financing";
import { formatCurrency, formatFuelType } from "@/lib/format";
import { filterCars, getBudgetCeiling } from "./filters";
import { scoreCar } from "./score-car";

function getFallbackAdjustments(
  car: Car,
  answers: QuestionnaireAnswers,
): {
  deductions: number[];
  tradeoffs: string[];
  scoreBreakdown: RecommendationResult["scoreBreakdown"];
} {
  const deductions: number[] = [];
  const tradeoffs: string[] = [];
  const scoreBreakdown: RecommendationResult["scoreBreakdown"] = [];
  const budget = getBudgetCeiling(answers);

  if (
    budget !== undefined &&
    Number.isFinite(budget) &&
    car.priceMin > budget
  ) {
    const overspend = car.priceMin - budget;
    const deduction = Math.min(
      32,
      8 + Math.ceil((overspend / Math.max(budget, 1000)) * 20),
    );
    deductions.push(deduction);
    tradeoffs.push(`${formatCurrency(overspend)} above your budget ceiling`);
    scoreBreakdown.push({ label: "Budget ceiling", points: -deduction });
  }

  if (answers.fuels?.length && !answers.fuels.includes(car.fuelType)) {
    deductions.push(16);
    tradeoffs.push(
      `Runs on ${formatFuelType(car.fuelType)}, outside your selected fuel types`,
    );
    scoreBreakdown.push({ label: "Fuel preference", points: -16 });
  }

  if (
    answers.bodyType &&
    answers.bodyType !== "open" &&
    car.bodyType !== answers.bodyType
  ) {
    deductions.push(14);
    tradeoffs.push(`Body style is ${car.bodyType}, not ${answers.bodyType}`);
    scoreBreakdown.push({ label: "Body style", points: -14 });
  }

  if (answers.purchaseMethod === "financing" && answers.maxMonthlyPayment) {
    const downPayment = car.priceMin * 0.2;
    const payment = calculateFinancing(
      car.priceMin,
      downPayment,
      demoMarket.financeApr,
      demoMarket.financeMonths,
    ).monthlyPayment;
    if (payment > answers.maxMonthlyPayment) {
      const difference = payment - answers.maxMonthlyPayment;
      const deduction = Math.min(
        24,
        6 + Math.ceil((difference / answers.maxMonthlyPayment) * 18),
      );
      deductions.push(deduction);
      tradeoffs.push(
        `${formatCurrency(difference)}/month above your payment preference`,
      );
      scoreBreakdown.push({ label: "Monthly payment", points: -deduction });
    }
  }

  return { deductions, tradeoffs, scoreBreakdown };
}

export function rankCars(
  cars: Car[],
  answers: QuestionnaireAnswers,
  taste: { likedCarIds?: string[]; dislikedCarIds?: string[] } = {},
): RecommendationResult[] {
  const eligibleCars = filterCars(cars, answers);
  const hasExactFit = eligibleCars.length > 0;
  const candidateCars = hasExactFit ? eligibleCars : cars;
  const tasteSignals = {
    likedCarIds: taste.likedCarIds ?? [],
    dislikedCarIds: taste.dislikedCarIds ?? [],
    cars,
  };

  return candidateCars
    .map((car) => {
      const result = scoreCar(car, answers, tasteSignals);
      if (hasExactFit) return result;

      const adjustments = getFallbackAdjustments(car, answers);
      return {
        ...result,
        match: Math.max(
          1,
          result.match -
            adjustments.deductions.reduce((sum, item) => sum + item, 0),
        ),
        reasons: [
          "One of the closest available options",
          ...result.reasons,
        ].slice(0, 3),
        tradeoffs: [...adjustments.tradeoffs, ...result.tradeoffs].slice(0, 2),
        scoreBreakdown: [
          ...result.scoreBreakdown,
          ...adjustments.scoreBreakdown,
        ],
      };
    })
    .sort((a, b) => b.match - a.match || a.carId.localeCompare(b.carId));
}
