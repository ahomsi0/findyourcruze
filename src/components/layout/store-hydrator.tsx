"use client";

import { useEffect } from "react";
import { useGarageStore } from "@/store/garage-store";
import { useRecommendationStore } from "@/store/recommendation-store";

const persistedStoreKeyMigrations = [
  ["motch-recommendation", "findyourcruze-recommendation"],
  ["motch-garage", "findyourcruze-garage"],
] as const;

function migratePersistedStoreKeys() {
  for (const [legacyKey, currentKey] of persistedStoreKeyMigrations) {
    try {
      if (window.localStorage.getItem(currentKey) !== null) continue;
      const legacyValue = window.localStorage.getItem(legacyKey);
      if (legacyValue !== null) {
        window.localStorage.setItem(currentKey, legacyValue);
      }
    } catch {
      // Keep hydration running if browser storage is unavailable.
    }
  }
}

export function StoreHydrator() {
  useEffect(() => {
    migratePersistedStoreKeys();
    void useRecommendationStore.persist.rehydrate();
    void useGarageStore.persist.rehydrate();
  }, []);

  return null;
}
