import type { Metadata } from "next";
import { ResultsExperience } from "@/components/results/results-experience";

export const metadata: Metadata = { title: "Your car matches" };

export default function ResultsPage() {
  return <ResultsExperience />;
}
