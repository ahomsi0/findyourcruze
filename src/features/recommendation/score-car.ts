import { categoryLabels, scoreCategories, type Car } from "@/types/car";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";
import type { RecommendationResult, ScorePoint } from "@/types/recommendation";
import { getBudgetCeiling, getBudgetFit } from "./filters";
import { createUserWeights } from "./weights";

export interface TasteSignals {
  likedCarIds: string[];
  dislikedCarIds: string[];
  cars: Car[];
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function scoreCar(
  car: Car,
  answers: QuestionnaireAnswers,
  taste: TasteSignals,
): RecommendationResult {
  const weights = createUserWeights(answers);
  const totalWeight = scoreCategories.reduce(
    (sum, category) => sum + weights[category],
    0,
  );
  const weightedScore = scoreCategories.reduce(
    (sum, category) => sum + car.scores[category] * weights[category],
    0,
  );
  const categoryAverage = weightedScore / totalWeight;
  const budgetFit = getBudgetFit(car, getBudgetCeiling(answers));
  const likeCars = taste.cars.filter((liked) =>
    taste.likedCarIds.includes(liked.id),
  );
  const dislikeCars = taste.cars.filter((disliked) =>
    taste.dislikedCarIds.includes(disliked.id),
  );
  const directLike = taste.likedCarIds.includes(car.id) ? 8 : 0;
  const sameBodyLikes = likeCars.some(
    (liked) => liked.bodyType === car.bodyType,
  )
    ? 4
    : 0;
  const sameMakeLikes = likeCars.some((liked) => liked.make === car.make)
    ? 3
    : 0;
  const similarDislike = dislikeCars.some(
    (disliked) => disliked.bodyType === car.bodyType,
  )
    ? 3
    : 0;
  const directDislike = taste.dislikedCarIds.includes(car.id) ? 12 : 0;
  const styleFit =
    directLike + sameBodyLikes + sameMakeLikes - similarDislike - directDislike;
  const chargePenalty =
    car.fuelType === "electric" && answers.charging === "no" ? 4 : 0;
  const match = clamp(
    Math.round(
      49 + categoryAverage * 4.15 + budgetFit * 0.65 + styleFit - chargePenalty,
    ),
    1,
    99,
  );

  const scoreBreakdown: ScorePoint[] = scoreCategories
    .map((category) => ({
      label: categoryLabels[category],
      points: Math.round((car.scores[category] - 5) * weights[category] * 0.8),
      category,
    }))
    .filter((point) => point.points !== 0)
    .sort((a, b) => b.points - a.points);

  if (budgetFit >= 5)
    scoreBreakdown.push({
      label: "Budget fit",
      points: budgetFit >= 8 ? 8 : 4,
    });
  if (styleFit > 0)
    scoreBreakdown.push({ label: "Style preference", points: styleFit });
  if (styleFit < 0)
    scoreBreakdown.push({ label: "Style preference", points: styleFit });
  if (chargePenalty > 0)
    scoreBreakdown.push({ label: "Charging access", points: -chargePenalty });

  const reasons = scoreBreakdown
    .filter((point) => point.points > 0)
    .slice(0, 3)
    .map((point) =>
      point.label === "Budget fit"
        ? "Sits comfortably within your budget"
        : `${point.label} suits your priorities`,
    );
  if (
    reasons.length < 3 &&
    budgetFit >= 5 &&
    !reasons.includes("Sits comfortably within your budget")
  ) {
    reasons.push("Sits comfortably within your budget");
  }

  const weightedWeaknesses = scoreCategories
    .filter((category) => car.scores[category] <= 5.5)
    .sort((a, b) => weights[b] - weights[a]);
  const tradeoffs = weightedWeaknesses
    .slice(0, 2)
    .map((category) => `${categoryLabels[category]} is a compromise`);
  if (car.priceMax > (getBudgetCeiling(answers) ?? Number.POSITIVE_INFINITY)) {
    tradeoffs.push("Some examples may stretch beyond your budget");
  }
  if (car.fuelType === "electric" && answers.charging === "no")
    tradeoffs.push("Public charging needs to fit your routine");
  if (!tradeoffs.length)
    tradeoffs.push(
      car.weaknesses[0] ?? "Check the condition of each individual car",
    );

  return {
    carId: car.id,
    match,
    reasons: reasons.slice(0, 3),
    tradeoffs: tradeoffs.slice(0, 2),
    scoreBreakdown,
  };
}
