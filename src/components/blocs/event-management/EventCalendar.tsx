"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Trash2,
  Check,
  Loader2,
  Upload,
} from "lucide-react";
import { api } from "~/utils/api";
import type { Evenement } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  eventInputSchema,
  type eventInputSchemaType,
} from "~/validations/events/eventInputSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";

// Form type matches schema exactly
// type EventFormType = eventInputSchemaType; // Not needed anymore

export default function EventCalendar() {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<eventInputSchemaType>({
    resolver: zodResolver(eventInputSchema),
    defaultValues: {
      title: "",
      localisation: "",
      description: "",
      image: "",
      date: "",
      time: "09:00",
      color: "#3b82f6",
    },
  });

  // API queries and mutations
  const { data, refetch } = api.evenement.getMyEvents.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const create = api.evenement.create.useMutation({
    onSuccess: async () => {
      await refetch();
      toast.success("Événement créé !");
      closeDialog();
    },
    onError: () => {
      toast.error("Erreur lors de la création");
    },
  });

  const update = api.evenement.update.useMutation({
    onSuccess: async () => {
      await refetch();
      toast.success("Événement modifié !");
      closeDialog();
    },
    onError: () => {
      toast.error("Erreur lors de la modification");
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
  const formValues = watch();

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

  const openDialog = (
    date: Date | null = null,
    event: Evenement | null = null,
  ) => {
    if (event) {
      // Editing existing event
      const eventDate = new Date(event.date);

      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, "0");
      const day = String(eventDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      const hours = String(eventDate.getHours()).padStart(2, "0");
      const minutes = String(eventDate.getMinutes()).padStart(2, "0");
      const timeStr = `${hours}:${minutes}`;

      setSelectedEventId(event.id);

      // Reset form with event values
      reset({
        title: event.title,
        localisation: event.localisation,
        date: dateStr,
        time: timeStr,
        color: event.color ?? "#3b82f6",
        image: event.image ?? "",
        description: event.description ?? "",
      });

      setUploadedUrl(event.image ?? "");
    } else {
      // Creating new event
      setSelectedEventId(null);
      const targetDate = date ?? new Date();
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // Reset form with default values
      reset({
        title: "",
        localisation: "",
        date: dateStr,
        time: "09:00",
        color: "#3b82f6",
        image: "",
        description: "",
      });

      setUploadedUrl("");
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedEventId(null);
    setUploadedUrl("");
    reset();
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

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(
            errorData.error ?? `Upload failed with status ${response.status}`,
          );
        }

        const data = (await response.json()) as { url: string };
        console.log("✅ Image uploaded:", data.url);
        setUploadedUrl(data.url);
        setValue("image", data.url, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (error) {
        console.error("❌ Upload error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";
        toast.error(`Erreur lors du téléchargement: ${errorMessage}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Form submission handler
  const onSubmit: SubmitHandler<eventInputSchemaType> = async (formData) => {
    // Prepare mutation data - send both date and time as strings
    const mutationData = {
      title: formData.title,
      localisation: formData.localisation,
      date: formData.date,
      time: formData.time,
      color: formData.color || "#3b82f6",
      image: formData.image || undefined,
      description: formData.description || undefined,
    };

    if (selectedEventId) {
      // Update existing event
      update.mutate({
        id: selectedEventId,
        ...mutationData,
      });
    } else {
      // Create new event
      create.mutate(mutationData);
    }
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
            const dateKey = date?.toISOString() || `empty-${index}`;
            const isHovered = hoveredDate === dateKey;

            return (
              <div
                key={index}
                className={`relative min-h-32 border-r border-b border-gray-200 p-2 ${
                  !date
                    ? "bg-gray-50"
                    : "cursor-pointer bg-white hover:bg-gray-50"
                } ${index % 7 === 0 ? "border-l-0" : ""}`}
                onClick={() => date && openDialog(date)}
                onMouseEnter={() => date && setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
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
                      {/* Show first 3 events when not hovering */}
                      {!isHovered &&
                        dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="cursor-pointer truncate rounded p-1.5 text-xs text-white hover:opacity-80"
                            style={{
                              backgroundColor: event.color ?? "#D4AF37",
                            }}
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
                      {!isHovered && dayEvents.length > 3 && (
                        <div className="pl-1.5 text-xs font-medium text-gray-600">
                          +{dayEvents.length - 3} plus
                        </div>
                      )}
                    </div>

                    {/* Hover popup to show all events */}
                    {isHovered && dayEvents.length > 3 && (
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
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(null, event);
                              }}
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

      {/* Event Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-semibold">
                {selectedEventId ? "Modifier l'événement" : "Nouvel événement"}
              </h3>
              <Button
                type="button"
                onClick={closeDialog}
                className="rounded p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4 p-6">
              {/* IMAGE UPLOAD */}
              <div className="space-y-3">
                <Label>Photo de l'événement</Label>
                <div
                  className="hover:border-primary/50 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all"
                  onClick={(e) => {
                    if (!uploadedUrl && !isUploading) {
                      e.currentTarget
                        .querySelector<HTMLInputElement>('input[type="file"]')
                        ?.click();
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    void onDrop(Array.from(e.dataTransfer.files));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {uploadedUrl ? (
                    <div className="space-y-4">
                      <Image
                        src={uploadedUrl}
                        alt="événement"
                        height={200}
                        width={460}
                        className="mx-auto max-h-64 rounded-lg shadow-xl"
                      />
                      <div className="flex justify-center gap-2">
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          Prête
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedUrl("");
                            setValue("image", "");
                          }}
                        >
                          Changer
                        </Button>
                      </div>
                    </div>
                  ) : isUploading ? (
                    <div className="space-y-4">
                      <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                      <p className="text-sm">Upload en cours...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="text-muted-foreground mx-auto h-14 w-14" />
                      <p className="text-sm">
                        Glissez votre image ici ou{" "}
                        <span className="text-primary underline">cliquez</span>
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            void onDrop(Array.from(e.target.files));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <p className="text-muted-foreground text-xs">
                        Max 4 Mo • JPG, PNG
                      </p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </div>

              {/* TITLE */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Titre *
                </label>
                <input
                  {...register("title")}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="Nom de l'événement"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* LOCALISATION */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Localisation *
                </label>
                <input
                  {...register("localisation")}
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="Lieu de l'événement"
                />
                {errors.localisation && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.localisation.message}
                  </p>
                )}
              </div>

              {/* DATE & TIME */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <Input
                    {...register("date")}
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Heure *
                  </label>
                  <Input
                    {...register("time")}
                    type="time"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Détails de l'événement"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* COLOR PICKER */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Couleur *
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
                      onClick={() =>
                        setValue("color", color, { shouldValidate: true })
                      }
                      className={`h-8 w-8 rounded-full transition-all ${
                        formValues.color === color
                          ? "ring-2 ring-gray-400 ring-offset-2"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {errors.color && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between pt-4">
                {selectedEventId && (
                  <Button
                    type="button"
                    onClick={() => deleteEvent.mutate({ id: selectedEventId })}
                    disabled={deleteEvent.isPending}
                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button
                    type="button"
                    onClick={closeDialog}
                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                  >
                    Annuler
                  </Button>
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={
                      isSubmitting || create.isPending || update.isPending
                    }
                    className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSubmitting || create.isPending || update.isPending
                      ? "En cours..."
                      : selectedEventId
                        ? "Sauvegarder"
                        : "Créer"}
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
