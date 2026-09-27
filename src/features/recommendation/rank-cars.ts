import type { Car } from "@/types/car";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";
import type { RecommendationResult } from "@/types/recommendation";
import { filterCars } from "./filters";
import { scoreCar } from "./score-car";

export function rankCars(
  cars: Car[],
  answers: QuestionnaireAnswers,
  taste: { likedCarIds?: string[]; dislikedCarIds?: string[] } = {},
): RecommendationResult[] {
  const eligibleCars = filterCars(cars, answers);
  const tasteSignals = {
    likedCarIds: taste.likedCarIds ?? [],
    dislikedCarIds: taste.dislikedCarIds ?? [],
    cars,
  };

  return eligibleCars
    .map((car) => scoreCar(car, answers, tasteSignals))
    .sort((a, b) => b.match - a.match || a.carId.localeCompare(b.carId));
}
