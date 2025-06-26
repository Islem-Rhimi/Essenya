import React from "react";
import Carousel from "~/components/blocs/dashboard/Carousel";
import { ProductList } from "~/components/blocs/dashboard/ProductList";
import { MainLayout } from "~/layouts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Statistics from "~/components/blocs/dashboard/Statistics";
import ProductFilterBar from "~/components/blocs/dashboard/filter/ProductFilterSection";
import { Calendar } from "lucide-react";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6 p-6">
        {/* Statistics Cards Section */}
        <div className="space-y-4">
          <Statistics />
        </div>

        {/* Upcoming Events Carousel Card */}
        <Card className="gap-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <div className="flex space-x-2">
                  <Calendar className="text-primary" />
                  <h1 className="text-xl font-semibold">Upcoming Events</h1>
                </div>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Carousel />
          </CardContent>
        </Card>

        {/* Products Marketplace Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Fresh Products Marketplace
            </CardTitle>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <p className="text-muted-foreground text-sm">
                  Showing 12 of 156 products
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {/* Horizontal Filter Bar */}
                  <ProductFilterBar
                    onFilter={(filters) => {
                      console.log("Applied filters:", filters);
                    }}
                  />
                  <Select defaultValue="relevance">
                    <SelectTrigger className="focus:ring-primary bg-background rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">
                        Sort by relevance
                      </SelectItem>
                      <SelectItem value="price_low_high">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_high_low">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Products Grid */}
            <ProductList />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
