import { GetProductDetailResponse } from "@/api/generated";

// Dữ liệu sản phẩm mẫu
export const mockProducts: GetProductDetailResponse[] = [
  {
    id: "1",
    name: "Thức ăn cho mèo - Whiskas 1.2kg",
    description:
      "Thức ăn hạt cho mèo Whiskas giúp mèo cưng của bạn phát triển khỏe mạnh. Sản phẩm giàu dinh dưỡng, protein chất lượng cao và các vitamin thiết yếu.",
    quantity: 50,
    price: 120000,
    createdAt: "2023-10-15T08:00:00Z",
    modifiedAt: "2023-10-15T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img1",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat1",
        name: "Đồ ăn cho mèo",
      },
    ],
  },
  {
    id: "2",
    name: "Thức ăn cho chó - Pedigree 1.5kg",
    description:
      "Thức ăn hạt dành cho chó Pedigree giúp cún cưng của bạn khỏe mạnh và năng động. Thành phần giàu dinh dưỡng, dễ tiêu hóa.",
    quantity: 45,
    price: 150000,
    createdAt: "2023-10-20T08:00:00Z",
    modifiedAt: "2023-10-20T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img2",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat2",
        name: "Đồ ăn cho chó",
      },
    ],
  },
  {
    id: "3",
    name: "Đồ chơi cho mèo - Cần câu chuột",
    description:
      "Đồ chơi cần câu chuột cho mèo giúp thú cưng vận động và giải trí. Chất liệu an toàn, bền bỉ.",
    quantity: 30,
    price: 75000,
    createdAt: "2023-11-05T08:00:00Z",
    modifiedAt: "2023-11-05T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img3",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat3",
        name: "Đồ chơi cho mèo",
      },
    ],
  },
  {
    id: "4",
    name: "Vòng cổ cho chó - Size M",
    description:
      "Vòng cổ chất lượng cao dành cho chó vừa và nhỏ. Chất liệu thoáng khí, không gây kích ứng da.",
    quantity: 25,
    price: 90000,
    createdAt: "2023-11-10T08:00:00Z",
    modifiedAt: "2023-11-10T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img4",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat4",
        name: "Phụ kiện cho chó",
      },
    ],
  },
  {
    id: "5",
    name: "Khay vệ sinh cho mèo",
    description:
      "Khay vệ sinh cho mèo với thiết kế hiện đại, dễ dàng vệ sinh và khử mùi hiệu quả.",
    quantity: 15,
    price: 180000,
    createdAt: "2023-11-15T08:00:00Z",
    modifiedAt: "2023-11-15T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img5",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat5",
        name: "Phụ kiện cho mèo",
      },
    ],
  },
  {
    id: "6",
    name: "Cát vệ sinh cho mèo - 5kg",
    description:
      "Cát vệ sinh chất lượng cao, khả năng hút ẩm mạnh và khử mùi hiệu quả, an toàn cho mèo cưng.",
    quantity: 40,
    price: 110000,
    createdAt: "2023-11-20T08:00:00Z",
    modifiedAt: "2023-11-20T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img6",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat5",
        name: "Phụ kiện cho mèo",
      },
    ],
  },
  {
    id: "7",
    name: "Bát ăn cho chó - Inox",
    description:
      "Bát ăn cho chó làm từ Inox cao cấp, không gỉ, dễ dàng vệ sinh, đảm bảo an toàn vệ sinh thực phẩm.",
    quantity: 35,
    price: 85000,
    createdAt: "2023-11-25T08:00:00Z",
    modifiedAt: "2023-11-25T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img7",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat4",
        name: "Phụ kiện cho chó",
      },
    ],
  },
  {
    id: "8",
    name: "Sữa tắm cho chó mèo - 500ml",
    description:
      "Sữa tắm cho chó mèo giúp làm sạch, khử mùi và bảo vệ da, lông của thú cưng. Hương thơm dễ chịu, dưỡng ẩm tốt.",
    quantity: 20,
    price: 135000,
    createdAt: "2023-12-01T08:00:00Z",
    modifiedAt: "2023-12-01T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img8",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat6",
        name: "Chăm sóc thú cưng",
      },
    ],
  },
  {
    id: "9",
    name: "Lược chải lông cho chó mèo",
    description:
      "Lược chải lông chất lượng cao, giúp loại bỏ lông rụng, bụi bẩn và ngăn ngừa rối lông cho thú cưng.",
    quantity: 25,
    price: 65000,
    createdAt: "2023-12-05T08:00:00Z",
    modifiedAt: "2023-12-05T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img9",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat6",
        name: "Chăm sóc thú cưng",
      },
    ],
  },
  {
    id: "10",
    name: "Thức ăn hạt cho chó con - Royal Canin 1kg",
    description:
      "Thức ăn hạt chuyên biệt cho chó con, giúp phát triển xương và cơ bắp khỏe mạnh. Cung cấp đầy đủ dưỡng chất cho giai đoạn phát triển.",
    quantity: 30,
    price: 250000,
    createdAt: "2023-12-10T08:00:00Z",
    modifiedAt: "2023-12-10T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img10",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat2",
        name: "Đồ ăn cho chó",
      },
    ],
  },
  {
    id: "11",
    name: "Pate cho mèo - Whiskas 85g",
    description:
      "Pate Whiskas cho mèo với thành phần dinh dưỡng cao, đảm bảo bữa ăn ngon miệng và đầy đủ dưỡng chất cho mèo cưng.",
    quantity: 100,
    price: 20000,
    createdAt: "2023-12-15T08:00:00Z",
    modifiedAt: "2023-12-15T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img11",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat1",
        name: "Đồ ăn cho mèo",
      },
    ],
  },
  {
    id: "12",
    name: "Nhà cây cho mèo - Size M",
    description:
      "Nhà cây cho mèo với nhiều tầng, góc nghỉ và khu vực leo trèo, giúp mèo vận động và thỏa mãn bản năng tự nhiên.",
    quantity: 10,
    price: 850000,
    createdAt: "2023-12-20T08:00:00Z",
    modifiedAt: "2023-12-20T08:00:00Z",
    isHidden: false,
    productImages: [
      {
        id: "img12",
        imageUrl: "/images/food-test.png",
      },
    ],
    categories: [
      {
        id: "cat5",
        name: "Phụ kiện cho mèo",
      },
    ],
  },
];

// Hàm phân trang sản phẩm
export const getPaginatedProducts = (
  page: number = 1,
  size: number = 9,
  filters?: {
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
  }
) => {
  let filteredProducts = [...mockProducts];

  // Áp dụng bộ lọc nếu có
  if (filters) {
    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.categories?.some((cat) =>
          filters.categoryIds?.includes(cat.name || "")
        )
      );
    }

    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => (product.price || 0) >= (filters.minPrice || 0)
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => (product.price || 0) <= (filters.maxPrice || Infinity)
      );
    }
  }

  // Tính toán phân trang
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / size);
  const currentPage = page > totalPages ? totalPages : page;
  const startIndex = (currentPage - 1) * size;
  const endIndex = Math.min(startIndex + size, totalItems);

  // Lấy sản phẩm cho trang hiện tại
  const items = filteredProducts.slice(startIndex, endIndex);

  return {
    data: {
      size,
      page: currentPage,
      total: totalItems,
      totalPages,
      items,
    },
  };
};

// Lấy sản phẩm theo ID
export const getProductById = (id: string) => {
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    throw new Error("Không tìm thấy sản phẩm");
  }

  return { data: product };
};

// Lấy sản phẩm đề xuất (không bao gồm sản phẩm hiện tại)
export const getRecommendedProducts = (
  currentProductId: string,
  limit: number = 4
) => {
  const otherProducts = mockProducts.filter((p) => p.id !== currentProductId);

  // Trộn ngẫu nhiên sản phẩm để có các đề xuất khác nhau
  const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());

  // Lấy số lượng sản phẩm theo limit
  const recommendedItems = shuffled.slice(0, limit);

  return {
    data: {
      items: recommendedItems,
      total: recommendedItems.length,
    },
  };
};
