"use client";

import { useReducedMotion, motion } from "motion/react";
import { ArrowDown, Check, Heart, Sparkles } from "lucide-react";
import { cars } from "@/data/cars";
import { filterCars } from "@/features/recommendation/filters";
import { rankCars } from "@/features/recommendation/rank-cars";
import { formatCurrency } from "@/lib/format";
import { CarImage } from "@/components/cars/car-image";
import type { QuestionnaireAnswers } from "@/features/questionnaire/types";

const sampleAnswers: QuestionnaireAnswers = {
  budget: "15000-20000",
  fuels: ["petrol", "hybrid"],
  bodyType: "sedan",
  reliability: "high",
  fuelEconomy: 8,
  priorities: ["reliability", "economy", "resale"],
};

const budgetAnswers = {
  budget: sampleAnswers.budget,
} satisfies QuestionnaireAnswers;
const fuelAnswers = {
  ...budgetAnswers,
  fuels: sampleAnswers.fuels,
} satisfies QuestionnaireAnswers;
const budgetCount = filterCars(cars, budgetAnswers).length;
const fuelCount = filterCars(cars, fuelAnswers).length;
const finalMatches = rankCars(cars, sampleAnswers).slice(0, 3);
const topMatch =
  cars.find((car) => car.id === finalMatches[0]?.carId) ?? cars[2];

export function MatchmakingPreview() {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: "easeOut" as const };

  return (
    <div
      aria-label={`A preview of Motch narrowing ${cars.length} demo cars to a shortlist`}
      className="match-preview"
    >
      <motion.div
        animate={reduceMotion ? {} : { y: [0, -8, 0], rotate: [0, 1.1, 0] }}
        className="preference-chip chip-budget"
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="chip-dot chip-dot-terracotta" /> Under $20k
      </motion.div>
      <motion.div
        animate={reduceMotion ? {} : { y: [0, 7, 0], rotate: [0, -1.2, 0] }}
        className="preference-chip chip-reliable"
        transition={{
          duration: 6.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <span className="chip-dot chip-dot-sage" /> Reliable
      </motion.div>
      <motion.div
        animate={reduceMotion ? {} : { y: [0, -6, 0], rotate: [0, -1, 0] }}
        className="preference-chip chip-economy"
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      >
        Low fuel use <span className="chip-icon">↗</span>
      </motion.div>

      <div className="preview-orbit" aria-hidden="true" />
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="preview-car-card"
        initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
        transition={transition}
      >
        <div className="preview-car-image-wrap">
          <CarImage car={topMatch} className="preview-car-image" />
          <span className="preview-match-badge">
            <Sparkles aria-hidden="true" size={13} /> Great fit
          </span>
          <span aria-hidden="true" className="preview-heart">
            <Heart fill="currentColor" size={16} />
          </span>
        </div>
        <div className="preview-car-details">
          <div>
            <span className="micro-label">Your kind of match</span>
            <h3>
              {topMatch.make} {topMatch.model}
            </h3>
          </div>
          <p>
            {formatCurrency(topMatch.priceMin)}
            <br />
            <span>estimated range start</span>
          </p>
        </div>
        <div className="preview-card-foot">
          <span>
            <Check size={13} /> Low-stress ownership
          </span>
          <span>Top match</span>
        </div>
      </motion.div>

      <div className="elimination-board">
        <div className="elimination-head">
          <span>From guesswork</span>
          <span>
            <span className="live-dot" /> Live demo
          </span>
        </div>
        <div className="elimination-flow">
          <div className="flow-step">
            <span className="flow-number">{cars.length}</span>
            <span className="flow-caption">cars in our demo</span>
          </div>
          <ArrowDown aria-hidden="true" className="flow-arrow" size={14} />
          <div className="flow-step">
            <span className="flow-number">{budgetCount}</span>
            <span className="flow-caption">fit your budget</span>
          </div>
          <ArrowDown aria-hidden="true" className="flow-arrow" size={14} />
          <div className="flow-step">
            <span className="flow-number">{fuelCount}</span>
            <span className="flow-caption">match your fuel</span>
          </div>
          <ArrowDown aria-hidden="true" className="flow-arrow" size={14} />
          <div className="flow-step flow-final">
            <span className="flow-number">{finalMatches.length}</span>
            <span className="flow-caption">worth a closer look</span>
          </div>
        </div>
        <motion.div
          animate={{ width: "100%" }}
          className="flow-progress"
          initial={{ width: "18%" }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <span />
        </motion.div>
      </div>
      <div className="preview-annotation">
        A few thoughtful questions
        <br />
        make the shortlist clearer.
      </div>
    </div>
  );
}
