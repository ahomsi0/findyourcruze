import { formatCurrency } from "@/lib/format";

export function PriceRange({ min, max }: { min: number; max: number }) {
  return (
    <span>
      {formatCurrency(min)} <span aria-hidden="true">—</span>{" "}
      {formatCurrency(max)}
    </span>
  );
}
