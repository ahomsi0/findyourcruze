import { describe, expect, it } from "vitest";
import { cars } from "@/data/cars";
import { rankCars } from "./rank-cars";
import { scoreCar } from "./score-car";

describe("deterministic recommendations", () => {
  it("returns stable descending scores for the same answers", () => {
    const answers = {
      budget: "15000-20000" as const,
      bodyType: "sedan" as const,
      reliability: "high" as const,
    };
    const first = rankCars(cars, answers);
    const second = rankCars(cars, answers);
    expect(first.map((item) => [item.carId, item.match])).toEqual(
      second.map((item) => [item.carId, item.match]),
    );
    expect(first.map((item) => item.match)).toEqual(
      [...first.map((item) => item.match)].sort((a, b) => b - a),
    );
  });

  it("includes score reasons and trade-offs", () => {
    const result = rankCars(cars, {
      budget: "15000-20000",
      bodyType: "sedan",
    })[0];
    expect(result).toBeDefined();
    expect(result.match).toBeGreaterThan(0);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.tradeoffs.length).toBeGreaterThan(0);
    expect(result.scoreBreakdown.length).toBeGreaterThan(0);
  });

  it("uses swipe likes as a style signal", () => {
    const yaris = cars.find((car) => car.id === "toyota-yaris");
    expect(yaris).toBeDefined();
    const ordinary = scoreCar(
      yaris!,
      {},
      { likedCarIds: [], dislikedCarIds: [], cars },
    );
    const liked = scoreCar(
      yaris!,
      {},
      { likedCarIds: [yaris!.id], dislikedCarIds: [], cars },
    );
    expect(liked.match).toBeGreaterThan(ordinary.match);
    expect(
      liked.scoreBreakdown.some(
        (point) => point.label === "Style preference" && point.points > 0,
      ),
    ).toBe(true);
  });
});
