import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddProductModal } from "./AddProductModal";
import type { ProductFormData } from "~/components/blocs/product-management/product-form";

interface ProductHeaderProps {
  onAddProduct: (data: ProductFormData) => void;
}

export function ProductHeaderWithModal({ onAddProduct }: ProductHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (data: ProductFormData) => {
    onAddProduct(data);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <Button
          className="bg-primary hover:bg-green-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      <AddProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </>
  );
}
