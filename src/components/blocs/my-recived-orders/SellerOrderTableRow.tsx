import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Commande, Paiement, Produits, User } from "@prisma/client";
import {
  UpdateStatusModal,
  type CommandeStatut,
} from "./EditMyRecivedOrderModal";
import { useState } from "react";

interface SellerOrderRowProps {
  order: Commande & {
    produit: Produits;
    paiement?: Paiement | null;
    user: User;
  };
}

export default function SellerOrderTableRow({ order }: SellerOrderRowProps) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={order.produit.imageUrl ?? "/placeholder.png"}
            alt={order.produit.nom}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-cover"
          />
          <span className="font-medium">{order.produit.nom}</span>
        </div>
      </TableCell>

      <TableCell>{order.user.name ?? "Client inconnu"}</TableCell>

      <TableCell>
        {new Date(order.date).toLocaleString("fr-FR", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </TableCell>

      <TableCell>{order.quantite}</TableCell>

      <TableCell>{order.paiement?.montant ?? "—"}</TableCell>

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

      <TableCell>{order.notes}</TableCell>
      <TableCell className="flex justify-center">
        <div className="flex gap-2">
          <UpdateStatusModal
            open={editOpen}
            onOpenChange={setEditOpen}
            orderId={order.id}
            currentStatut={order.statut as CommandeStatut}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
