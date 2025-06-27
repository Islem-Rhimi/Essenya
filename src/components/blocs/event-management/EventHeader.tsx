import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddEventModal } from "./AddEventModal";
import type { EventFormData } from "./event-form";

interface EventHeaderProps {
  onAddEvent: (data: EventFormData) => void;
}

export function EventHeaderWithModal({ onAddEvent }: EventHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEvent = (data: EventFormData) => {
    onAddEvent(data);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Filter :</h1>
        <Button
          className="bg-primary hover:bg-green-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <AddEventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
      />
    </>
  );
}
