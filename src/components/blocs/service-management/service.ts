export interface Service {
  id: number;
  name: string;
  image: string;
  price: string;
  unit: string;
  farmer: string;
  location: string;
  rating: number;
  ratingCount: number;
  tags: string[];
  additionalTags: number;
  status: string;
  statusColor: string;
}

export interface ServiceFilters {
  searchTerm: string;
  selectedCategory: string;
  activeFilters: string[];
}
