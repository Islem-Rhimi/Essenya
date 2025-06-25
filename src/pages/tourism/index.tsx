import React from "react";
import { EventCarousel } from "~/components/blocs/dashboard/EventCarousel";
import { ProductList } from "~/components/blocs/dashboard/ProductList";
import ProductFilterSection from "~/components/blocs/dashboard/filter/ProductFilterSection";
import { MainLayout } from "~/layouts";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          <div className="lg:col-span-8">
            <h1 className="mb-4 text-xl font-semibold">Product List</h1>
            <ProductList />
          </div>

          {/* Filter only visible on large screens */}
          <div className="border-l-foreground hidden border-l-2 p-3 lg:col-span-2 lg:block">
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

export default Dashboard;
