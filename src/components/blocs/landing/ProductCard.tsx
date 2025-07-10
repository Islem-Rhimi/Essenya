import { Button } from "~/components/ui/button";

export interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  quantity: string;
  price: string;
  status?: "Available" | "Out of Stock" | "Coming Soon";
  tags: string[];
}

export default function ProductCard({
  image,
  name,
  category,
  quantity,
  price,
  status = "Available",
  tags,
}: ProductCardProps) {
  return (
    <div className="card-hover relative rounded-xl bg-white p-4 shadow-md dark:bg-black">
      <div
        className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-sm font-semibold ${
          status === "Out of Stock"
            ? "bg-red-600 text-white"
            : status === "Coming Soon"
              ? "bg-yellow-500 text-white"
              : "bg-primary text-black"
        }`}
      >
        {status}
      </div>

      <img
        src={image}
        alt={name}
        className="mb-6 h-[250px] w-full rounded-xl object-cover"
      />

      <div className="space-y-3">
        <h3 className="text-foreground text-2xl font-semibold">{name}</h3>
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>{category}</span>
          <span>{quantity}</span>
        </div>

        <div className="my-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-foreground rounded-full border px-3 py-1 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-foreground text-2xl font-bold">{price}</div>

        <div className="mt-3 flex justify-end gap-3">
          <Button className="rounded-md">View Details</Button>
        </div>
      </div>
    </div>
  );
}
