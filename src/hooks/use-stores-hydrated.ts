"use client";

import { useEffect, useState } from "react";
import { useGarageStore } from "@/store/garage-store";
import { useRecommendationStore } from "@/store/recommendation-store";

export function useStoresHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const checkHydration = () => {
      if (
        useRecommendationStore.persist.hasHydrated() &&
        useGarageStore.persist.hasHydrated()
      ) {
        setHydrated(true);
      }
    };

    const unsubscribeRecommendation =
      useRecommendationStore.persist.onFinishHydration(checkHydration);
    const unsubscribeGarage =
      useGarageStore.persist.onFinishHydration(checkHydration);
    checkHydration();

    return () => {
      unsubscribeRecommendation();
      unsubscribeGarage();
    };
  }, []);

  return hydrated;
}
