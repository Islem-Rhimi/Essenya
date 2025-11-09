import Head from "next/head";
import { useState, useMemo } from "react";
import { PaginationContextProvider } from "~/common/components/pagination/context/pagination.context";
import Footer from "~/components/blocs/landing/Footer";
import Navbar from "~/components/blocs/landing/navbar";
import CategoryFilter from "~/components/blocs/service-marketplace/CategoryFilter";
import SearchBar from "~/components/blocs/service-marketplace/SearchBar";
import ServiceCard from "~/components/blocs/service-marketplace/ServiceCard";
import { ServiceList } from "~/components/blocs/service-marketplace/ServiceList";
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
    location: "Tunis",
    price: "450 Dinar per day",
    rating: 4.8,
    reviews: 32,
    category: "Machines",
    tags: ["Equipment", "Heavy Machinery"],
    image: "/images/tractor.jpg",
    availability: "Available",
    responseTime: "2 hours",
  },
  {
    id: 2,
    title: "Farm Hand Services",
    description:
      "Experienced agricultural workers available for seasonal work, harvesting, and general farm maintenance.",
    provider: "Prairie Labor Solutions",
    location: "kasserine",
    price: "25 Dinar per hour",
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
    location: "El Kef",
    price: "Starting at 120 Dinar",
    rating: 4.9,
    reviews: 45,
    category: "Veterinary",
    tags: ["Livestock", "Emergency Care"],
    image: "/images/dotor.jpg",
    availability: "Available",
    responseTime: "1 hour",
  },
  {
    id: 4,
    title: "Combine Harvester Rental",
    description:
      "Modern combine harvester with GPS guidance system. Ideal for wheat, corn, and soybean harvesting.",
    provider: "Midwest Machinery Co.",
    location: "Ariana",
    price: "$800 per day",
    rating: 4.7,
    reviews: 28,
    category: "Machines",
    tags: ["Equipment", "Harvesting"],
    image: "/images/heavydutyharvest.jpg",
    availability: "Booked until Oct 15",
    responseTime: "3 hours",
  },
  {
    id: 5,
    title: "Irrigation System Installation",
    description:
      "Professional installation and maintenance of drip irrigation and sprinkler systems.",
    provider: "Green Valley Irrigation",
    location: "Bizerte",
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
    location: "Nabeul",
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
    <>
      <Head>
        <title>Essenya</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Navbar />
        <main className="bg-[#f0fbf8] pt-20 dark:bg-[#18202f]">
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
              <PaginationContextProvider ressourcesName="Type">
                <ServiceList
                  searchQuery={searchQuery}
                  selectedTags={selectedTags}
                  selectedCategory={selectedCategory}
                />
              </PaginationContextProvider>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </>
  );
};
export default ServiceMarketplacePage;
