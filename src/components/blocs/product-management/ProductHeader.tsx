// components/vendeur/ProductHeaderWithModal.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddProductModal } from "./AddProductModal";

export function ProductHeaderWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Produits</h1>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg">
          <Plus className="mr-2 h-5 w-5" />
          Nouveau produit
        </Button>
      </div>

      <AddProductModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
