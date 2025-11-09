"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import { api } from "~/utils/api";
import type { Evenement } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";

type EventFormData = {
  title: string;
  date: string;
  time: string;
  duration: number;
  color: string;
  description: string;
};

type EventWithId = EventFormData & { id: string };

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventWithId | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    date: "",
    time: "09:00",
    duration: 60,
    color: "#3b82f6",
    description: "",
  });

  const { data, refetch } = api.evenement.getMyEvents.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const create = api.evenement.create.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
    },
  });

  const update = api.evenement.update.useMutation({
    onSuccess: async () => {
      await refetch();
      closeDialog();
    },
  });

  const deleteEvent = api.evenement.delete.useMutation({
    onSuccess: async () => {
      toast.success("Événement supprimé !");
      await refetch();
      closeDialog();
    },
    onError: () => {
      toast.error("Erreur: impossible de supprimer");
    },
  });

  const events: Evenement[] = data?.data ?? [];

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

  const getEventsForDate = (date: Date | null): Evenement[] => {
    if (!date) return [];

    const localDateStr = date.toLocaleDateString("fr-CA"); // format yyyy-MM-dd

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

  const openDialog = (
    date: Date | null = null,
    event: Evenement | null = null,
  ) => {
    if (event) {
      const eventDate = new Date(event.date);
      // Use local timezone for display
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, "0");
      const day = String(eventDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const hours = String(eventDate.getHours()).padStart(2, "0");
      const minutes = String(eventDate.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}`;

      setSelectedEvent({
        id: event.id,
        title: event.title,
        date: dateStr,
        time: timeStr,
        duration: 60,
        color: event.color,
        description: event.description ?? "",
      });
      setFormData({
        title: event.title,
        date: dateStr,
        time: timeStr,
        duration: 60,
        color: event.color,
        description: event.description ?? "",
      });
    } else {
      setSelectedEvent(null);
      const targetDate = date ?? new Date();
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      setFormData({
        title: "",
        date: dateStr,
        time: "09:00",
        duration: 60,
        color: "#3b82f6",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date) return;

    // Create date in local timezone, then convert to ISO string
    const dateTime = new Date(
      `${formData.date}T${formData.time}:00`,
    ).toISOString();

    if (selectedEvent) {
      update.mutate({
        id: selectedEvent.id,
        title: formData.title,
        date: dateTime,
        color: formData.color,
        description: formData.description || undefined,
      });
    } else {
      create.mutate({
        title: formData.title,
        date: dateTime,
        color: formData.color,
        description: formData.description || undefined,
      });
    }
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
        <button
          onClick={() => openDialog()}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Nouvel événement
        </button>
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

            return (
              <div
                key={index}
                className={`min-h-32 border-r border-b border-gray-200 p-2 ${
                  !date
                    ? "bg-gray-50"
                    : "cursor-pointer bg-white hover:bg-gray-50"
                } ${index % 7 === 0 ? "border-l-0" : ""}`}
                onClick={() => date && openDialog(date)}
              >
                {date && (
                  <>
                    <div
                      className={`mb-2 text-sm ${
                        isCurrentDay
                          ? "flex h-7 w-7 items-center justify-center rounded-full bg-green-600 font-semibold text-white"
                          : "font-medium text-gray-900"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="cursor-pointer truncate rounded p-1.5 text-xs text-white hover:opacity-80"
                          style={{ backgroundColor: event.color ?? "#D4AF37" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openDialog(null, event);
                          }}
                        >
                          <div className="truncate font-medium">
                            {event.title}
                          </div>
                          <div className="text-xs opacity-90">
                            {formatTime(new Date(event.date))}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="pl-1.5 text-xs font-medium text-gray-600">
                          +{dayEvents.length - 3} plus
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-semibold">
                {selectedEvent ? "Modifier l'événement" : "Nouvel événement"}
              </h3>
              <Button
                onClick={closeDialog}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="Nom de l'événement"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Heure
                  </label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Détails de l'événement"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Couleur
                </label>
                <div className="flex gap-2">
                  {[
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#ec4899",
                    "#06b6d4",
                  ].map((color) => (
                    <Button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-8 w-8 rounded-full ${formData.color === color ? "ring-2 ring-gray-400 ring-offset-2" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                {selectedEvent && (
                  <Button
                    onClick={() => deleteEvent.mutate({ id: selectedEvent.id })}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button
                    onClick={closeDialog}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                  >
                    Annuler
                  </Button>
                  <button
                    onClick={handleSubmit}
                    disabled={create.isPending || update.isPending}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {selectedEvent ? "Sauvegarder" : "Créer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
