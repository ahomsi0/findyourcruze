import type { Metadata } from "next";
import { SwipeExperience } from "@/components/swipe/swipe-experience";

export const metadata: Metadata = { title: "Find your style" };

export default function SwipePage() {
  return <SwipeExperience />;
}
