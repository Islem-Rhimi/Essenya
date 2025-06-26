import React from "react";
import { ProductList } from "~/components/blocs/dashboard/ProductList";
import ProductFilterSection from "~/components/blocs/dashboard/filter/ProductFilterSection";
import { MainLayout } from "~/layouts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FarmService = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1">
        <div className="grid grid-cols-1 lg:grid-cols-10">
          <div className="p-6 lg:col-span-8">
            <h1 className="mb-4 text-xl font-semibold">Product List</h1>
            <div>
              <span>showing count</span>
              <div className="w-[200px]">
                <Select defaultValue="relevance">
                  <SelectTrigger className="focus:ring-primary rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by relevance</SelectItem>
                    <SelectItem value="price_low_high">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price_high_low">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <ProductList />
          </div>

          {/* Filter only visible on large screens */}
          <div className="bg-background sticky hidden p-6 shadow-sm lg:col-span-2 lg:block">
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

export default FarmService;
