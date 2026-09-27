import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AnswerKey,
  QuestionnaireAnswers,
} from "@/features/questionnaire/types";
import { questionnaireAnswersSchema } from "@/features/questionnaire/types";

interface RecommendationState {
  answers: QuestionnaireAnswers;
  currentStep: number;
  likedCarIds: string[];
  dislikedCarIds: string[];
  setAnswer: (
    key: AnswerKey,
    value: NonNullable<QuestionnaireAnswers[AnswerKey]>,
  ) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  likeCar: (id: string) => void;
  dislikeCar: (id: string) => void;
  reset: () => void;
}

const initialState = {
  answers: {} as QuestionnaireAnswers,
  currentStep: 0,
  likedCarIds: [] as string[],
  dislikedCarIds: [] as string[],
};

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    (set) => ({
      ...initialState,
      setAnswer: (key, value) =>
        set((state) => {
          const parsed = questionnaireAnswersSchema.safeParse({
            ...state.answers,
            [key]: value,
          });
          return parsed.success ? { answers: parsed.data } : state;
        }),
      setCurrentStep: (currentStep) =>
        set({ currentStep: Math.max(0, currentStep) }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      previousStep: () =>
        set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
      likeCar: (id) =>
        set((state) => ({
          likedCarIds: state.likedCarIds.includes(id)
            ? state.likedCarIds
            : [...state.likedCarIds, id],
          dislikedCarIds: state.dislikedCarIds.filter((carId) => carId !== id),
        })),
      dislikeCar: (id) =>
        set((state) => ({
          dislikedCarIds: state.dislikedCarIds.includes(id)
            ? state.dislikedCarIds
            : [...state.dislikedCarIds, id],
          likedCarIds: state.likedCarIds.filter((carId) => carId !== id),
        })),
      reset: () => set(initialState),
    }),
    {
      name: "findyourcruze-recommendation",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        answers: state.answers,
        currentStep: state.currentStep,
        likedCarIds: state.likedCarIds,
        dislikedCarIds: state.dislikedCarIds,
      }),
    },
  ),
);
