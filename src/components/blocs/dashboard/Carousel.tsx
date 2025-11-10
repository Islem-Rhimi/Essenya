"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api } from "~/utils/api";
import { Card } from "@/components/ui/card";

export default function Carousel() {
  const [current, setCurrent] = useState<number>(0);
  const [paused, setPaused] = useState(false);

  const { data, isLoading, error } = api.evenement.getAllEvents.useQuery(
    undefined,
    {
      select: (data) => ({
        ...data,
        data: data.data.slice(0, 3), // Get only the 3 nearest events
      }),
    },
  );

  const prevSlide = () => {
    if (!data?.data.length) return;
    setCurrent((prev) => (prev === 0 ? data.data.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (!data?.data.length) return;
    setCurrent((prev) => (prev === data.data.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (paused || !data?.data.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === data.data.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, data?.data.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4">
        <Card>
          <div className="flex h-64 items-center justify-center md:h-80 lg:h-96">
            <div className="text-muted-foreground">
              Chargement des événements...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-4">
        <Card>
          <div className="flex h-64 items-center justify-center md:h-80 lg:h-96">
            <div className="text-red-500">
              Erreur lors du chargement des événements
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // No events
  if (!data?.data.length) {
    return (
      <div className="px-4">
        <Card>
          <div className="flex h-64 items-center justify-center md:h-80 lg:h-96">
            <div className="text-muted-foreground">
              Aucun événement à venir pour le moment
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const events = data.data;
  const event = events[current]!;

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-4">
      {/* Header with Arrows */}
      <div className="flex justify-end p-2">
        <div className="flex gap-1">
          <button
            onClick={prevSlide}
            className="bg-background rounded-md border border-gray-300 p-2 shadow transition hover:bg-gray-100"
            aria-label="Diapositive précédente"
            disabled={events.length <= 1}
          >
            <ChevronLeft className="h-4 w-4 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-background rounded-md border border-gray-300 p-2 shadow transition hover:bg-gray-100"
            aria-label="Diapositive suivante"
            disabled={events.length <= 1}
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
            src={event.image ?? "/images/event.jpg"}
            alt={event.title}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 flex items-end bg-black/40 p-6">
            <div className="max-w-2xl text-white">
              <h2 className="text-2xl font-bold md:text-3xl">{event.title}</h2>

              {event.description && (
                <p className="mt-2 line-clamp-3 text-sm md:text-base">
                  {event.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {event.localisation}
                </div>
                {event.vendeur?.user?.name && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Par {event.vendeur.user.name}
                  </div>
                )}
              </div>

              <Button className="mt-4" size="sm">
                En Savoir Plus
              </Button>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        {events.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {events.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                  current === i ? "w-8 bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
