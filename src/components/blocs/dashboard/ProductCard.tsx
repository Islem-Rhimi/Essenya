import Image from "next/image";
import { Heart, ShoppingCart, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Produits } from "@prisma/client";

interface ProductCardProps {
  product: Produits;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group bg-card relative rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        <Image
          src={product.imageUrl ?? ""}
          alt={product.nom}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Heart Icon */}
        <Button className="absolute top-3 right-3 rounded-full bg-transparent p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
          <Heart className="h-4 w-4 text-gray-600 transition-colors hover:fill-red-500 hover:text-red-500" />
        </Button>

        {/* Out of Stock Badge */}
        {!product.statut && (
          <div className="absolute top-3 left-3 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white">
            Out of Stock
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="space-y-3 p-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Product Name */}
        <h3 className="text-foreground text-lg leading-tight font-semibold">
          {product.nom}
        </h3>

        {/* Location */}
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3" />
          <span>{product.localisation}</span>
        </div>

        {/* Rating */}
        {/* <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-foreground text-sm font-medium">
            {rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground text-sm">
            ({reviews} reviews)
          </span>
        </div> */}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-600">
              ${product.prix}
            </span>
            <span className="text-muted-foreground text-xs">
              per {product.unite}
            </span>
          </div>

          <Button
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={!product.statut}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
