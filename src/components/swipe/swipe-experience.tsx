"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/app-header";
import { cars } from "@/data/cars";
import { formatCurrency, formatFuelType } from "@/lib/format";
import { filterCars } from "@/features/recommendation/filters";
import { rankCars } from "@/features/recommendation/rank-cars";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useRecommendationStore } from "@/store/recommendation-store";
import { CarImage } from "@/components/cars/car-image";

export function SwipeExperience() {
  const router = useRouter();
  const hydrated = useStoresHydrated();
  const reduceMotion = useReducedMotion();
  const answers = useRecommendationStore((state) => state.answers);
  const likeCar = useRecommendationStore((state) => state.likeCar);
  const dislikeCar = useRecommendationStore((state) => state.dislikeCar);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const eligible = useMemo(() => filterCars(cars, answers), [answers]);
  const deck = useMemo(
    () =>
      rankCars(cars, answers)
        .slice(0, 10)
        .map((result) => cars.find((car) => car.id === result.carId))
        .filter((car) => car !== undefined),
    [answers],
  );
  const currentCar = deck[index];

  const respond = (liked: boolean) => {
    if (!currentCar) return;
    setDirection(liked ? 1 : -1);
    if (liked) likeCar(currentCar.id);
    else dislikeCar(currentCar.id);
    setIndex((current) => current + 1);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") respond(false);
      if (event.key === "ArrowRight") respond(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!hydrated)
    return (
      <>
        <AppHeader backHref="/find" backLabel="Back to questions" />
        <main className="app-main">
          <div className="loading-state">Loading your shortlist…</div>
        </main>
      </>
    );

  if (!eligible.length) {
    return (
      <div className="app-shell">
        <AppHeader backHref="/find" backLabel="Back to questions" />
        <main className="app-main">
          <div className="empty-state">
            <div className="empty-icon">
              <Heart size={19} />
            </div>
            <h2>Your brief is wonderfully specific</h2>
            <p>
              Our small demo collection doesn’t have a car that meets every hard
              requirement yet. Go back and open up one of your choices to keep
              exploring.
            </p>
            <button
              className="solid-button"
              onClick={() => router.push("/find")}
              type="button"
            >
              Adjust my answers <ArrowRight size={14} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const completed = index >= deck.length;

  return (
    <div className="app-shell">
      <AppHeader backHref="/find" backLabel="Back to questions" />
      <main className="app-main">
        <div className="swipe-intro">
          <span className="section-kicker">
            A little intuition goes a long way
          </span>
          <h1>Now, what feels like you?</h1>
          <p>We’ve got the practical stuff. Let’s find your taste.</p>
          {!completed && (
            <div
              aria-label={`${index + 1} of ${deck.length} cars`}
              className="swipe-progress"
            >
              {deck.map((car, cardIndex) => (
                <span
                  className={cardIndex <= index ? "active" : ""}
                  key={car.id}
                />
              ))}
            </div>
          )}
        </div>

        {completed ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Heart size={19} />
            </div>
            <h2>That gives us a feel for your style.</h2>
            <p>
              We’ll mix what you need with what you liked, then show you three
              considered matches.
            </p>
            <button
              className="solid-button"
              onClick={() => router.push("/results")}
              type="button"
            >
              Reveal my matches <ArrowRight size={14} />
            </button>
          </div>
        ) : currentCar ? (
          <>
            <div className="swipe-deck">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.article
                  animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                  className="swipe-card"
                  drag={reduceMotion ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.72}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: direction * 550,
                          rotate: direction * 13,
                        }
                  }
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }
                  }
                  key={currentCar.id}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 105) respond(true);
                    else if (info.offset.x < -105) respond(false);
                  }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.23,
                    ease: "easeOut",
                  }}
                  whileDrag={
                    reduceMotion ? undefined : { rotate: 4, scale: 1.02 }
                  }
                >
                  <CarImage car={currentCar} className="swipe-car-photo" />
                  <div className="swipe-shade" />
                  <div className="swipe-card-copy">
                    <span className="section-kicker">
                      {currentCar.yearStart}–{currentCar.yearEnd} ·{" "}
                      {currentCar.bodyType}
                    </span>
                    <h2>
                      {currentCar.make} {currentCar.model}
                    </h2>
                    <p>
                      {currentCar.trim} · {formatFuelType(currentCar.fuelType)}{" "}
                      · {formatCurrency(currentCar.priceMin)}–
                      {formatCurrency(currentCar.priceMax)}
                    </p>
                    <div className="swipe-stats">
                      <span>{currentCar.horsepower} hp</span>
                      <span>
                        {currentCar.fuelConsumption
                          ? `${currentCar.fuelConsumption} L/100 km`
                          : `${currentCar.electricConsumption} kWh/100 km`}
                      </span>
                      <span>{currentCar.transmission}</span>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
            <div className="swipe-actions">
              <Button
                aria-label="Not for me"
                className="shadcn-button"
                onClick={() => respond(false)}
                size="icon-lg"
                type="button"
                variant="outline"
              >
                <X aria-hidden="true" size={23} />
              </Button>
              <span className="swipe-progress-copy">
                {index + 1} / {deck.length}
              </span>
              <Button
                aria-label="I like this car"
                className="shadcn-button"
                onClick={() => respond(true)}
                size="icon-lg"
                type="button"
                variant="outline"
              >
                <Heart aria-hidden="true" size={22} />
              </Button>
            </div>
            <p className="swipe-hint">
              <ArrowLeft aria-hidden="true" size={11} /> Drag left to pass ·
              drag right to like · arrow keys work too{" "}
              <ArrowRight aria-hidden="true" size={11} />
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}
