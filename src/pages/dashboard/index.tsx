import React from "react";
import { EventCarousel } from "~/components/blocs/dashboard/EventCarousel";
import { ProductList } from "~/components/blocs/dashboard/ProductList";
import ProductFilterSection from "~/components/blocs/dashboard/filter/ProductFilterSection";
import { MainLayout } from "~/layouts";
const Dashboard = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 gap-6">
        <h1>Events</h1>
        <div className="w flex h-full justify-center">
          <EventCarousel />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          <div className="lg:col-span-7">
            <h1>Product List</h1>
            <ProductList />
          </div>

          <div className="border-l-primary border-l-2 p-3 lg:col-span-3">
            <div className="relative h-fit overflow-visible">
              <ProductFilterSection
                onFilter={(filters) => {
                  console.log(filters);
                  // Example: filters = { tags: ["Fruits", "Organic"], priceMin: 10, priceMax: 50 }
                  // Trigger your product filtering logic here
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
