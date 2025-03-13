import { ProductApi, Configuration } from "@/api/generated";
import { REAL_API_BASE_URL } from "@/utils/api-config";
import axios from "axios";

// Hàm lấy token an toàn từ localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token");
      console.log(
        "ProductService - Token đọc từ localStorage:",
        token ? "Có token" : "Không có token"
      );
      return token || "";
    } catch (error) {
      console.error(
        "ProductService - Lỗi khi đọc token từ localStorage:",
        error
      );
      return "";
    }
  }
  return "";
};

// Tạo instance mới của API client
const getProductApiInstance = () => {
  // Tạo cấu hình với Authorization header
  const config = new Configuration({
    basePath: REAL_API_BASE_URL,
    baseOptions: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  });

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
        `ProductService.getProducts - Gọi API với page=${page}, size=${params.size}`
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

      // Nếu không có hình ảnh chính, tạo một file trống
      if (!mainImageFile) {
        console.warn(
          "ProductService.createProduct - Không có hình ảnh chính, tạo file trống"
        );
        mainImageFile = new File([""], "empty.jpg", { type: "image/jpeg" });
      }

      console.log(
        "ProductService.createProduct - MainImage:",
        mainImageFile
          ? `${mainImageFile.name} (${mainImageFile.size} bytes)`
          : "Không"
      );
      console.log(
        "ProductService.createProduct - SecondaryImages:",
        secondaryImageFiles.length
      );

      // Sử dụng axios trực tiếp thay vì API client từ Swagger
      const token = getToken();
      console.log("Token được sử dụng:", token ? "Có token" : "Không có token");

      if (!token) {
        throw new Error("Không tìm thấy token, vui lòng đăng nhập lại");
      }

      // Chuẩn bị FormData
      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Description", data.description);
      formData.append("Price", data.price.toString());
      formData.append("Quantity", data.quantity.toString());
      formData.append("Volume", data.volume.toString());
      formData.append("IsHidden", data.isHidden.toString());

      // Đảm bảo MainImage luôn được gửi đi
      if (mainImageFile) {
        formData.append("MainImage", mainImageFile);
      }

      // Thêm categoryIds - đúng định dạng mảng cho API
      if (categoryIds && categoryIds.length > 0) {
        categoryIds.forEach((id, index) => {
          if (id && id.trim() !== "") {
            formData.append(`CategoryIds[${index}]`, id);
          }
        });
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

      // Gọi API trực tiếp bằng axios với timeout dài hơn và retry
      const maxRetries = 2;
      let retryCount = 0;
      let lastError;

      while (retryCount <= maxRetries) {
        try {
          const response = await axios.post(
            `${REAL_API_BASE_URL}/api/v1/products`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
              timeout: 30000, // 30 giây
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
          retryCount++;

          if (retryCount <= maxRetries) {
            console.log(`Đang thử lại lần ${retryCount}...`);
            await new Promise((r) => setTimeout(r, 1000)); // Chờ 1 giây trước khi thử lại
          }
        }
      }

      // Nếu đã thử hết số lần và vẫn thất bại, thử dùng fetch API
      console.error("ProductService.createProduct - Lỗi chi tiết:", lastError);
      console.log("ProductService.createProduct - Đang thử lại với fetch API");

      try {
        const fetchResponse = await fetch(
          `${REAL_API_BASE_URL}/api/v1/products`,
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! Status: ${fetchResponse.status}`);
        }

        const responseData = await fetchResponse.json();
        return responseData;
      } catch (fetchError) {
        console.error(
          "ProductService.createProduct - Lỗi khi thử lại với fetch:",
          fetchError
        );
        throw lastError || fetchError;
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

      const response = await axios.delete(
        `${REAL_API_BASE_URL}/api/v1/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000, // 30 giây
        }
      );

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

// Hàm để nén hình ảnh - được tối ưu để giảm thời gian xử lý
const compressImage = async (blob: Blob, quality = 0.7): Promise<Blob> => {
  return new Promise<Blob>((resolve) => {
    try {
      // Kiểm tra kích thước, nếu < 1MB thì không cần nén
      if (blob.size < 1024 * 1024) {
        return resolve(blob);
      }

      const image = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.warn("Không thể lấy context 2d, trả về hình ảnh gốc");
        return resolve(blob);
      }

      const objectUrl = URL.createObjectURL(blob);

      image.onload = () => {
        // Giải phóng URL
        URL.revokeObjectURL(objectUrl);

        // Tính toán kích thước mới (giữ nguyên tỷ lệ)
        const maxDimension = 1000; // Giảm kích thước xuống 1000px
        let width = image.width;
        let height = image.height;

        if (width > height && width > maxDimension) {
          height = Math.floor((height / width) * maxDimension);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.floor((width / height) * maxDimension);
          height = maxDimension;
        }

        // Thiết lập canvas
        canvas.width = width;
        canvas.height = height;

        // Vẽ hình ảnh lên canvas
        ctx.drawImage(image, 0, 0, width, height);

        // Chuyển đổi thành blob với chất lượng thấp hơn
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              console.warn("Nén thất bại, trả về hình ảnh gốc");
              resolve(blob);
            }
          },
          "image/jpeg",
          quality
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        console.warn("Lỗi khi tải hình ảnh, trả về hình ảnh gốc");
        resolve(blob);
      };

      // Bắt đầu quá trình nạp ảnh
      image.src = objectUrl;
    } catch (error) {
      console.warn("Lỗi khi nén hình ảnh:", error);
      resolve(blob); // Trả về hình ảnh gốc thay vì gây lỗi
    }
  });
};
