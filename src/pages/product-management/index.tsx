"use client";

import { ProductFilters } from "~/components/blocs/product-management/ProductFilters";
import { ProductStats } from "~/components/blocs/product-management/ProductStats";
import { ProductTable } from "~/components/blocs/product-management/ProductTable";
import { useProductFilters } from "@/hooks/useProductFilters";
import type { Product } from "~/components/blocs/product-management/product";
import { MainLayout } from "~/layouts";
import { Card } from "~/components/ui/card";
import { ProductHeaderWithModal } from "~/components/blocs/product-management/ProductHeader";

const sampleProducts: Product[] = [
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

export default function ProductManagementPage() {
  const { filters, filteredProducts, updateFilters } =
    useProductFilters(sampleProducts);

  const handleAddProduct = () => {
    console.log("Add new product");
    // Navigate to add product page or open modal
  };

  const handleEdit = (productId: number) => {
    console.log("Edit product:", productId);
    // Navigate to edit page or open modal
  };

  const handleDelete = (productId: number) => {
    console.log("Delete product:", productId);
    // Show confirmation dialog and delete
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 p-6">
            <ProductHeaderWithModal onAddProduct={handleAddProduct} />
            <ProductFilters
              filters={filters}
              onFiltersChange={updateFilters}
              filterTags={filterTags}
            />
          </Card>

          <ProductStats
            totalProducts={sampleProducts.length}
            filteredProducts={filteredProducts.length}
          />

          <ProductTable
            products={filteredProducts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}
