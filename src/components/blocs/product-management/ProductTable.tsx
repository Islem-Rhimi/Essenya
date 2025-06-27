import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import type { Product } from "./product";
import { ProductTableRow } from "./ProductTableRow";

interface ProductTableProps {
  products: Product[];
  onEdit: (productId: number) => void;
  onDelete: (productId: number) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="font-medium text-gray-600">
              Product Name
            </TableHead>
            <TableHead className="font-medium text-gray-600">Price</TableHead>
            <TableHead className="font-medium text-gray-600">Farmer</TableHead>
            <TableHead className="font-medium text-gray-600">
              Location
            </TableHead>
            <TableHead className="font-medium text-gray-600">Rating</TableHead>
            <TableHead className="font-medium text-gray-600">Tags</TableHead>
            <TableHead className="font-medium text-gray-600">Status</TableHead>
            <TableHead className="font-medium text-gray-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductTableRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
