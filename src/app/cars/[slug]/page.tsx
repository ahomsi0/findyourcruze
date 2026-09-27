import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarDetail } from "@/components/cars/car-detail";
import { cars, getCarBySlug } from "@/data/cars";

export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  return car
    ? {
        title: `${car.make} ${car.model}`,
        description: `Explore the ${car.make} ${car.model} with Motch demo pricing, ownership estimates, strengths and trade-offs.`,
      }
    : { title: "Car not found" };
}

export default async function CarPage({ params }: PageProps<"/cars/[slug]">) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();
  return <CarDetail car={car} />;
}
