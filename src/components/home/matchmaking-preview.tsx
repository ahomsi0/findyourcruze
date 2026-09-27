"use client";

import { useReducedMotion, motion } from "motion/react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { cars } from "@/data/cars";
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

const finalMatches = rankCars(cars, sampleAnswers).slice(0, 3);
const topMatchResult = finalMatches[0];
const topMatch =
  cars.find((car) => car.id === topMatchResult?.carId) ?? cars[2];

export function MatchmakingPreview() {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: "easeOut" as const };

  return (
    <div
      aria-label={`A preview of FindYourCruze narrowing ${cars.length} demo cars to a shortlist`}
      className="match-preview"
      role="group"
    >
      <div aria-hidden="true" className="preview-glow" />
      <motion.article
        animate={{ opacity: 1, y: 0 }}
        className="preview-car-card"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        transition={transition}
      >
        <div className="preview-card-heading">
          <span className="preview-card-eyebrow">
            <Sparkles aria-hidden="true" size={13} /> A considered match
          </span>
          <span className="preview-score">
            {topMatchResult?.match ?? "Great"}% fit
          </span>
        </div>
        <div className="preview-car-image-wrap">
          <CarImage car={topMatch} className="preview-car-image" />
        </div>
        <div className="preview-car-details">
          <div>
            <span className="micro-label">Top match</span>
            <h3>
              {topMatch.make} {topMatch.model}
            </h3>
          </div>
          <p>
            {formatCurrency(topMatch.priceMin)}
            <span>estimated range start</span>
          </p>
        </div>
        <div className="preview-preferences" aria-label="Matching priorities">
          <span>
            <i className="preview-dot preview-dot-terra" /> Under $20k
          </span>
          <span>
            <i className="preview-dot preview-dot-sage" /> Reliable
          </span>
          <span>
            <i className="preview-dot preview-dot-ink" /> Low fuel use
          </span>
        </div>
        <div className="preview-card-foot">
          <span>
            <Check aria-hidden="true" size={14} /> Clear trade-offs included
          </span>
          <span>Demo estimate</span>
        </div>
      </motion.article>

      <div className="preview-summary">
        <div className="preview-summary-copy">
          <span>From a broad search</span>
          <p>Priorities, costs and trade-offs shape the shortlist.</p>
        </div>
        <div className="preview-summary-flow">
          <div>
            <strong>{cars.length}</strong>
            <span>cars considered</span>
          </div>
          <ArrowRight aria-hidden="true" size={16} />
          <div>
            <strong>{finalMatches.length}</strong>
            <span>strong matches</span>
          </div>
        </div>
      </div>
    </div>
  );
}
