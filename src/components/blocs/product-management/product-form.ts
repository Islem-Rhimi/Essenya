export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  unit:
    | "per lb"
    | "per kg"
    | "per dozen"
    | "per piece"
    | "per bunch"
    | "per bag"
    | "per box"
    | "";
  farmer: string;
  location: string;
  category:
    | "vegetables"
    | "fruits"
    | "grains"
    | "dairy"
    | "meat"
    | "herbs"
    | "";
  tags: string[];
  status: "in-stock" | "out-of-stock" | "limited" | "";
  image: File | null;
  inventory: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  unit?: string;
  farmer?: string;
  location?: string;
  category?: string;
  status?: string;
  inventory?: string;
}
