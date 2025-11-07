import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { api } from "~/utils/api";
import { useState } from "react";
import type { Produits } from "@prisma/client";
import { EditProductModal } from "./EditProductModal";

interface ProductTableRowProps {
  product: Produits;
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const utils = api.useUtils();
  const deleteMutation = api.produits.delete.useMutation({
    onSuccess: async () => {
      await utils.produits.getMyProducts.invalidate();
    },
  });

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync({ id: product.id });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      {/* Image + Name */}
      <TableCell>
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
          <span className="font-medium text-gray-900">{product.nom}</span>
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
      <TableCell>
        <span className="text-gray-700">{product.localisation}</span>
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
      <TableCell>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <EditProductModal
            open={editOpen}
            onOpenChange={setEditOpen}
            product={product}
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
            disabled={deleting}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
