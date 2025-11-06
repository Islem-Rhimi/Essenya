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
    name: "Organic Carrots",
    image: "/images/products/carrot.jpg",
    price: "2.99",
    unit: "kg",
    farmer: "Sunny Acres",
    location: "Green Valley Farm, California",
    rating: 4.8,
    ratingCount: 45,
    tags: ["Organic", "Vegetables", "Local"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 2,
    name: "Red Apples",
    image: "/images/products/apple.jpg",
    price: "3.49",
    unit: "kg",
    farmer: "Prairie Gold",
    location: "Orchard Grove, Washington",
    rating: 4.6,
    ratingCount: 18,
    tags: ["Organic", "Fruits", "Local"],
    additionalTags: 1,
    status: "Out of Stock",
    statusColor: "bg-red-500",
  },
  {
    id: 3,
    name: "Green Lettuce",
    image: "/images/products/lettuce.jpg",
    price: "1.99",
    unit: "each",
    farmer: "Green Valley Farm",
    location: "Sunny Fields, Oregon",
    rating: 4.5,
    ratingCount: 24,
    tags: ["Fresh", "Vegetables"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 4,
    name: "Cherry Tomatoes",
    image: "/images/products/tomatoes.jpg",
    price: "3.99",
    unit: "box",
    farmer: "Green Valley Farm",
    location: "Sunrise Farm, Florida",
    rating: 4.9,
    ratingCount: 24,
    tags: ["Organic", "Fruits", "Premium"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 5,
    name: "Yellow Bananas",
    image: "/images/products/bananas.jpg",
    price: "1.49",
    unit: "kg",
    farmer: "",
    location: "Tropical Harvest, Ecuador",
    rating: 4.7,
    ratingCount: 0,
    tags: ["Organic", "Fruits"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 6,
    name: "Sweet Potatoes",
    image: "/images/products/sweet-potato.jpg",
    price: "2.79",
    unit: "kg",
    farmer: "",
    location: "Golden Farms, Texas",
    rating: 4.4,
    ratingCount: 0,
    tags: ["Vegetables", "Organic"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 7,
    name: "Cucumbers",
    image: "/images/products/cucumber.jpg",
    price: "1.25",
    unit: "each",
    farmer: "",
    location: "Harvest Hills, California",
    rating: 4.3,
    ratingCount: 0,
    tags: ["Fresh", "Vegetables"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 8,
    name: "Strawberries",
    image: "/images/products/strawberries.jpg",
    price: "4.99",
    unit: "box",
    farmer: "",
    location: "Berry Patch, Oregon",
    rating: 4.9,
    ratingCount: 0,
    tags: ["Fruits", "Premium"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 9,
    name: "Broccoli",
    image: "/images/products/broccoli.jpg",
    price: "2.29",
    unit: "kg",
    farmer: "",
    location: "Green Farms, Ohio",
    rating: 4.2,
    ratingCount: 0,
    tags: ["Vegetables", "Fresh"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 10,
    name: "Red Grapes",
    image: "/images/products/grapes.jpg",
    price: "3.79",
    unit: "kg",
    farmer: "",
    location: "Vineyard Valley, California",
    rating: 4.6,
    ratingCount: 0,
    tags: ["Fruits", "Premium"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 11,
    name: "Avocados",
    image: "/images/products/avocado.jpg",
    price: "1.99",
    unit: "each",
    farmer: "",
    location: "Avocado Grove, Mexico",
    rating: 4.8,
    ratingCount: 0,
    tags: ["Fruits", "Organic"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 12,
    name: "Bell Peppers",
    image: "/images/products/bell-pepper.jpg",
    price: "2.5",
    unit: "kg",
    farmer: "",
    location: "Sunshine Farms, Florida",
    rating: 4.5,
    ratingCount: 0,
    tags: ["Vegetables", "Organic"],
    additionalTags: 0,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
];

const filterTags = ["Organic", "Fresh", "Local", "Premium", "Grains"];

export default function ProductManagementPage() {
  const { filters, filteredProducts, updateFilters } =
    useProductFilters(sampleProducts);

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
            <ProductHeaderWithModal />
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
