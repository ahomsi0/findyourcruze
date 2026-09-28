import type { Metadata } from "next";
import { CarCatalogue } from "@/components/cars/car-catalogue";

export const metadata: Metadata = {
  title: "Car catalogue",
  description:
    "Browse, search and filter the full FindYourCruze car catalogue.",
};

export default function CataloguePage() {
  return <CarCatalogue />;
}
