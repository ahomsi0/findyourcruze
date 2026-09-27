"use client";

import { useEffect } from "react";
import { useGarageStore } from "@/store/garage-store";
import { useRecommendationStore } from "@/store/recommendation-store";

export function StoreHydrator() {
  useEffect(() => {
    void useRecommendationStore.persist.rehydrate();
    void useGarageStore.persist.rehydrate();
  }, []);

  return null;
}
