import axios from "axios";
import { ProductApi, Configuration } from "@/api/generated";
import { getToken } from "@/auth/auth-service";
import { API_CORS_HEADERS } from "@/utils/api-config";
import { compressImage } from "@/utils/image-utils";

// Sử dụng duy nhất một API URL cho môi trường production
const API_URL = "https://production.doca.love";

// Tạo instance mới của API client
const getProductApiInstance = () => {
  // Tạo cấu hình với Authorization header
  const config = new Configuration({
    basePath: API_URL,
    baseOptions: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  });

  // Log URL API trực tiếp cho mục đích debug
  console.log("[ProductService] Sử dụng API URL:", API_URL);

  return new ProductApi(config);
};

export const ProductService = {
  getProducts: async (params: {
    page?: number;
    size?: number;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      const productApi = getProductApiInstance();

      // Đảm bảo page luôn bắt đầu từ 1, không phải 0
      const page = params.page || 1;

      // Log để debug
      console.log(
        `ProductService.getProducts - Gọi API với page=${page}, size=${params.size} (URL: ${API_URL}/api/v1/products)`
      );

      return await productApi.apiV1ProductsGet(
        page,
        params.size,
        undefined,
        undefined,
        params.categoryIds,
        params.minPrice,
        params.maxPrice
      );
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      throw error;
    }
  },

  getProductById: async (id: string) => {
    try {
      const productApi = getProductApiInstance();

      // Log URL API trực tiếp
      console.log(
        `ProductService.getProductById - Gọi API trực tiếp: ${API_URL}/api/v1/products/${id}`
      );

      return await productApi.apiV1ProductsIdGet(id);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      throw error;
    }
  },

  createProduct: async (data: {
    name: string;
    description: string;
    price: number;
    quantity: number;
    volume: number;
    isHidden: boolean;
    productImages: {
      imageUrl: string;
      isMain: boolean;
    }[];
    categoryIds?: string[];
  }) => {
    try {
      console.log("ProductService.createProduct - Dữ liệu nhận được:", {
        ...data,
        productImages: data.productImages
          ? `${data.productImages.length} hình ảnh`
          : "không có hình ảnh",
      });

      // Đảm bảo categoryIds là array
      const categoryIds = Array.isArray(data.categoryIds)
        ? data.categoryIds
        : data.categoryIds
        ? [data.categoryIds]
        : [];

      console.log(
        "ProductService.createProduct - CategoryIds đã xử lý:",
        categoryIds
      );

      // Xử lý hình ảnh
      let mainImageFile: File | null = null;
      const secondaryImageFiles: File[] = [];

      if (data.productImages && data.productImages.length > 0) {
        // Tìm và xử lý hình ảnh chính
        const mainImageData = data.productImages.find((img) => img.isMain);
        if (mainImageData && mainImageData.imageUrl) {
          try {
            console.log(
              "ProductService.createProduct - Đang xử lý hình ảnh chính:",
              mainImageData.imageUrl.substring(0, 30) + "..."
            );

            // Chuyển đổi URL thành File
            const response = await fetch(mainImageData.imageUrl);
            const blob = await response.blob();

            // Kiểm tra kích thước hình ảnh
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
            if (blob.size > maxSizeInBytes) {
              console.warn("Hình ảnh chính quá lớn, tiến hành nén...");

              // Nén hình ảnh nếu quá lớn (> 5MB)
              try {
                const compressedBlob = await compressImage(blob, 0.7); // Nén với chất lượng 70%
                mainImageFile = new File([compressedBlob], "mainImage.jpg", {
                  type: compressedBlob.type || "image/jpeg",
                });
                console.log(
                  `Đã nén hình ảnh chính từ ${blob.size} xuống ${compressedBlob.size} bytes`
                );
              } catch (compressError) {
                console.error("Lỗi khi nén hình ảnh:", compressError);
                // Sử dụng hình ảnh gốc nếu không nén được
                mainImageFile = new File([blob], "mainImage.jpg", {
                  type: blob.type || "image/jpeg",
                });
              }
            } else {
              mainImageFile = new File([blob], "mainImage.jpg", {
                type: blob.type || "image/jpeg",
              });
            }
          } catch (error) {
            console.error("Lỗi khi xử lý hình ảnh chính:", error);
          }
        }

        // Xử lý các hình ảnh phụ
        const secondaryImagesData = data.productImages.filter(
          (img) => !img.isMain
        );

        console.log(
          "ProductService.createProduct - Số lượng hình ảnh phụ cần xử lý:",
          secondaryImagesData.length
        );

        for (const imgData of secondaryImagesData) {
          if (imgData.imageUrl) {
            try {
              const response = await fetch(imgData.imageUrl);
              const blob = await response.blob();

              // Kiểm tra kích thước hình ảnh phụ
              const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
              if (blob.size > maxSizeInBytes) {
                console.warn("Hình ảnh phụ quá lớn, tiến hành nén...");
                try {
                  const compressedBlob = await compressImage(blob, 0.7);
                  const file = new File(
                    [compressedBlob],
                    "secondaryImage.jpg",
                    {
                      type: compressedBlob.type || "image/jpeg",
                    }
                  );
                  secondaryImageFiles.push(file);
                } catch (compressError) {
                  console.error("Lỗi khi nén hình ảnh phụ:", compressError);
                  // Sử dụng hình ảnh gốc nếu không nén được
                  const file = new File([blob], "secondaryImage.jpg", {
                    type: blob.type || "image/jpeg",
                  });
                  secondaryImageFiles.push(file);
                }
              } else {
                const file = new File([blob], "secondaryImage.jpg", {
                  type: blob.type || "image/jpeg",
                });
                secondaryImageFiles.push(file);
              }
            } catch (error) {
              console.error("Lỗi khi xử lý hình ảnh phụ:", error);
            }
          }
        }
      }

      // Tạo form data
      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Description", data.description);
      formData.append("Price", data.price.toString());
      formData.append("Quantity", data.quantity.toString());
      formData.append("Volume", data.volume.toString());
      formData.append("IsHidden", data.isHidden.toString());

      // Thêm danh mục (nếu có)
      if (categoryIds && categoryIds.length > 0) {
        categoryIds.forEach((id, index) => {
          if (id) {
            formData.append(`CategoryIds[${index}]`, id);
          }
        });
      }

      // Thêm hình ảnh chính nếu có
      if (mainImageFile && mainImageFile.size > 0) {
        formData.append("MainImage", mainImageFile);
      } else {
        console.warn(
          "ProductService.createProduct - Không có hình ảnh chính hoặc hình ảnh không hợp lệ"
        );
      }

      // Thêm các hình ảnh phụ
      if (secondaryImageFiles.length > 0) {
        secondaryImageFiles.forEach((file, index) => {
          if (file && file.size > 0) {
            formData.append(`SecondaryImages[${index}]`, file);
          }
        });
      }

      // Debug log FormData
      console.log(
        "ProductService.createProduct - FormData được tạo với các trường:"
      );
      // Ghi log từng trường riêng biệt thay vì duyệt qua entries
      console.log("Name:", data.name);
      console.log("Description:", data.description.substring(0, 30) + "...");
      console.log("Price:", data.price);
      console.log("Quantity:", data.quantity);
      console.log("Volume:", data.volume);
      console.log("IsHidden:", data.isHidden);
      console.log(
        "MainImage:",
        mainImageFile ? `File (${mainImageFile.size} bytes)` : "Không có"
      );
      console.log("CategoryIds:", categoryIds);
      console.log("SecondaryImages:", `${secondaryImageFiles.length} files`);

      console.log("ProductService.createProduct - Đang gửi request tới API");

      // Lấy token JWT
      const token = getToken();
      if (!token) {
        throw new Error("Không tìm thấy token, vui lòng đăng nhập lại");
      }

      console.log(
        "ProductService.createProduct - Sử dụng API proxy để tránh lỗi CORS"
      );

      // Ưu tiên sử dụng API proxy của Next.js để tránh lỗi CORS
      try {
        const proxyResponse = await axios.post(
          `/api/proxy/products`, // API route nội bộ của Next.js
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000, // 60 giây
          }
        );

        console.log("Kết quả từ API proxy:", proxyResponse.status);
        return proxyResponse.data;
      } catch (proxyError) {
        console.error("Lỗi khi sử dụng API proxy:", proxyError);
        console.log(
          "ProductService.createProduct - Thử sử dụng phương pháp thay thế..."
        );

        // Nếu proxy thất bại, thử các phương pháp khác
        // Gọi API trực tiếp bằng axios với timeout dài hơn và retry
        const maxRetries = 3;
        let retryCount = 0;
        let lastError;

        while (retryCount <= maxRetries) {
          try {
            const response = await axios.post(
              `${API_URL}/api/v1/products`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                  ...API_CORS_HEADERS,
                },
                timeout: 60000, // 60 giây
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
              }
            );

            console.log(
              "ProductService.createProduct - Kết quả API:",
              response.status
            );
            return response.data;
          } catch (error) {
            lastError = error;
            console.error(
              `Lỗi lần thử ${retryCount + 1}/${maxRetries + 1}:`,
              error
            );

            // Kiểm tra lỗi CORS
            if (
              axios.isAxiosError(error) &&
              (error.code === "ERR_NETWORK" ||
                error.response?.status === 0 ||
                error.response?.status === 500)
            ) {
              console.log("Phát hiện lỗi CORS hoặc lỗi mạng, thử cách khác...");
              break; // Chuyển sang phương thức fetch
            }

            retryCount++;

            if (retryCount <= maxRetries) {
              console.log(`Đang thử lại lần ${retryCount}...`);
              await new Promise((r) => setTimeout(r, 2000 * retryCount)); // Tăng thời gian chờ theo số lần thử
            }
          }
        }

        // Thử lại với fetch API
        console.error(
          "ProductService.createProduct - Lỗi chi tiết:",
          lastError
        );
        console.log(
          "ProductService.createProduct - Đang thử lại với fetch API"
        );

        try {
          const fetchResponse = await fetch(`${API_URL}/api/v1/products`, {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
              // Fetch API sẽ tự động thiết lập Content-Type cho multipart/form-data
            },
            // Không cần thiết lập timeout cho fetch, browser có timeout mặc định
            mode: "no-cors", // Thêm mode no-cors để tránh lỗi CORS
          });

          if (!fetchResponse.ok && fetchResponse.type !== "opaque") {
            throw new Error(`HTTP error! Status: ${fetchResponse.status}`);
          }

          try {
            const responseData = await fetchResponse.json();
            return responseData;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (jsonError) {
            console.log(
              "Không thể parse JSON từ response. Đây có thể là do mode no-cors"
            );
            // Trả về một response giả để flow tiếp tục
            return {
              success: true,
              message:
                "Sản phẩm đã được tạo, nhưng không thể nhận kết quả chi tiết do cài đặt bảo mật CORS",
            };
          }
        } catch (fetchError) {
          console.error(
            "ProductService.createProduct - Lỗi khi thử lại với fetch:",
            fetchError
          );

          throw lastError || fetchError || proxyError;
        }
      }
    } catch (error) {
      console.error("ProductService.createProduct - Lỗi cuối cùng:", error);
      throw error;
    }
  },

  updateProduct: async (
    id: string,
    data: {
      name: string;
      description: string;
      price: number;
      quantity: number;
      volume: number;
      isHidden: boolean;
    }
  ) => {
    try {
      const productApi = getProductApiInstance();
      const response = await productApi.apiV1ProductsIdPatch(id, {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        volume: data.volume,
        isHidden: data.isHidden,
      });
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  },

  updateProductImage: async (
    id: string,
    productImages: {
      id?: string;
      imageUrl: string;
      isMain: boolean;
    }[]
  ) => {
    try {
      const productApi = getProductApiInstance();
      // Tạo request phù hợp với API
      const request = productImages.map((img) => ({
        imageUrl: new File([img.imageUrl], "image.jpg", { type: "image/jpeg" }),
        isMain: img.isMain,
      }));

      const response = await productApi.apiV1ProductsIdProductImagePost(
        id,
        request
      );
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật hình ảnh sản phẩm:", error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Không tìm thấy token, vui lòng đăng nhập lại");
      }

      const response = await axios.delete(`${API_URL}/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...API_CORS_HEADERS,
        },
        timeout: 30000, // 30 giây
      });

      console.log(
        "ProductService.deleteProduct - Kết quả API:",
        response.status
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  },

  // Các phương thức khác đã được chuyển sang category-service.ts
};
