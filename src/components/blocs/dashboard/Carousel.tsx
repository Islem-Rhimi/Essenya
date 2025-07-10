"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: " Honey Harvest Festival 2026",
    description:
      "Join us for a sweet and immersive experience at our annual Honey Harvest Festival, where you’ll discover the art of sustainable beekeeping and honey collection. Learn how local farmers nurture bees, explore live hive demos, and taste freshly harvested organic honey — straight from the source!",
    date: "March 15-17, 2026",
    location: "kasserine",
    attendees: "1200 attendees",
    image: "/images/event.jpg", // Correct path
  },
  {
    title: " Honey Harvest Festival 2026",
    description:
      "Join us for a sweet and immersive experience at our annual Honey Harvest Festival, where you’ll discover the art of sustainable beekeeping and honey collection. Learn how local farmers nurture bees, explore live hive demos, and taste freshly harvested organic honey — straight from the source!",
    date: "March 15-17, 2026",
    location: "kasserine",
    attendees: "1200 attendees",
    image: "/images/event.jpg", // Correct path
  },
  {
    title: "Organic Farmers Meet 2024",
    description:
      "Network with top organic farmers and learn innovative cultivation methods.",
    date: "July 10-12, 2024",
    location: "Austin, Texas",
    attendees: "950 attendees",
    image: "/images/event.jpg", // Correct path
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState<number>(0);
  const [paused, setPaused] = useState(false);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  const slide = slides[current]!; // Safe, controlled state prevents out-of-bounds

  return (
    <div className="px-4">
      {/* Header with Arrows */}
      <div className="flex justify-end p-2">
        <div className="flex gap-1">
          <button
            onClick={prevSlide}
            className="bg-background rounded-md border border-gray-300 p-2 shadow transition hover:bg-gray-100"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-background rounded-md border border-gray-300 p-2 shadow transition hover:bg-gray-100"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl shadow-md"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 flex items-end bg-black/40 p-6">
            <div className="max-w-md text-white">
              <h2 className="text-2xl font-bold md:text-3xl">{slide.title}</h2>
              <p className="mt-2 text-sm md:text-base">{slide.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {slide.date}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {slide.attendees}
                </div>
              </div>
              <Button className="mt-4" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 cursor-pointer rounded-full ${
                current === i ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
