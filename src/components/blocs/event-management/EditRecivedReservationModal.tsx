// components/vendeur/AddProductModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Edit, Loader2 } from "lucide-react";
import { api } from "~/utils/api";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";

interface EditRecivedReservationModalProps {
  reservationId: string;
  reservationTitre: string;
}

export function EditRecivedReservationModal({
  reservationId,
  reservationTitre,
}: EditRecivedReservationModalProps) {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const updateStatusMutation = api.reservation.updateStatus.useMutation({
    onSuccess: async () => {
      toast.success("réservation traitée avec succès!");
      await utils.reservation.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="flex items-center space-x-2 border border-blue-500/30 bg-white text-blue-500 transition hover:bg-blue-500/10 dark:bg-transparent"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <DialogHeader className="bg-produitd p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            Modifier le statut
          </DialogTitle>
          <DialogDescription>
            Vous souhaitez modifier le statut de la réservation de {" "}
            <span className="font-semibold text-yellow-500">
              {reservationTitre}
            </span>{" "}
            ?
            <br />
          </DialogDescription>
        </DialogHeader>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={updateStatusMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              updateStatusMutation.mutate({
                reservationId: reservationId,
                status: "Refusé",
              })
            }
            disabled={updateStatusMutation.isPending}
            className="min-w-40"
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              "Refusé"
            )}
          </Button>
          <Button
            onClick={() =>
              updateStatusMutation.mutate({
                reservationId: reservationId,
                status: "Accepté",
              })
            }
            disabled={updateStatusMutation.isPending}
            className="min-w-40"
          >
            {updateStatusMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              "Accepté"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
