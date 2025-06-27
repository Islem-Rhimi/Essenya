import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddserviceModal } from "./AddServiceModal";
import type { ServiceFormData } from "~/components/blocs/service-management/service-form";

interface ServiceHeaderProps {
  onAddservice: (data: ServiceFormData) => void;
}

export function ServiceHeaderWithModal({ onAddservice }: ServiceHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddservice = (data: ServiceFormData) => {
    onAddservice(data);
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
          New service
        </Button>
      </div>

      <AddserviceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddservice}
      />
    </>
  );
}
