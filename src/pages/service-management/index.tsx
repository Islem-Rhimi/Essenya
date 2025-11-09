"use client";

import { MainLayout } from "~/layouts";
import { Card } from "~/components/ui/card";
import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import { useState } from "react";
import { ServiceHeader } from "~/components/blocs/service-management/ServiceHeader";
import { ServiceFilters } from "~/components/blocs/service-management/ServiceFilters";
import { ServiceTable } from "~/components/blocs/service-management/ServiceTable";

export default function ServiceManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto flex-col space-y-6">
          <Card className="p-6">
            <ServiceHeader />
            <ServiceFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </Card>
          <PaginationContextProvider ressourcesName="Type">
            <ServiceTable searchValue={searchTerm} />
          </PaginationContextProvider>
        </div>
      </div>
    </MainLayout>
  );
}
