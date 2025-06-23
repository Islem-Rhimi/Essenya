"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  product: {
    name: string;
    description: string;
    image: string;
    price: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group/card w-full max-w-xs">
      <div
        className={cn(
          "relative mx-auto flex h-96 max-w-sm cursor-pointer flex-col justify-between overflow-hidden rounded-md bg-cover bg-center bg-no-repeat p-4 shadow-xl",
        )}
      >
        {/* Image layer */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="rounded-xl object-cover"
        />

        {/* Black hover overlay */}
        <div className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-40 transition duration-300 group-hover/card:opacity-60" />

        {/* Header */}
        <div className="z-20 flex flex-row items-center space-x-4">
          <img
            height="100"
            width="100"
            alt="Avatar"
            src="/manu.png"
            className="h-10 w-10 rounded-full border-2 object-cover"
          />
          <div className="flex flex-col">
            <p className="text-base font-normal text-gray-50">{product.name}</p>
            <p className="text-sm text-gray-300">{product.price}</p>
          </div>
        </div>

        {/* Content */}
        <div className="z-20">
          <h1 className="text-xl font-bold text-white md:text-2xl">
            {product.name}
          </h1>
          <p className="my-4 text-sm text-gray-200">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
