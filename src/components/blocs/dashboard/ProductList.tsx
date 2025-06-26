import ProductCard from "./ProductCard";

export function ProductList() {
  const products = [
    {
      name: "Organic Carrots",
      description: "Fresh from the farm.",
      image: "/images/products/carrot.jpg",
      price: 2.99,
      unit: "kg",
      tags: ["Organic", "Vegetables", "Local"],
      location: "Green Valley Farm, California",
      rating: 4.8,
      reviews: 24,
      inStock: true,
    },
    {
      name: "Red Apples",
      description: "Crisp and sweet.",
      image: "/images/products/apple.jpg",
      price: 3.49,
      unit: "kg",
      tags: ["Organic", "Fruits", "Local"],
      location: "Orchard Grove, Washington",
      rating: 4.6,
      reviews: 30,
      inStock: true,
    },
    {
      name: "Green Lettuce",
      description: "Crisp and refreshing greens.",
      image: "/images/products/lettuce.jpg",
      price: 1.99,
      unit: "each",
      tags: ["Fresh", "Vegetables"],
      location: "Sunny Fields, Oregon",
      rating: 4.5,
      reviews: 18,
      inStock: true,
    },
    {
      name: "Cherry Tomatoes",
      description: "Perfect for salads and snacks.",
      image: "/images/products/tomatoes.jpg",
      price: 3.99,
      unit: "box",
      tags: ["Organic", "Fruits", "Premium"],
      location: "Sunrise Farm, Florida",
      rating: 4.9,
      reviews: 50,
      inStock: true,
    },
    {
      name: "Yellow Bananas",
      description: "Rich in potassium.",
      image: "/images/products/bananas.jpg",
      price: 1.49,
      unit: "kg",
      tags: ["Organic", "Fruits"],
      location: "Tropical Harvest, Ecuador",
      rating: 4.7,
      reviews: 40,
      inStock: true,
    },
    {
      name: "Sweet Potatoes",
      description: "Delicious and healthy.",
      image: "/images/products/sweet-potato.jpg",
      price: 2.79,
      unit: "kg",
      tags: ["Vegetables", "Organic"],
      location: "Golden Farms, Texas",
      rating: 4.4,
      reviews: 15,
      inStock: true,
    },
    {
      name: "Cucumbers",
      description: "Cool and crunchy.",
      image: "/images/products/cucumber.jpg",
      price: 1.25,
      unit: "each",
      tags: ["Fresh", "Vegetables"],
      location: "Harvest Hills, California",
      rating: 4.3,
      reviews: 22,
      inStock: true,
    },
    {
      name: "Strawberries",
      description: "Juicy and sweet.",
      image: "/images/products/strawberries.jpg",
      price: 4.99,
      unit: "box",
      tags: ["Fruits", "Premium"],
      location: "Berry Patch, Oregon",
      rating: 4.9,
      reviews: 60,
      inStock: true,
    },
    {
      name: "Broccoli",
      description: "Packed with nutrients.",
      image: "/images/products/broccoli.jpg",
      price: 2.29,
      unit: "kg",
      tags: ["Vegetables", "Fresh"],
      location: "Green Farms, Ohio",
      rating: 4.2,
      reviews: 10,
      inStock: true,
    },
    {
      name: "Red Grapes",
      description: "Seedless and sweet.",
      image: "/images/products/grapes.jpg",
      price: 3.79,
      unit: "kg",
      tags: ["Fruits", "Premium"],
      location: "Vineyard Valley, California",
      rating: 4.6,
      reviews: 35,
      inStock: true,
    },
    {
      name: "Avocados",
      description: "Perfectly ripe and creamy.",
      image: "/images/products/avocado.jpg",
      price: 1.99,
      unit: "each",
      tags: ["Fruits", "Organic"],
      location: "Avocado Grove, Mexico",
      rating: 4.8,
      reviews: 27,
      inStock: true,
    },
    {
      name: "Bell Peppers",
      description: "Colorful and flavorful.",
      image: "/images/products/bell-pepper.jpg",
      price: 2.5,
      unit: "kg",
      tags: ["Vegetables", "Organic"],
      location: "Sunshine Farms, Florida",
      rating: 4.5,
      reviews: 20,
      inStock: true,
    },
  ];

  return (
    <section className="backdrop- rounded-2xl">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground p-4 text-center">
          No products found. Adjust your filters.
        </div>
      )}
    </section>
  );
}
