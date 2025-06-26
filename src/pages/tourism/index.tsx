import React from "react";
import { ProductList } from "~/components/blocs/dashboard/ProductList";
import ProductFilterSection from "~/components/blocs/dashboard/filter/ProductFilterSection";
import { MainLayout } from "~/layouts";

const Tourism = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-1 lg:grid-cols-10">
          <div className="p-6 lg:col-span-8">
            <h1 className="mb-4 text-xl font-semibold">Product List</h1>
            <ProductList />
          </div>

          {/* Filter only visible on large screens */}
          <div className="bg-background sticky hidden rounded-lg p-6 shadow-2xl lg:col-span-2 lg:block">
            <div className="relative h-fit space-y-4 overflow-visible">
              <h1 className="pb-2 text-xl font-semibold">Product Filter</h1>
              <ProductFilterSection
                onFilter={(filters) => {
                  console.log(filters);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tourism;
