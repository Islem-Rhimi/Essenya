"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { ProductCardProps } from "./ProductCard";

const sampleProducts: ProductCardProps[] = [
  {
    image: "/images/fwd/batata.jpg",
    name: "Fresh Potato",
    category: "Vegetables",
    quantity: "10kg",
    price: "15 TND",
    status: "Available", // ✅ now strictly typed
    tags: ["🍅 Organic", "🌿 Local", "🚚 Fast Delivery"],
  },
  {
    image: "/images/fwd/zitoun.jpg",
    name: "Farm Olive",
    category: "Fruit",
    quantity: "5L",
    price: "8 TND",
    status: "Coming Soon",
    tags: ["🍅 Organic", "🌿 Local", "🧑‍🌾 From Local Farm"],
  },
  {
    image: "/images/fwd/9ama7-2.jpeg",
    name: "Fresh Wheat",
    category: "Grass",
    quantity: "10kg",
    price: "15 TND",
    status: "Available", // ✅ now strictly typed
    tags: ["🍅 Organic", "🌿 Local", "🚚 Fast Delivery"],
  },
  {
    image: "/images/fwd/3neb.jpg",
    name: "Grapes",
    category: "Fruit",
    quantity: "5L",
    price: "8 TND",
    status: "Available",
    tags: ["🍅 Organic", "🧑‍🌾 From Local Farm"],
  },
  {
    image: "/images/fwd/5ou5.jpg",
    name: "Peaches",
    category: "Fruit",
    quantity: "10kg",
    price: "15 TND",
    status: "Available", // ✅ now strictly typed
    tags: ["🍅 Organic", "🌿 Local", "🚚 Fast Delivery"],
  },
  {
    image: "/images/fwd/tomate-1.jpg",
    name: "Fresh Tomatoes",
    category: "Fruit",
    quantity: "5L",
    price: "8 TND",
    status: "Available",
    tags: ["🍅 Organic", "🧑‍🌾 From Local Farm"],
  },
  {
    image: "/images/products/tomatoes.jpg",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    quantity: "10kg",
    price: "15 TND",
    status: "Available", // ✅ now strictly typed
    tags: ["🍅 Organic", "🌿 Local", "🚚 Fast Delivery"],
  },
  {
    image: "/images/products/milk.jpg",
    name: "Farm Fresh Milk",
    category: "Dairy",
    quantity: "5L",
    price: "8 TND",
    status: "Out of Stock",
    tags: ["🥛 Whole", "❄️ Chilled", "🧑‍🌾 From Local Farm"],
  },
];

export default function ProductListSection() {
  const [page, setPage] = useState(1);
  const perPage = 6;

  const totalPages = Math.ceil(sampleProducts.length / perPage);
  const paginated = sampleProducts.slice((page - 1) * perPage, page * perPage);

  return (
    <section id="featured" className="">
      <div className="mx-auto max-w-[1400px] flex-col justify-center space-y-10">
        <h2 className="section-title flex justify-center text-3xl font-bold">
          Featured Farm Products
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((product, i) => (
            <ProductCard key={i} {...product} />
          ))}
        </div>
      </div>
      {/* Pagination Controls (optional) */}
      {totalPages > 1 && (
        <div className="mt-6 flex w-full justify-center gap-4 bg-white p-4 dark:bg-black">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`rounded-full px-4 py-2 text-sm ${
                i + 1 === page
                  ? "bg-[var(--accent-gold)] font-semibold text-black"
                  : "bg-muted text-foreground hover:bg-muted-foreground/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
