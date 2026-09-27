import type { CSSProperties } from "react";
import type { Car } from "@/types/car";

export function CarImage({
  car,
  className = "",
  label,
}: {
  car: Car;
  className?: string;
  label?: string;
}) {
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(180deg, transparent 58%, rgba(17, 31, 30, .25) 100%), url("${car.image}")`,
    backgroundPosition: car.imagePosition ?? "center",
  };

  return (
    <div
      aria-label={label ?? `${car.make} ${car.model}`}
      className={`car-image ${className}`}
      role="img"
      style={style}
    />
  );
}
