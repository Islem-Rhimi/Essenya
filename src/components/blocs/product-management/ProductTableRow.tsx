import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import type { Product } from "./product";
import Image from "next/image";

interface ProductTableRowProps {
  product: Product;
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
}

export function ProductTableRow({
  product,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={product.image}
            alt={product.name}
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
          />
          <span className="font-medium text-gray-900">{product.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-semibold text-green-600">
          {product.price}
          <span className="ml-1 font-normal text-gray-500">{product.unit}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-gray-900">{product.farmer}</span>
      </TableCell>
      <TableCell>
        <span className="text-gray-700">{product.location}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.ratingCount})</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-1">
          {product.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
          {product.additionalTags > 0 && (
            <span className="text-sm text-gray-500">
              +{product.additionalTags}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`${product.statusColor} text-white hover:${product.statusColor}/90`}
        >
          {product.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product.id)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product.id)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
