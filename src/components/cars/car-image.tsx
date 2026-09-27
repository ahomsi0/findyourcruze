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
  const carName = label ?? `${car.make} ${car.model}`;
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(180deg, transparent 58%, rgba(17, 25, 39, .25) 100%), url("${car.image}")`,
    backgroundPosition: car.imagePosition ?? "center",
  };
  const attribution = car.imageAttribution;

  return (
    <div
      aria-label={`${carName} photo`}
      className={`car-image ${className}`}
      role="group"
      style={style}
    >
      {attribution ? (
        <span className="car-image-credit">
          <span>Photo:</span>
          <a
            href={attribution.sourceUrl}
            onPointerDown={(event) => event.stopPropagation()}
            rel="noreferrer"
            target="_blank"
          >
            {attribution.author}
          </a>
          <span aria-hidden="true">·</span>
          {attribution.licenseUrl ? (
            <a
              href={attribution.licenseUrl}
              onPointerDown={(event) => event.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              {attribution.licenseName}
            </a>
          ) : (
            <span>{attribution.licenseName}</span>
          )}
        </span>
      ) : null}
    </div>
  );
}
