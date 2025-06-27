"use client";

import { ServiceFilters } from "~/components/blocs/service-management/ServiceFilters";
import { ServiceStats } from "~/components/blocs/service-management/ServiceStats";
import { ServiceTable } from "~/components/blocs/service-management/ServiceTable";
import { useServiceFilters } from "@/hooks/useServiceFilters";
import type { Service } from "~/components/blocs/service-management/service";
import { MainLayout } from "~/layouts";
import { Card } from "~/components/ui/card";
import { ServiceHeaderWithModal } from "~/components/blocs/service-management/ServiceHeader";

const sampleservices: Service[] = [
  {
    id: 1,
    name: "Free-Range Eggs",
    image: "/images/products/apple.jpg",
    price: "$6.5",
    unit: "per dozen",
    farmer: "Sunny Acres",
    location: "Oregon",
    rating: 4.9,
    ratingCount: 45,
    tags: ["Organic", "Fresh"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 2,
    name: "Heritage Wheat",
    image: "/images/products/apple.jpg",
    price: "$15.99",
    unit: "per 10 lbs",
    farmer: "Prairie Gold",
    location: "Kansas",
    rating: 4.7,
    ratingCount: 18,
    tags: ["Grains", "Organic"],
    additionalTags: 1,
    status: "Out of Stock",
    statusColor: "bg-red-500",
  },
  {
    id: 3,
    name: "Organic Tomatoes",
    image: "/images/products/apple.jpg",
    price: "$4.99",
    unit: "per lb",
    farmer: "Green Valley Farm",
    location: "California",
    rating: 4.8,
    ratingCount: 24,
    tags: ["Organic", "Fresh"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 4,
    name: "Organic Tomatoes",
    image: "/images/products/apple.jpg",
    price: "$4.99",
    unit: "per lb",
    farmer: "Green Valley Farm",
    location: "California",
    rating: 4.8,
    ratingCount: 24,
    tags: ["Organic", "Fresh"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
];

const filterTags = ["Organic", "Fresh", "Local", "Premium", "Grains"];

export default function serviceManagementPage() {
  const { filters, filteredservices, updateFilters } =
    useServiceFilters(sampleservices);

  const handleAddservice = () => {
    console.log("Add new service");
    // Navigate to add service page or open modal
  };

  const handleEdit = (serviceId: number) => {
    console.log("Edit service:", serviceId);
    // Navigate to edit page or open modal
  };

  const handleDelete = (serviceId: number) => {
    console.log("Delete service:", serviceId);
    // Show confirmation dialog and delete
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 p-6">
            <ServiceHeaderWithModal onAddservice={handleAddservice} />
            <ServiceFilters
              filters={filters}
              onFiltersChange={updateFilters}
              filterTags={filterTags}
            />
          </Card>

          <ServiceStats
            totalservices={sampleservices.length}
            filteredservices={filteredservices.length}
          />

          <ServiceTable
            services={filteredservices}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}
