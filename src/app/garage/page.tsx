import type { Metadata } from "next";
import { GarageExperience } from "@/components/garage/garage-experience";

export const metadata: Metadata = { title: "My garage" };

export default function GaragePage() {
  return <GarageExperience />;
}
