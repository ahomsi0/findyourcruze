import type { ScoreCategory } from "@/types/car";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";

export type UserWeights = Record<ScoreCategory, number>;

const defaultWeights: UserWeights = {
  reliability: 1.1,
  economy: 1.1,
  performance: 0.9,
  luxury: 0.8,
  technology: 0.8,
  resale: 0.9,
  practicality: 1,
  maintenance: 1,
};

export function createUserWeights(answers: QuestionnaireAnswers): UserWeights {
  const weights = { ...defaultWeights };

  if (answers.reliability === "high") weights.reliability = 2.8;
  if (answers.reliability === "balanced") weights.reliability = 1.5;
  if (answers.reliability === "low") weights.reliability = 0.55;

  if (answers.performance === "high") weights.performance = 2.8;
  if (answers.performance === "balanced") weights.performance = 1.5;
  if (answers.performance === "low") weights.performance = 0.55;

  if (answers.fuelEconomy !== undefined) {
    weights.economy = 0.65 + answers.fuelEconomy * 0.24;
  }

  answers.priorities?.forEach((category, index) => {
    weights[category] = [3.2, 2.6, 2][index] ?? weights[category];
  });

  return weights;
}
