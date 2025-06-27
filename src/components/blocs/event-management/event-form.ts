export interface EventFormData {
  name: string;
  description: string;
  price: string;
  unit: string;
  farmer: string;
  location: string;
  category: string;
  tags: string[];
  status: string;
  image: File | null;
  inventory: string;
}

export interface EventFormErrors {
  name?: string;
  description?: string;
  price?: string;
  unit?: string;
  farmer?: string;
  location?: string;
  category?: string;
  tags?: string;
  status?: string;
  image?: string;
  inventory?: string;
}
