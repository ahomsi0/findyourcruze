import { z } from "zod";
import { bodyTypes, fuelTypes, scoreCategories } from "@/types/car";

export const budgetRanges = [
  "under-7500",
  "7500-10000",
  "10000-15000",
  "15000-20000",
  "20000-30000",
  "30000-plus",
] as const;

export const questionnaireAnswersSchema = z.object({
  budget: z.enum(budgetRanges).optional(),
  purchaseMethod: z.enum(["cash", "financing", "either"]).optional(),
  maxMonthlyPayment: z.number().positive().optional(),
  monthlyKm: z.number().positive().optional(),
  fuels: z.array(z.enum(fuelTypes)).optional(),
  charging: z.enum(["yes", "no", "not-sure"]).optional(),
  bodyType: z.enum([...bodyTypes, "open"]).optional(),
  reliability: z.enum(["high", "balanced", "low"]).optional(),
  performance: z.enum(["low", "balanced", "high"]).optional(),
  fuelEconomy: z.number().min(0).max(10).optional(),
  priorities: z.array(z.enum(scoreCategories)).max(3).optional(),
});

export type QuestionnaireAnswers = z.infer<typeof questionnaireAnswersSchema>;
export type AnswerKey = keyof QuestionnaireAnswers;

export type QuestionOption = {
  value: string | number;
  label: string;
  detail?: string;
};

export type Question = {
  id: AnswerKey;
  type: "single" | "multi" | "ranking";
  title: string;
  eyebrow: string;
  description?: string;
  options: QuestionOption[];
  condition?: (answers: QuestionnaireAnswers) => boolean;
  maxSelections?: number;
};
