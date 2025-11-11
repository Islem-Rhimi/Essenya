"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, User } from "lucide-react";
import { api } from "~/utils/api";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";

type Event = {
  id: string;
  title: string;
  description: string | null;
  localisation: string;
  image: string | null;
  date: Date;
  color: string;
  vendeur: {
    user: {
      name: string | null;
    };
  };
};

export default function PublicEventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const utils = api.useUtils();
  const { status } = useSession();

  // Fetch all public events
  const { data } = api.evenement.getAllEvents.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const Bookings = api.reservation.create.useMutation({
    onSuccess: async () => {
      await utils.reservation.myBookings.invalidate();
      setSelectedEvent(null);
      alert(
        "Succès ! Votre réservation a été envoyée. Veuillez patienter la confirmation.",
      );
    },
    onError: (error) => {
      console.error("❌ Create mutation error:", error);
      alert(`Erreur lors de la création: ${error.message}`);
    },
  });

  const events: Event[] = (data?.data ?? []) as Event[];

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const daysOfWeek = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const getEventsForDate = (date: Date | null): Event[] => {
    if (!date) return [];

    const localDateStr = date.toLocaleDateString("fr-CA");

    return events
      .filter((e) => {
        const eventLocal = new Date(e.date);
        const eventLocalStr = eventLocal.toLocaleDateString("fr-CA");
        return eventLocalStr === localDateStr;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + direction,
        1,
      ),
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto w-full bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
          >
            Aujourd&apos;hui
          </button>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigateMonth(-1)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => navigateMonth(1)}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h2 className="text-2xl font-semibold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentDay = isToday(date);
            const dateKey = date?.toISOString() ?? `empty-${index}`;
            const isHovered = hoveredDate === dateKey;

            return (
              <div
                key={index}
                className={`relative min-h-32 border-r border-b border-gray-200 p-2 ${
                  !date
                    ? "bg-gray-50"
                    : "cursor-pointer bg-white hover:bg-gray-50"
                } ${index % 7 === 0 ? "border-l-0" : ""}`}
                onMouseEnter={() => date && setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {date && (
                  <>
                    <div
                      className={`mb-2 text-sm ${
                        isCurrentDay
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-semibold text-white"
                          : "font-medium text-gray-900"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {/* Show first 3 events when not hovering */}
                      {!isHovered &&
                        dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="cursor-pointer truncate rounded p-1.5 text-xs text-white hover:opacity-80"
                            style={{
                              backgroundColor: event.color ?? "#D4AF37",
                            }}
                            onClick={() => setSelectedEvent(event)}
                          >
                            <div className="truncate font-medium">
                              {event.title}
                            </div>
                            <div className="text-xs opacity-90">
                              {formatTime(new Date(event.date))}
                            </div>
                          </div>
                        ))}
                      {!isHovered && dayEvents.length > 3 && (
                        <div className="pl-1.5 text-xs font-medium text-gray-600">
                          +{dayEvents.length - 3} plus
                        </div>
                      )}
                    </div>

                    {/* Hover popup to show all events */}
                    {isHovered && dayEvents.length > 0 && (
                      <div className="absolute top-0 left-0 z-50 w-64 rounded-lg border border-gray-300 bg-white p-3 shadow-xl">
                        <div className="mb-2 font-semibold text-gray-700">
                          {date.toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </div>
                        <div className="max-h-96 space-y-2 overflow-y-auto">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="cursor-pointer rounded p-2 text-xs text-white hover:opacity-80"
                              style={{
                                backgroundColor: event.color ?? "#D4AF37",
                              }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div className="opacity-90">
                                {formatTime(new Date(event.date))}
                              </div>
                              {event.localisation && (
                                <div className="mt-1 opacity-80">
                                  📍 {event.localisation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Event Image */}
            {selectedEvent.image && (
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Event Details */}
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedEvent.title}
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {/* Date and Time */}
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <div>
                    <div className="font-medium">
                      {formatFullDate(new Date(selectedEvent.date))}
                    </div>
                    <div className="text-sm">
                      {formatTime(new Date(selectedEvent.date))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{selectedEvent.localisation}</span>
                </div>

                {/* Organizer */}
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span>
                    Organisé par {selectedEvent.vendeur.user.name ?? "Anonyme"}
                  </span>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Description
                    </h3>
                    <p className="whitespace-pre-wrap text-gray-600">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-6 flex gap-3">
                  {status === "authenticated" && (
                    <Button
                      onClick={() =>
                        Bookings.mutate({ evenementId: selectedEvent.id })
                      }
                    >
                      Réserver
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
