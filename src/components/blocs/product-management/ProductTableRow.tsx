import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Produits } from "@prisma/client";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";

interface ProductTableRowProps {
  product: Produits;
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      {/* Image + Name */}
      <TableCell className="pl-8">
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.nom}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-200" />
          )}
          <span className="font-medium text-gray-900 dark:text-amber-100">
            {product.nom}
          </span>
        </div>
      </TableCell>

      {/* Price */}
      <TableCell>
        <div className="font-semibold text-green-600">
          {product.prix}
          <span className="ml-1 font-normal text-gray-500">
            / {product.unite}
          </span>
        </div>
      </TableCell>

      {/* Farmer */}

      {/* Location */}
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {product.localisation}
        </span>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {product.quantite}
        </span>
      </TableCell>

      {/* Tags */}
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge
          variant={product.statut === "ACTIF" ? "default" : "secondary"}
          className={
            product.statut === "ACTIF"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }
        >
          {product.statut}
        </Badge>
      </TableCell>

      {/* Actions */}
      <TableCell className="flex justify-center">
        <div className="flex gap-2">
          <Button
            className="flex items-center space-x-2 border border-blue-500/30 bg-white text-blue-500 transition hover:bg-blue-500/10 dark:bg-transparent"
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <EditProductModal
            open={editOpen}
            onOpenChange={setEditOpen}
            product={product}
          />

          <DeleteProductModal
            produitId={product.id}
            produitName={product.nom}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
