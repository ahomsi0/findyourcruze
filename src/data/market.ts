export interface MarketAssumptions {
  id: string;
  name: string;
  currency: string;
  locale: string;
  fuelPricePerLiter: number;
  electricityPricePerKwh: number;
  monthlyInsurance: number;
  annualRegistration: number;
  financeApr: number;
  financeMonths: number;
}

// Demo values are deliberately centralized and clearly labeled as estimates.
export const demoMarket: MarketAssumptions = {
  id: "lb-demo",
  name: "Lebanon demo market",
  currency: "USD",
  locale: "en-LB",
  fuelPricePerLiter: 1.1,
  electricityPricePerKwh: 0.14,
  monthlyInsurance: 38,
  annualRegistration: 120,
  financeApr: 0.09,
  financeMonths: 48,
};
