export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  categories: {
    id: string;
    name: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
