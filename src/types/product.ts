// Định nghĩa kiểu dữ liệu sản phẩm
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number; // Tương đương với quantity trong API
  images: string[]; // Lấy từ productImages trong API
  categories: {
    id: string;
    name: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Interface cho ProductImage từ API
interface ProductImage {
  id?: string | null;
  imageUrl?: string | null;
  isMain?: boolean | null;
}

// Interface cho API product
interface ApiProduct {
  id?: string | null;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  originalPrice?: number | null;
  quantity?: number | null;
  productImages?: ProductImage[] | null;
  categories?:
    | {
        id?: string | null;
        name?: string | null;
        description?: string | null;
      }[]
    | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Chuyển đổi từ API response sang Product interface
export const mapApiToProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct.id || "",
    name: apiProduct.name || "",
    description: apiProduct.description || "",
    price: apiProduct.price || 0,
    originalPrice: apiProduct.originalPrice || undefined,
    stock: apiProduct.quantity || 0, // Map từ quantity sang stock
    images:
      apiProduct.productImages
        ?.map((img) => img.imageUrl || "")
        .filter(Boolean) || [],
    categories:
      apiProduct.categories?.map((cat) => ({
        id: cat.id || "",
        name: cat.name || "",
        description: cat.description || "",
      })) || [],
    createdAt: apiProduct.createdAt || new Date().toISOString(),
    updatedAt: apiProduct.updatedAt || new Date().toISOString(),
  };
};
