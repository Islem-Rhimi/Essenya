import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    name: string;
    description: string;
    image: string;
    price: number;
    unit: string;
    tags: string[];
    location: string;
    rating: number;
    reviews: number;
    inStock: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    name,
    description,
    image,
    price,
    unit,
    tags,
    location,
    rating,
    reviews,
    inStock,
  } = product;

  return (
    <div className="relative rounded-xl border bg-white p-3 shadow-sm hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden rounded-lg">
        <Image src={image} alt={name} fill className="object-cover" />
        {!inStock && (
          <span className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
            Out of Stock
          </span>
        )}
        <a className="absolute right-2 bottom-2 rounded-full bg-white p-1 shadow">
          <Heart className="text-muted-foreground h-4 w-4" />
        </a>
      </div>

      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h2 className="text-lg leading-snug font-semibold">{name}</h2>
        <p className="text-muted-foreground text-sm">{location}</p>

        <div className="flex items-center gap-1 text-sm text-yellow-500">
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviews} reviews)</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-foreground text-lg font-bold">
            ${price.toFixed(2)}
          </span>
          <span className="text-muted-foreground text-sm">per {unit}</span>
        </div>

        <Button
          variant="default"
          size="sm"
          className="mt-2 w-full"
          disabled={!inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
}
