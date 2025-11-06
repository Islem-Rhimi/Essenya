"use client";

import { ProductFilters } from "~/components/blocs/product-management/ProductFilters";
import { ProductTable } from "~/components/blocs/product-management/ProductTable";
import { MainLayout } from "~/layouts";
import { Card } from "~/components/ui/card";
import { ProductHeaderWithModal } from "~/components/blocs/product-management/ProductHeader";
import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import { useState } from "react";

export default function ProductManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto flex-col space-y-6">
          <Card className="p-6">
            <ProductHeaderWithModal />
            <ProductFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <ProductTable searchValue={searchTerm} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
