import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { MainLayout } from "~/layouts";
import Image from "next/image";

const products = [
  {
    name: "Free-Range Eggs",
    price: "$6.5",
    unit: "per dozen",
    image: "/images/products/apple.jpg",
    farmer: "Sunny Acres",
    location: "Oregon",
    rating: 4.9,
    reviews: 45,
    tags: ["Organic", "Fresh"],
    status: "In Stock",
  },
  {
    name: "Heritage Wheat",
    price: "$15.99",
    unit: "per 10 lbs",
    image: "/images/products/apple.jpg",
    farmer: "Prairie Gold",
    location: "Kansas",
    rating: 4.7,
    reviews: 18,
    tags: ["Grains", "Organic"],
    status: "Out of Stock",
  },
  {
    name: "Organic Tomatoes",
    price: "$4.99",
    unit: "per lb",
    image: "/images/products/apple.jpg",
    farmer: "Green Valley Farm",
    location: "California",
    rating: 4.8,
    reviews: 24,
    tags: ["Organic", "Fresh"],
    status: "In Stock",
  },
];

export default function ProductManagement() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");

  return (
    <MainLayout>
      <div className="space-y-6 p-4">
        <div className="bg-background space-y-4 rounded-xl p-4 shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Product Management</h1>
            <Button size="default">
              <Plus className="h-4 w-4" /> New Product
            </Button>
          </div>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search products, farmers, or locations..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between md:w-48"
                >
                  {category}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => setCategory("All Products")}>
                  All Products
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCategory("Vegetables")}>
                  Vegetables
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCategory("Grains")}>
                  Grains
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setCategory("Fruits")}>
                  Fruits
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Organic", "Fresh", "Local", "Premium", "Grains"].map((tag) => (
              <Badge key={tag} variant="outline" className="cursor-pointer">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-background mt-4 overflow-x-auto rounded-xl p-4 shadow">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="p-3">Product Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Farmer</th>
                <th className="p-3">Location</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Tags</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="flex items-center gap-2 p-3">
                    <Image
                      src={product.image}
                      alt=""
                      width={30}
                      height={30}
                      className="rounded object-cover"
                    />
                    <div>{product.name}</div>
                  </td>
                  <td className="p-3">
                    {product.price}{" "}
                    <span className="text-gray-500">{product.unit}</span>
                  </td>
                  <td className="p-3">{product.farmer}</td>
                  <td className="p-3">{product.location}</td>
                  <td className="p-3">
                    ⭐ {product.rating} ({product.reviews})
                  </td>
                  <td className="space-x-1 p-3">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </td>
                  <td className="p-3">
                    <Badge
                      className={
                        product.status === "In Stock"
                          ? "bg-green-600"
                          : "bg-red-500"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="space-x-2 p-3">
                    <Button size="icon" variant="outline" className="h-7 w-7">
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
