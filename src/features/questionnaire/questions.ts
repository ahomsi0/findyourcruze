import {
  categoryLabels,
  bodyTypeLabels,
  fuelTypes,
  fuelTypeLabels,
  scoreCategories,
} from "@/types/car";
import type { Question, QuestionnaireAnswers } from "./types";

export const questions: Question[] = [
  {
    id: "budget",
    type: "single",
    eyebrow: "The practical stuff · 01",
    title: "What’s your total budget?",
    description: "A comfortable range helps us rule out the wrong fits early.",
    options: [
      {
        value: "under-7500",
        label: "Under $7,500",
        detail: "A practical first car",
      },
      {
        value: "7500-10000",
        label: "$7,500–$10,000",
        detail: "Good value, more choice",
      },
      {
        value: "10000-15000",
        label: "$10,000–$15,000",
        detail: "The sweet spot",
      },
      {
        value: "15000-20000",
        label: "$15,000–$20,000",
        detail: "Newer, more equipped",
      },
      {
        value: "20000-30000",
        label: "$20,000–$30,000",
        detail: "A little more room",
      },
      {
        value: "30000-plus",
        label: "$30,000+",
        detail: "Show me the possibilities",
      },
    ],
  },
  {
    id: "purchaseMethod",
    type: "single",
    eyebrow: "The practical stuff · 02",
    title: "How are you planning to buy it?",
    description: "We’ll keep the numbers useful, not intimidating.",
    options: [
      {
        value: "cash",
        label: "Paying cash",
        detail: "I have the full amount ready",
      },
      {
        value: "financing",
        label: "Financing",
        detail: "I’d rather spread it out",
      },
      {
        value: "either",
        label: "I’m open to either",
        detail: "Show me what makes sense",
      },
    ],
  },
  {
    id: "maxMonthlyPayment",
    type: "single",
    eyebrow: "The practical stuff · 03",
    title: "What monthly payment feels comfortable?",
    description:
      "We’ll use this as a guide. Final financing depends on your lender and terms.",
    condition: (answers) => answers.purchaseMethod === "financing",
    options: [
      { value: 200, label: "Under $200", detail: "Keep it easy" },
      { value: 350, label: "$200–$350", detail: "A balanced monthly cost" },
      { value: 500, label: "$350–$500", detail: "A little more flexibility" },
      { value: 750, label: "$500+", detail: "Show me the best fit" },
    ],
  },
  {
    id: "monthlyKm",
    type: "single",
    eyebrow: "The practical stuff · 04",
    title: "How much do you drive in a typical month?",
    description: "This makes running cost estimates more personal.",
    options: [
      { value: 350, label: "Under 500 km", detail: "Mostly short trips" },
      { value: 750, label: "500–1,000 km", detail: "A few trips each week" },
      { value: 1250, label: "1,000–1,500 km", detail: "Regular daily driving" },
      {
        value: 2000,
        label: "1,500–2,500 km",
        detail: "A lot of time on the road",
      },
      { value: 3000, label: "2,500+ km", detail: "Always on the move" },
    ],
  },
  {
    id: "fuels",
    type: "multi",
    eyebrow: "The practical stuff · 05",
    title: "Which fuel types would you consider?",
    description:
      "Choose all that feel realistic. We’ll only remove what you rule out.",
    options: [
      ...fuelTypes.map((fuel) => ({
        value: fuel,
        label: fuelTypeLabels[fuel],
        detail:
          fuel === "electric"
            ? "A plug-in option"
            : fuel === "hybrid"
              ? "A little of both"
              : "A familiar choice",
      })),
    ],
  },
  {
    id: "charging",
    type: "single",
    eyebrow: "The practical stuff · 06",
    title: "Can you reliably charge at home?",
    description:
      "This helps us understand whether an EV would fit your routine.",
    condition: (answers) => answers.fuels?.includes("electric") ?? false,
    options: [
      {
        value: "yes",
        label: "Yes",
        detail: "I have a regular place to charge",
      },
      { value: "no", label: "No", detail: "I’d rely on public charging" },
      {
        value: "not-sure",
        label: "Not sure yet",
        detail: "I’m still figuring that out",
      },
    ],
  },
  {
    id: "bodyType",
    type: "single",
    eyebrow: "The practical stuff · 07",
    title: "What kind of car feels right?",
    description: "You can choose one shape, or keep the field open.",
    options: [
      ...Object.entries(bodyTypeLabels).map(([value, label]) => ({
        value,
        label,
      })),
      {
        value: "open",
        label: "I’m open",
        detail: "Surprise me with a good fit",
      },
    ],
  },
  {
    id: "reliability",
    type: "single",
    eyebrow: "Your driving style · 08",
    title: "How comfortable are you with unexpected repairs?",
    options: [
      {
        value: "high",
        label: "I don’t want any drama",
        detail: "Reliability comes first",
      },
      {
        value: "balanced",
        label: "Occasional repairs are fine",
        detail: "A balanced approach",
      },
      {
        value: "low",
        label: "I’ll take a chance for something exciting",
        detail: "Character matters too",
      },
    ],
  },
  {
    id: "performance",
    type: "single",
    eyebrow: "Your driving style · 09",
    title: "When you press the accelerator, what do you expect?",
    options: [
      {
        value: "low",
        label: "Just get me there",
        detail: "Easygoing is perfect",
      },
      {
        value: "balanced",
        label: "Some power would be nice",
        detail: "A little fun, too",
      },
      {
        value: "high",
        label: "I want it to move",
        detail: "Performance matters",
      },
    ],
  },
  {
    id: "fuelEconomy",
    type: "single",
    eyebrow: "Your driving style · 10",
    title: "How much do you hate paying for fuel?",
    description:
      "No wrong answer. We’ll adjust running cost weight to suit you.",
    options: [
      { value: 2, label: "Not much", detail: "I care more about the drive" },
      {
        value: 5,
        label: "A reasonable amount",
        detail: "Keep things balanced",
      },
      {
        value: 8,
        label: "I notice every fill-up",
        detail: "Efficient is important",
      },
      {
        value: 10,
        label: "Please save me money",
        detail: "Running costs really matter",
      },
    ],
  },
  {
    id: "priorities",
    type: "ranking",
    eyebrow: "Your driving style · 11",
    title: "What matters most to you?",
    description:
      "Choose up to three, in order. Tap in the order you care about them.",
    maxSelections: 3,
    options: scoreCategories.map((category) => ({
      value: category,
      label: categoryLabels[category],
    })),
  },
];

export function getVisibleQuestions(answers: QuestionnaireAnswers): Question[] {
  return questions.filter((question) => question.condition?.(answers) ?? true);
}
