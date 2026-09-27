import type { ScoreCategory } from "./car";

export interface ScorePoint {
  label: string;
  points: number;
  category?: ScoreCategory;
}

export interface RecommendationResult {
  carId: string;
  match: number;
  reasons: string[];
  tradeoffs: string[];
  scoreBreakdown: ScorePoint[];
}
