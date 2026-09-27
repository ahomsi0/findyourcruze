import type { Metadata } from "next";
import { CompareExperience } from "@/components/compare/compare-experience";

export const metadata: Metadata = { title: "Compare cars" };

export default function ComparePage() {
  return <CompareExperience />;
}
