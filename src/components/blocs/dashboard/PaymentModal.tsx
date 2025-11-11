"use client";

import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Loader2 } from "lucide-react";

import type { Produits } from "@prisma/client";
import { api } from "~/utils/api";
import type { CreateCommandeInput } from "~/validations/commades/createCommandeWithPaymentSchema ";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Produits;
}

export default function PaymentModal({
  isOpen,
  onClose,
  product,
}: PaymentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCommandeInput>({
    defaultValues: {
      quantite: "1",
      adresseLivraison: "",
      notes: "",
    },
  });

  const quantite = watch("quantite") || "1";

  const montantTotal = (
    parseFloat(product.prix) * parseFloat(quantite)
  ).toFixed(2);

  // ✅ TRPC mutation
  const createCommande = api.commande.createWithPayment.useMutation({
    onSuccess: () => {
      reset();
      onClose();
    },
  });

  const onSubmit = async (data: CreateCommandeInput) => {
    await createCommande.mutateAsync({
      produitId: product.id,
      quantite: data.quantite,
      montant: montantTotal,
      adresseLivraison: data.adresseLivraison,
      notes: data.notes ?? "",
      methodePaiement: "carte",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Finaliser votre commande
          </DialogTitle>
          <DialogDescription>
            Complétez les informations pour acheter {product.nom}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Summary */}
          <div className="rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
            <h4 className="mb-2 font-semibold">{product.nom}</h4>
            <div className="text-muted-foreground space-y-1 text-sm">
              <p>
                Prix unitaire: {product.prix} Dinar / {product.unite}
              </p>
              <p>Localisation: {product.localisation}</p>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantite">Quantité</Label>
            <Input
              type="number"
              min={1}
              max={product.inventaire}
              {...register("quantite", {
                required: "La quantité est requise",
                min: { value: 1, message: "Minimum 1" },
              })}
            />
            {errors.quantite && (
              <p className="text-sm text-red-500">{errors.quantite.message}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="space-y-2">
            <Label>Adresse de livraison</Label>
            <Textarea
              rows={3}
              {...register("adresseLivraison", {
                required: "Adresse requise",
                minLength: { value: 5, message: "Adresse trop courte" },
              })}
            />
            {errors.adresseLivraison && (
              <p className="text-sm text-red-500">
                {errors.adresseLivraison.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optionnel)</Label>
            <Textarea rows={2} {...register("notes")} />
          </div>

          {/* Total */}
          <div className="rounded-lg border-2 border-green-600 bg-green-50 p-4 dark:bg-green-950">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Montant Total:</span>
              <span className="text-2xl font-bold text-green-600">
                {montantTotal} Dinar
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              className="flex-1"
              disabled={createCommande.isPending}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={createCommande.isPending}
            >
              {createCommande.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : (
                "Confirmer la commande"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
