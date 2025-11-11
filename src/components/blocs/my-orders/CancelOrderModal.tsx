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

import { Loader2 } from "lucide-react";
import { api } from "~/utils/api";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";

interface CancelOrderModalProps {
  orderId: string;
  nomProduit: string;
}

export function CancelOrderModal({
  orderId,
  nomProduit,
}: CancelOrderModalProps) {
  const [open, setOpen] = React.useState(false);
  const utils = api.useUtils();

  const deleteproduitMutation = api.commande.cancelOrder.useMutation({
    onSuccess: async () => {
      toast.success("Voiture supprimée avec succès!");
      await utils.produits.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });

  const handleDelete = () => {
    deleteproduitMutation.mutate({ orderId: orderId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-500/30 bg-transparent text-red-500 transition hover:bg-red-500/10"
        >
          Annuler
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-0">
        <DialogHeader className="bg-produitd p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">
            Confirmer la annulation
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir annuler{" "}
            <span className="font-semibold text-yellow-500">{nomProduit}</span>{" "}
            ?
            <br />
            <span className="text-red-400">Cette action est irréversible.</span>
          </DialogDescription>
        </DialogHeader>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={deleteproduitMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteproduitMutation.isPending}
            className="min-w-40"
          >
            {deleteproduitMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                En cours...
              </>
            ) : (
              "Annulee"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
