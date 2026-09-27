import { describe, expect, it } from "vitest";
import {
  calculateFinancing,
  calculateMonthlyPayment,
} from "./calculate-financing";

describe("financing estimates", () => {
  it("calculates an amortized monthly payment", () => {
    expect(calculateMonthlyPayment(12_000, 0.12, 36)).toBeCloseTo(398.57, 2);
  });

  it("handles a zero-interest loan", () => {
    expect(calculateMonthlyPayment(12_000, 0, 24)).toBe(500);
  });

  it("keeps the down payment out of the financed principal", () => {
    const estimate = calculateFinancing(20_000, 5_000, 0.09, 48);
    expect(estimate.principal).toBe(15_000);
    expect(estimate.monthlyPayment).toBeGreaterThan(0);
    expect(estimate.totalInterest).toBeGreaterThan(0);
  });
});
