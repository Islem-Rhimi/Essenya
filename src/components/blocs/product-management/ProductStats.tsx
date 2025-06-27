interface ProductStatsProps {
  totalProducts: number;
  filteredProducts: number;
}

export function ProductStats({
  totalProducts,
  filteredProducts,
}: ProductStatsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600">
        Showing {filteredProducts} of {totalProducts} products
      </p>
    </div>
  );
}
