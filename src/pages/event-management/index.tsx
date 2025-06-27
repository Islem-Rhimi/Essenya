"use client";

import { EventFilters } from "~/components/blocs/event-management/EventFilters";
import { EventStats } from "~/components/blocs/event-management/EventStats";
import { EventTable } from "~/components/blocs/event-management/EventTable";
import { useEventFilters } from "@/hooks/useEventFilters";
import type { Event } from "~/components/blocs/event-management/event";
import { MainLayout } from "~/layouts";
import { Card } from "~/components/ui/card";
import { EventHeaderWithModal } from "~/components/blocs/event-management/EventHeader";

const sampleEvents: Event[] = [
  {
    id: 1,
    name: "Free-Range Eggs",
    image: "/images/products/apple.jpg",
    price: "$6.5",
    unit: "per dozen",
    farmer: "Sunny Acres",
    location: "Oregon",
    rating: 4.9,
    ratingCount: 45,
    tags: ["Organic", "Fresh"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 2,
    name: "Heritage Wheat",
    image: "/images/products/apple.jpg",
    price: "$15.99",
    unit: "per 10 lbs",
    farmer: "Prairie Gold",
    location: "Kansas",
    rating: 4.7,
    ratingCount: 18,
    tags: ["Grains", "Organic"],
    additionalTags: 1,
    status: "Out of Stock",
    statusColor: "bg-red-500",
  },
  {
    id: 3,
    name: "Organic Tomatoes",
    image: "/images/products/apple.jpg",
    price: "$4.99",
    unit: "per lb",
    farmer: "Green Valley Farm",
    location: "California",
    rating: 4.8,
    ratingCount: 24,
    tags: ["Organic", "Fresh"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
  {
    id: 4,
    name: "Organic Tomatoes",
    image: "/images/products/apple.jpg",
    price: "$4.99",
    unit: "per lb",
    farmer: "Green Valley Farm",
    location: "California",
    rating: 4.8,
    ratingCount: 24,
    tags: ["Organic", "Fresh"],
    additionalTags: 1,
    status: "In Stock",
    statusColor: "bg-gray-900",
  },
];

const filterTags = ["Organic", "Fresh", "Local", "Premium", "Grains"];

export default function EventManagementPage() {
  const { filters, filteredEvents, updateFilters } =
    useEventFilters(sampleEvents);

  const handleAddEvent = () => {
    console.log("Add new Event");
    // Navigate to add Event page or open modal
  };

  const handleEdit = (EventId: number) => {
    console.log("Edit Event:", EventId);
    // Navigate to edit page or open modal
  };

  const handleDelete = (EventId: number) => {
    console.log("Delete Event:", EventId);
    // Show confirmation dialog and delete
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-6">
        <div className="mx-auto">
          <Card className="mb-6 p-6">
            <EventHeaderWithModal onAddEvent={handleAddEvent} />
            <EventFilters
              filters={filters}
              onFiltersChange={updateFilters}
              filterTags={filterTags}
            />
          </Card>

          <EventStats
            totalEvents={sampleEvents.length}
            filteredEvents={filteredEvents.length}
          />

          <EventTable
            Events={filteredEvents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
}
