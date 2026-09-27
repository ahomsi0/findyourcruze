import type { Metadata } from "next";
import { FindWizard } from "@/components/questionnaire/find-wizard";

export const metadata: Metadata = { title: "Find your car" };

export default function FindPage() {
  return <FindWizard />;
}
