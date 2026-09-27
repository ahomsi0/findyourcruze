"use client";

import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useGarageStore } from "@/store/garage-store";
import { Heart, Scale } from "lucide-react";

export function CarActions({ carId }: { carId: string }) {
  const hydrated = useStoresHydrated();
  const carIds = useGarageStore((state) => state.carIds);
  const compareIds = useGarageStore((state) => state.compareIds);
  const addCar = useGarageStore((state) => state.addCar);
  const addToCompare = useGarageStore((state) => state.addToCompare);
  const inGarage = carIds.includes(carId);
  const inCompare = compareIds.includes(carId);

  return (
    <div className="detail-actions">
      <button
        aria-pressed={inGarage}
        className="solid-button"
        disabled={!hydrated}
        onClick={() => addCar(carId)}
        type="button"
      >
        <Heart aria-hidden="true" size={14} />{" "}
        {inGarage ? "Saved in my garage" : "Add to my garage"}
      </button>
      <button
        aria-pressed={inCompare}
        className="outline-button"
        disabled={!hydrated || (!inCompare && compareIds.length >= 3)}
        onClick={() => addToCompare(carId)}
        type="button"
      >
        <Scale aria-hidden="true" size={14} />{" "}
        {inCompare ? "In my comparison" : "Compare"}
      </button>
    </div>
  );
}
