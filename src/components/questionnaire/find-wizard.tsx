"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { cars } from "@/data/cars";
import { filterCars } from "@/features/recommendation/filters";
import { getVisibleQuestions } from "@/features/questionnaire/questions";
import type {
  AnswerKey,
  Question,
  QuestionnaireAnswers,
} from "@/features/questionnaire/types";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useRecommendationStore } from "@/store/recommendation-store";

function LoadingState() {
  return (
    <div aria-label="Loading your saved answers" className="loading-state">
      <div className="loading-dot">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function optionIsSelected(answer: unknown, value: string | number): boolean {
  return Array.isArray(answer) ? answer.includes(value) : answer === value;
}

function nextAnswerValue(
  question: Question,
  answer: unknown,
  value: string | number,
): NonNullable<QuestionnaireAnswers[AnswerKey]> {
  if (question.type === "single")
    return value as NonNullable<QuestionnaireAnswers[AnswerKey]>;
  const selected = Array.isArray(answer) ? ([...answer] as string[]) : [];
  const entry = String(value);
  if (selected.includes(entry))
    return selected.filter((item) => item !== entry) as NonNullable<
      QuestionnaireAnswers[AnswerKey]
    >;
  if (
    question.type === "ranking" &&
    selected.length >= (question.maxSelections ?? 3)
  )
    return selected as NonNullable<QuestionnaireAnswers[AnswerKey]>;
  return [...selected, entry] as NonNullable<QuestionnaireAnswers[AnswerKey]>;
}

export function FindWizard() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const reduceMotion = useReducedMotion();
  const answers = useRecommendationStore((state) => state.answers);
  const currentStep = useRecommendationStore((state) => state.currentStep);
  const setAnswer = useRecommendationStore((state) => state.setAnswer);
  const setCurrentStep = useRecommendationStore(
    (state) => state.setCurrentStep,
  );
  const reset = useRecommendationStore((state) => state.reset);
  const [error, setError] = useState("");

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(answers),
    [answers],
  );
  const stepIndex = Math.min(currentStep, visibleQuestions.length - 1);
  const question = visibleQuestions[stepIndex];
  const candidateCount = useMemo(
    () => filterCars(cars, answers).length,
    [answers],
  );
  const currentAnswer = question ? answers[question.id] : undefined;

  useEffect(() => {
    if (hydrated && currentStep !== stepIndex) setCurrentStep(stepIndex);
  }, [currentStep, hydrated, setCurrentStep, stepIndex]);

  if (!hydrated || !question)
    return (
      <>
        <AppHeader />
        <main className="app-main">
          <LoadingState />
        </main>
      </>
    );

  const handleContinue = () => {
    if (
      question.type !== "single" &&
      (!Array.isArray(currentAnswer) || currentAnswer.length === 0)
    ) {
      setError(
        question.type === "ranking"
          ? "Choose at least one priority to continue."
          : "Choose one or more options to continue.",
      );
      return;
    }
    if (question.type === "single" && currentAnswer === undefined) {
      setError("Choose an answer to continue.");
      return;
    }
    setError("");
    if (stepIndex >= visibleQuestions.length - 1) {
      router.push("/swipe");
      return;
    }
    setCurrentStep(stepIndex + 1);
  };

  const handleAnswer = (value: string | number) => {
    setError("");
    setAnswer(question.id, nextAnswerValue(question, currentAnswer, value));
  };

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <div className="wizard-shell">
          <div className="wizard-topline">
            <span>
              Question {stepIndex + 1} of {visibleQuestions.length}
            </span>
            <div aria-live="polite" className="candidate-count">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.strong
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -7 }}
                  initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                  key={candidateCount}
                  transition={{ duration: reduceMotion ? 0 : 0.16 }}
                >
                  {candidateCount}
                </motion.strong>
              </AnimatePresence>{" "}
              {candidateCount === 1 ? "car" : "cars"} still in the running
            </div>
          </div>
          <div
            aria-label="Questionnaire progress"
            className="step-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={visibleQuestions.length}
            aria-valuenow={stepIndex + 1}
          >
            <span
              style={{
                width: `${((stepIndex + 1) / visibleQuestions.length) * 100}%`,
              }}
            />
          </div>

          <div className="wizard-stage">
            <AnimatePresence initial={false} mode="wait">
              <motion.section
                animate={{ opacity: 1, x: 0 }}
                aria-labelledby="question-title"
                className="question-content"
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
                initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                key={question.id}
                transition={{
                  duration: reduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                }}
              >
                <span className="question-eyebrow">{question.eyebrow}</span>
                <h1 id="question-title">{question.title}</h1>
                {question.description && (
                  <p className="question-description">{question.description}</p>
                )}
                <div
                  aria-label={
                    question.type === "multi" || question.type === "ranking"
                      ? "Choose your answers"
                      : undefined
                  }
                  className="option-list"
                  role={
                    question.type === "multi" || question.type === "ranking"
                      ? "group"
                      : "radiogroup"
                  }
                >
                  {question.options.map((option) => {
                    const selected = optionIsSelected(
                      currentAnswer,
                      option.value,
                    );
                    const rank = Array.isArray(currentAnswer)
                      ? (currentAnswer as string[]).indexOf(
                          String(option.value),
                        ) + 1
                      : 0;
                    return (
                      <button
                        aria-checked={
                          question.type !== "ranking" ? selected : undefined
                        }
                        aria-pressed={
                          question.type === "ranking" ? selected : undefined
                        }
                        className={`option-card ${selected ? "selected" : ""}`}
                        key={String(option.value)}
                        onClick={() => handleAnswer(option.value)}
                        role={
                          question.type === "single"
                            ? "radio"
                            : question.type === "multi"
                              ? "checkbox"
                              : "button"
                        }
                        type="button"
                      >
                        {question.type === "ranking" ? (
                          <span aria-hidden="true" className="ranking-number">
                            {rank ? `${rank}.` : "·"}
                          </span>
                        ) : (
                          <span aria-hidden="true" className="option-indicator">
                            {selected ? (
                              <Check size={11} strokeWidth={2.4} />
                            ) : null}
                          </span>
                        )}
                        <span>
                          <span className="option-label">{option.label}</span>
                          {option.detail && (
                            <span className="option-detail">
                              {option.detail}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {error && (
                  <p className="question-error" role="alert">
                    {error}
                  </p>
                )}
              </motion.section>
            </AnimatePresence>

            <aside className="question-aside">
              <div className="question-aside-icon">
                <Lightbulb aria-hidden="true" size={16} />
              </div>
              <div>
                <strong>
                  {candidateCount === cars.length
                    ? "A good place to start"
                    : `${cars.length - candidateCount} ruled out so far`}
                </strong>
                <p>
                  {candidateCount === 0
                    ? "No exact match yet. Continue to see the closest available cars and their trade-offs."
                    : "We’re only narrowing the cars using the things you’ve told us matter."}
                </p>
              </div>
            </aside>
          </div>

          <div className="wizard-footer">
            <span className="wizard-footer-note">
              {cars.length} demo cars · Lebanon market · estimates only
            </span>
            <div className="wizard-footer-actions">
              {stepIndex > 0 ? (
                <button
                  className="quiet-button"
                  onClick={() => setCurrentStep(stepIndex - 1)}
                  type="button"
                >
                  <ArrowLeft aria-hidden="true" size={14} /> Back
                </button>
              ) : (
                <button
                  className="quiet-button"
                  onClick={() => {
                    reset();
                    router.push("/");
                  }}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={13} /> Start over
                </button>
              )}
              <button
                className="solid-button"
                onClick={handleContinue}
                type="button"
              >
                {stepIndex === visibleQuestions.length - 1
                  ? "See what you like"
                  : "Continue"}
                <ArrowRight aria-hidden="true" size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
