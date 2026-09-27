import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GarageState {
  carIds: string[];
  compareIds: string[];
  addCar: (id: string) => void;
  removeCar: (id: string) => void;
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  setCompare: (ids: string[]) => void;
  clearCompare: () => void;
}

export const useGarageStore = create<GarageState>()(
  persist(
    (set) => ({
      carIds: [],
      compareIds: [],
      addCar: (id) =>
        set((state) => ({
          carIds: state.carIds.includes(id)
            ? state.carIds
            : [...state.carIds, id],
        })),
      removeCar: (id) =>
        set((state) => ({
          carIds: state.carIds.filter((carId) => carId !== id),
          compareIds: state.compareIds.filter((carId) => carId !== id),
        })),
      addToCompare: (id) =>
        set((state) => ({
          compareIds:
            state.compareIds.includes(id) || state.compareIds.length >= 3
              ? state.compareIds
              : [...state.compareIds, id],
        })),
      removeFromCompare: (id) =>
        set((state) => ({
          compareIds: state.compareIds.filter((carId) => carId !== id),
        })),
      setCompare: (ids) => set({ compareIds: [...new Set(ids)].slice(0, 3) }),
      clearCompare: () => set({ compareIds: [] }),
    }),
    {
      name: "findyourcruze-garage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        carIds: state.carIds,
        compareIds: state.compareIds,
      }),
    },
  ),
);
