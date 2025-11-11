"use client";
import { useState } from "react";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Define the status type
export type CommandeStatut =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_COURS"
  | "LIVREE"
  | "ANNULEE";

export function UpdateStatusModal({
  orderId,
  currentStatut,
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  currentStatut: CommandeStatut;
}) {
  const [statut, setStatut] = useState<CommandeStatut>(currentStatut);
  const utils = api.useUtils();
  const mutation = api.commande.updateStatut.useMutation({
    onSuccess: async () => {
      await utils.commande.vendeurOrders.invalidate();
      onOpenChange(false);
    },
  });
  const handleUpdate = () => {
    mutation.mutate({ orderId, statut });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Changer statut</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le statut</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select
            value={statut}
            onValueChange={(value) => setStatut(value as CommandeStatut)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              <SelectItem value="CONFIRMEE">Confirmée</SelectItem>
              <SelectItem value="EN_COURS">En cours</SelectItem>
              <SelectItem value="LIVREE">Livrée</SelectItem>
              <SelectItem value="ANNULEE">Annulée</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleUpdate}
            disabled={mutation.isPending}
          >
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
