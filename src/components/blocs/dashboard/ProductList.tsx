import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { HoverEffect } from "~/components/ui/aceternity/hover-effec";
import ProductCard from "./ProductCard";
// You need to import this component from Aceternity’s source

export function ProductList() {
  const products = [
    {
      name: "Organic Carrots",
      description: "Fresh from the farm.",
      image: "/images/products/carrot.jpg",
      price: "$2.99/kg",
    },
    {
      name: "Red Apples",
      description: "Crisp and sweet.",
      image: "/images/products/apple.jpg",
      price: "$3.49/kg",
    },
    {
      name: "Green Lettuce",
      description: "Crisp and refreshing greens.",
      image: "/images/products/lettuce.jpg",
      price: "$1.99/each",
    },
    {
      name: "Cherry Tomatoes",
      description: "Perfect for salads and snacks.",
      image: "/images/products/tomatoes.jpg",
      price: "$3.99/box",
    },
    {
      name: "Yellow Bananas",
      description: "Rich in potassium.",
      image: "/images/products/bananas.jpg",
      price: "$1.49/kg",
    },
    {
      name: "Sweet Potatoes",
      description: "Delicious and healthy.",
      image: "/images/products/sweet-potato.jpg",
      price: "$2.79/kg",
    },
    {
      name: "Cucumbers",
      description: "Cool and crunchy.",
      image: "/images/products/cucumber.jpg",
      price: "$1.25/each",
    },
    {
      name: "Strawberries",
      description: "Juicy and sweet.",
      image: "/images/products/strawberries.jpg",
      price: "$4.99/box",
    },
    {
      name: "Broccoli",
      description: "Packed with nutrients.",
      image: "/images/products/broccoli.jpg",
      price: "$2.29/kg",
    },
    {
      name: "Red Grapes",
      description: "Seedless and sweet.",
      image: "/images/products/grapes.jpg",
      price: "$3.79/kg",
    },
    {
      name: "Avocados",
      description: "Perfectly ripe and creamy.",
      image: "/images/products/avocado.jpg",
      price: "$1.99/each",
    },
    {
      name: "Bell Peppers",
      description: "Colorful and flavorful.",
      image: "/images/products/bell-pepper.jpg",
      price: "$2.50/kg",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
      {products.length === 0 && (
        <div className="text-muted p-4 text-center">
          No products found. Adjust your filters.
        </div>
      )}
    </section>
  );
}
