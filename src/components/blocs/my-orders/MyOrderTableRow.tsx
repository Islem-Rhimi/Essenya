import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Commande, Paiement, Produits } from "@prisma/client";
import { CancelOrderModal } from "./CancelOrderModal";

interface MyOrderTableProps {
  order: Commande & {
    produit: Produits;
    paiement?: Paiement | null;
  };
}

export function MyOrderTableRow({ order }: MyOrderTableProps) {
  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      <TableCell className="pl-8">
        <div className="flex items-center gap-3">
          {order.produit.imageUrl ? (
            <Image
              src={order.produit.imageUrl}
              alt={order.produit.nom}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-200" />
          )}
          <span className="font-medium text-gray-900 dark:text-amber-100">
            {order.produit.nom}
          </span>
        </div>
      </TableCell>

      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {order.date
            ? new Date(order.date).toLocaleString("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "—"}
        </span>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {order.adresseLivraison}
        </span>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">{order.quantite}</span>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {order.paiement?.montant}
        </span>
      </TableCell>

      <TableCell>
        <Badge
          variant="secondary"
          className={
            order.statut === "En attente"
              ? "bg-gray-100 text-gray-700"
              : order.statut === "Accepté"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-red-700"
          }
        >
          {order.statut}
        </Badge>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">{order.notes}</span>
      </TableCell>

      <TableCell className="flex justify-center">
        <div className="flex gap-2">
          <CancelOrderModal orderId={order.id} nomProduit={order.produit.nom} />
        </div>
      </TableCell>
    </TableRow>
  );
}
