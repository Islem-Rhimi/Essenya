import { useState, useMemo } from "react";
import CategoryFilter from "~/components/blocs/service-marketplace/CategoryFilter";
import SearchBar from "~/components/blocs/service-marketplace/SearchBar";
import ServiceCard from "~/components/blocs/service-marketplace/ServiceCard";
import TagsFilter from "~/components/blocs/service-marketplace/TagsFilter";
import { Card } from "~/components/ui/card";
import { MainLayout } from "~/layouts";

const servicesData = [
  {
    id: 1,
    title: "Heavy Duty Tractor Rental",
    description:
      "John Deere 8R Series tractor available for daily or weekly rental. Perfect for large field operations.",
    provider: "Sunny Acres Equipment",
    location: "Oregon",
    price: "$450 per day",
    rating: 4.8,
    reviews: 32,
    category: "Machines",
    tags: ["Equipment", "Heavy Machinery"],
    image:
      "https://images.unsplash.com/photo-1544797217-6ba31c6eb8b4?w=400&h=300&fit=crop",
    availability: "Available",
    responseTime: "2 hours",
  },
  {
    id: 2,
    title: "Farm Hand Services",
    description:
      "Experienced agricultural workers available for seasonal work, harvesting, and general farm maintenance.",
    provider: "Prairie Labor Solutions",
    location: "Kansas",
    price: "$25 per hour",
    rating: 4.6,
    reviews: 18,
    category: "Labor",
    tags: ["Seasonal Work", "Harvesting"],
    image:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=400&h=300&fit=crop",
    availability: "Available",
    responseTime: "4 hours",
  },
  {
    id: 3,
    title: "Mobile Veterinary Services",
    description:
      "Complete livestock health services including vaccinations, health checks, and emergency care.",
    provider: "Dr. Sarah Martinez DVM",
    location: "California",
    price: "Starting at $120",
    rating: 4.9,
    reviews: 45,
    category: "Veterinary",
    tags: ["Livestock", "Emergency Care"],
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    availability: "Available",
    responseTime: "1 hour",
  },
  {
    id: 4,
    title: "Combine Harvester Rental",
    description:
      "Modern combine harvester with GPS guidance system. Ideal for wheat, corn, and soybean harvesting.",
    provider: "Midwest Machinery Co.",
    location: "Iowa",
    price: "$800 per day",
    rating: 4.7,
    reviews: 28,
    category: "Machines",
    tags: ["Equipment", "Harvesting"],
    image:
      "https://images.unsplash.com/photo-1574263867128-cfa2e54b7fcf?w=400&h=300&fit=crop",
    availability: "Booked until Oct 15",
    responseTime: "3 hours",
  },
  {
    id: 5,
    title: "Irrigation System Installation",
    description:
      "Professional installation and maintenance of drip irrigation and sprinkler systems.",
    provider: "Green Valley Irrigation",
    location: "Arizona",
    price: "Quote on request",
    rating: 4.5,
    reviews: 22,
    category: "Labor",
    tags: ["Installation", "Irrigation"],
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    availability: "Available",
    responseTime: "6 hours",
  },
  {
    id: 6,
    title: "Soil Testing & Analysis",
    description:
      "Comprehensive soil analysis including pH, nutrients, and contamination testing with detailed reports.",
    provider: "AgriLab Services",
    location: "Texas",
    price: "$85 per sample",
    rating: 4.8,
    reviews: 67,
    category: "Veterinary",
    tags: ["Testing", "Analysis"],
    image:
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
    availability: "Available",
    responseTime: "24 hours",
  },
];

const ServiceMarketplacePage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Services");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = ["All Services", "Machines", "Labor", "Veterinary"];
  const allTags = [
    "Equipment",
    "Heavy Machinery",
    "Seasonal Work",
    "Harvesting",
    "Livestock",
    "Emergency Care",
    "Installation",
    "Irrigation",
    "Testing",
    "Analysis",
  ];

  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch = service.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Services" ||
        service.category === selectedCategory;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => service.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchQuery, selectedCategory, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Card className="mb-6 p-6">
            <h1 className="text-2xl font-semibold">Filter :</h1>
            <div className="flex items-center justify-between gap-2">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
            <TagsFilter
              allTags={allTags}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
            />
          </Card>
          <Card className="mb-6 p-6">
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
export default ServiceMarketplacePage;
