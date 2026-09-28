import { z } from "zod";

export const bodyTypes = [
  "hatchback",
  "sedan",
  "coupe",
  "suv",
  "crossover",
  "pickup",
  "minivan",
] as const;

export const fuelTypes = ["petrol", "diesel", "hybrid", "electric"] as const;

export const scoreCategories = [
  "reliability",
  "economy",
  "performance",
  "luxury",
  "technology",
  "resale",
  "practicality",
  "maintenance",
] as const;

export const carSchema = z.object({
  id: z.string(),
  slug: z.string(),
  make: z.string(),
  model: z.string(),
  trim: z.string().optional(),
  yearStart: z.number().int(),
  yearEnd: z.number().int(),
  bodyType: z.enum(bodyTypes),
  fuelType: z.enum(fuelTypes),
  transmission: z.string(),
  drivetrain: z.string(),
  horsepower: z.number(),
  zeroToHundred: z.number().optional(),
  fuelConsumption: z.number().optional(),
  electricConsumption: z.number().optional(),
  priceMin: z.number(),
  priceMax: z.number(),
  scores: z.object(
    Object.fromEntries(
      scoreCategories.map((category) => [category, z.number().min(0).max(10)]),
    ) as Record<(typeof scoreCategories)[number], z.ZodNumber>,
  ),
  estimatedAnnualMaintenance: z.number(),
  image: z.string().url(),
  imagePosition: z.string().optional(),
  imageAttribution: z
    .object({
      author: z.string(),
      sourceUrl: z.string().url(),
      licenseName: z.string(),
      licenseUrl: z.string().url().optional(),
    })
    .optional(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
});

export type BodyType = (typeof bodyTypes)[number];
export type FuelType = (typeof fuelTypes)[number];
export type ScoreCategory = (typeof scoreCategories)[number];
export type Car = z.infer<typeof carSchema>;

export const categoryLabels: Record<ScoreCategory, string> = {
  reliability: "Reliability",
  economy: "Fuel economy",
  performance: "Performance",
  luxury: "Comfort & luxury",
  technology: "Technology",
  resale: "Resale value",
  practicality: "Practicality",
  maintenance: "Maintenance",
};

export const bodyTypeLabels: Record<BodyType, string> = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  coupe: "Coupe",
  suv: "SUV",
  crossover: "Crossover",
  pickup: "Pickup",
  minivan: "Minivan",
};

export const fuelTypeLabels: Record<FuelType, string> = {
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
  electric: "Electric",
};
