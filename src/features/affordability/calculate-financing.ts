export interface FinancingEstimate {
  principal: number;
  monthlyPayment: number;
  totalInterest: number;
}

export function calculateMonthlyPayment(
  principal: number,
  apr: number,
  months: number,
): number {
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = apr / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function calculateFinancing(
  price: number,
  downPayment: number,
  apr: number,
  months: number,
): FinancingEstimate {
  const principal = Math.max(0, price - downPayment);
  const monthlyPayment = calculateMonthlyPayment(principal, apr, months);
  return {
    principal,
    monthlyPayment,
    totalInterest: Math.max(0, monthlyPayment * months - principal),
  };
}
