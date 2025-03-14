"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/components/common/form/admin-form";
import Input from "@/components/common/input/input";
import { productSchema } from "@/utils/validation";
import { ProductService } from "@/service/product-service";
import { CategoryService } from "@/service/category-service";
import { toast } from "react-toastify";
import Select from "@/components/common/select/select";
import Textarea from "@/components/common/textarea/textarea";
import ImageUpload from "@/components/common/image-upload/image-upload";
import Checkbox from "@/components/common/checkbox/checkbox";
import axios, { AxiosError } from "axios";

// Định nghĩa kiểu dữ liệu cho API response
interface CategoryResponse {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

interface CategoryResponseIPaginate {
  items: CategoryResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

// Thêm interface cho dữ liệu phản hồi từ API
interface ApiErrorResponse {
  message?: string;
  status?: number;
  [key: string]: unknown;
}

// Định nghĩa kiểu dữ liệu cho form
type AddProductFormData = {
  name: string;
  categoryIds: string | string[]; // Sửa kiểu dữ liệu để hỗ trợ cả chuỗi và mảng
  description: string;
  price: number;
  quantity: number;
  volume: number;
  isHidden: boolean;
  productImages: {
    imageUrl: string;
    isMain: boolean;
  }[];
};

export default function AddProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);
  const [apiUrl, setApiUrl] = useState<string>("");

  // Lấy và lưu API URL để debug
  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_API_URL || "https://production.doca.love";
    setApiUrl(url);
    console.log("API URL hiện tại:", url);

    // Kiểm tra kết nối đến API
    const checkApiConnection = async () => {
      try {
        // Sử dụng fetch với timeout để kiểm tra kết nối
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${url}/api/health`, {
          method: "GET",
          signal: controller.signal,
        }).catch((error) => {
          console.error("Không thể kết nối đến API health check:", error);
          return null;
        });

        clearTimeout(timeoutId);

        if (response && response.ok) {
          console.log("Kết nối đến API thành công");
        } else {
          console.warn("Kết nối đến API có vấn đề - Status:", response?.status);
          // Thông báo cho người dùng
          toast.warning(
            "Kết nối đến máy chủ không ổn định, một số chức năng có thể bị ảnh hưởng",
            {
              toastId: "api-connection-warning",
              autoClose: 5000,
            }
          );
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra kết nối API:", error);
      }
    };

    checkApiConnection();
  }, []);

  // Giá trị mặc định
  const defaultValues: AddProductFormData = {
    name: "",
    categoryIds: "",
    description: "",
    price: 0,
    quantity: 0,
    volume: 0,
    isHidden: false,
    productImages: [],
  };

  // Lấy danh sách danh mục
  useEffect(() => {
    let isMounted = true; // Biến kiểm tra component có còn mounted không

    const fetchCategories = async () => {
      // Sử dụng biến để tránh setState khi component đã unmounted
      if (!isMounted) return;

      setIsFetchingCategories(true);
      try {
        console.log("Đang lấy danh sách danh mục...");
        const response = await CategoryService.getCategories({
          page: 1,
          size: 30,
        });

        if (response && response.data && isMounted) {
          const data = response.data as CategoryResponseIPaginate;
          console.log("Dữ liệu danh mục nhận được:", data);

          if (data.items && Array.isArray(data.items)) {
            if (data.items.length === 0) {
              if (isMounted) {
                toast.warning("Không có danh mục nào trong hệ thống", {
                  toastId: "no-categories-warning",
                });
                setCategories([]);
              }
            } else {
              const categoryOptions = data.items.map(
                (category: CategoryResponse) => ({
                  value: category.id,
                  label: category.name,
                })
              );

              if (isMounted) {
                console.log("Danh sách danh mục đã tải:", categoryOptions);
                setCategories(categoryOptions);
              }
            }
          } else if (isMounted) {
            toast.error("Dữ liệu danh mục không đúng định dạng", {
              toastId: "category-format-error",
            });
            setCategories([]);
          }
        } else if (isMounted) {
          toast.error("Không thể tải danh mục từ server", {
            toastId: "category-load-error",
          });
          setCategories([]);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Lỗi khi lấy danh sách danh mục:", error);
          toast.error("Lỗi khi tải danh mục, vui lòng thử lại sau", {
            toastId: "fetch-categories-error",
          });
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsFetchingCategories(false);
        }
      }
    };

    fetchCategories();

    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý khi submit form
  const onSubmit = async (data: AddProductFormData) => {
    setIsLoading(true);
    try {
      // Kiểm tra kết nối mạng
      if (!navigator.onLine) {
        toast.error(
          "Bạn đang offline. Vui lòng kiểm tra kết nối mạng và thử lại",
          {
            toastId: "offline-error",
          }
        );
        setIsLoading(false);
        return;
      }

      console.log("Dữ liệu form trước khi gửi:", JSON.stringify(data, null, 2));
      console.log("API URL khi submit:", apiUrl);

      // Kiểm tra kỹ dữ liệu form
      const validationErrors = [];

      // Kiểm tra tên sản phẩm
      if (!data.name || data.name.trim() === "") {
        validationErrors.push("Tên sản phẩm không được để trống");
      }

      // Kiểm tra mô tả
      if (!data.description || data.description.trim() === "") {
        validationErrors.push("Mô tả sản phẩm không được để trống");
      }

      // Kiểm tra giá
      if (data.price <= 0) {
        validationErrors.push("Giá sản phẩm phải lớn hơn 0");
      }

      // Kiểm tra số lượng
      if (data.quantity < 0) {
        validationErrors.push("Số lượng không được âm");
      }

      // Kiểm tra khối lượng
      if (data.volume <= 0) {
        validationErrors.push("Khối lượng phải lớn hơn 0");
      }

      // Kiểm tra danh mục - hỗ trợ cả chuỗi và mảng
      const hasValidCategory =
        (typeof data.categoryIds === "string" && data.categoryIds) ||
        (Array.isArray(data.categoryIds) && data.categoryIds.length > 0);

      if (!hasValidCategory) {
        validationErrors.push("Vui lòng chọn một danh mục");
      }

      // Chuẩn bị dữ liệu categoryIds để gửi đến API
      let categoryIdArray: string[] = [];

      if (typeof data.categoryIds === "string") {
        // Nếu là chuỗi và không rỗng, thêm vào mảng
        if (data.categoryIds) {
          categoryIdArray = [data.categoryIds];
        }
      } else if (Array.isArray(data.categoryIds)) {
        // Nếu đã là mảng, sử dụng trực tiếp
        categoryIdArray = data.categoryIds;
      }

      console.log("Danh mục đã chọn:", data.categoryIds);
      console.log("Mảng danh mục để gửi API:", categoryIdArray);

      // Nếu có lỗi, hiển thị và dừng
      if (validationErrors.length > 0) {
        validationErrors.forEach((error, index) => {
          toast.error(error, {
            toastId: `validation-error-${index}`,
          });
        });
        setIsLoading(false);
        return;
      }

      // Hiển thị chi tiết về danh mục đã chọn
      if (data.categoryIds) {
        const selectedCategory = categories.find(
          (cat) => cat.value === data.categoryIds
        );
        console.log("Danh mục đã chọn:", selectedCategory);
      }

      // Kiểm tra và log thông tin hình ảnh
      console.log(
        "Hình ảnh sản phẩm:",
        data.productImages ? data.productImages.length : 0
      );

      // Hiển thị chi tiết về hình ảnh đã chọn
      if (data.productImages && data.productImages.length > 0) {
        console.log("Chi tiết hình ảnh đã chọn:");
        data.productImages.forEach((img, index) => {
          console.log(
            `Ảnh ${index + 1}: isMain=${
              img.isMain
            }, URL: ${img.imageUrl.substring(0, 30)}...`
          );
        });
      }

      // Đảm bảo có ít nhất một hình ảnh
      if (!data.productImages || data.productImages.length === 0) {
        toast.warning("Bạn nên thêm ít nhất một hình ảnh cho sản phẩm", {
          toastId: "no-images-warning",
        });
      }

      // Kiểm tra xem có hình ảnh chính không
      const hasMainImage = data.productImages?.some((img) => img.isMain);
      if (
        !hasMainImage &&
        data.productImages &&
        data.productImages.length > 0
      ) {
        // Nếu có hình ảnh nhưng không có hình chính, tự động đặt hình đầu tiên làm hình chính
        data.productImages[0].isMain = true;
        console.log("Đã tự động đặt hình đầu tiên làm hình chính");
      }

      // Chuẩn bị dữ liệu cuối cùng để gửi
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        quantity: data.quantity,
        volume: data.volume,
        isHidden: data.isHidden,
        productImages: data.productImages || [], // Đảm bảo luôn là mảng
        categoryIds: categoryIdArray, // Mảng với một phần tử
      };

      console.log("Dữ liệu sản phẩm cuối cùng trước khi gửi API:", productData);

      // Hiển thị thông báo đang xử lý
      toast.info("Đang xử lý thêm sản phẩm...", {
        autoClose: 1000,
        toastId: "processing-add-product",
      });

      try {
        // Gọi API tạo sản phẩm với dữ liệu đã chuẩn bị
        const result = await ProductService.createProduct(productData);
        console.log("Kết quả từ API tạo sản phẩm:", result);

        // Hiển thị thông báo thành công
        toast.success("Thêm sản phẩm thành công", {
          toastId: "add-product-success",
        });

        // Chuyển hướng đến trang quản lý sản phẩm sau 1 giây
        setTimeout(() => {
          router.push("/products-management");
        }, 1000);
      } catch (apiError) {
        handleApiError(apiError);

        // Thêm thông báo gợi ý
        if (axios.isAxiosError(apiError)) {
          const axiosError = apiError as AxiosError;

          if (axiosError.response?.status === 500) {
            toast.info(
              "Gợi ý: Nếu vấn đề vẫn tiếp tục, hãy thử giảm kích thước hình ảnh hoặc bỏ qua hình ảnh để tạo sản phẩm trước",
              {
                toastId: "server-error-suggestion",
                autoClose: 8000,
              }
            );
          }
        }
      }
    } catch (error: unknown) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý lỗi từ API
  const handleApiError = (error: unknown) => {
    // Hiển thị thông báo lỗi chi tiết hơn
    let errorMessage = "Không thể thêm sản phẩm";
    let errorDetails = "";

    // Thử lấy thông báo lỗi từ response
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error("Chi tiết lỗi từ API:", axiosError.response?.data);
      errorDetails = JSON.stringify(axiosError.response?.data, null, 2);

      if (axiosError.response?.status === 400) {
        errorMessage =
          "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin sản phẩm";
      } else if (
        axiosError.response?.status === 401 ||
        axiosError.response?.status === 403
      ) {
        errorMessage =
          "Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại";

        // Kiểm tra token và đề xuất đăng nhập lại nếu cần
        const token = localStorage.getItem("token");
        if (!token) {
          errorMessage += ". Token không tồn tại.";
          // Thêm logic chuyển hướng đến trang đăng nhập nếu cần
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } else if (axiosError.response?.status === 500) {
        errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau";
        // Kiểm tra network và ghi log chi tiết
        if (navigator.onLine) {
          console.error("Server error với network hoạt động:", errorDetails);
        } else {
          console.error("Server error nhưng người dùng có thể offline");
        }
      } else if (axiosError.code === "ECONNABORTED") {
        errorMessage = "Thời gian kết nối quá lâu. Vui lòng thử lại sau";
      } else if (axiosError.code === "ERR_NETWORK") {
        errorMessage =
          "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối mạng của bạn";

        // Kiểm tra network
        if (!navigator.onLine) {
          errorMessage = "Bạn đang offline. Vui lòng kết nối mạng và thử lại.";
        }
      }

      // Nếu có thông báo lỗi từ API, ưu tiên sử dụng
      if (
        axiosError.response?.data &&
        typeof axiosError.response.data === "object"
      ) {
        const responseData = axiosError.response.data as ApiErrorResponse;
        if (responseData.message) {
          errorMessage = responseData.message;
        }

        // Kiểm tra lỗi cụ thể và đưa ra gợi ý
        if (
          errorMessage.includes("token") ||
          errorMessage.includes("Token") ||
          errorMessage.includes("xác thực") ||
          errorMessage.includes("unauthorized")
        ) {
          toast.info("Bạn có thể cần đăng nhập lại để tiếp tục", {
            toastId: "auth-suggestion",
          });
        }
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Hiển thị thông báo lỗi
    toast.error(errorMessage, {
      toastId: "api-error",
    });

    // Ghi log chi tiết lỗi
    console.error("Chi tiết lỗi khi thêm sản phẩm:", {
      message: errorMessage,
      error: error,
      details: errorDetails || "Không có chi tiết",
    });
  };

  // Xử lý tạo danh mục mới
  // const handleCreateCategory = async (
  //   name: string,
  //   description: string = ""
  // ) => {
  //   // Kiểm tra token admin
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("Không có token admin");
  //     return null;
  //   }

  //   try {
  //     console.log("Đang tạo danh mục mới:", { name, description });

  //     if (!CategoryService || !CategoryService.createCategory) {
  //       console.error(
  //         "CategoryService hoặc CategoryService.createCategory không tồn tại"
  //       );
  //       return null;
  //     }

  //     const response = await CategoryService.createCategory({
  //       name,
  //       description,
  //     });

  //     console.log("Kết quả tạo danh mục:", response);

  //     if (response && response.data) {
  //       const newCategory = response.data as CategoryResponse;
  //       console.log("Danh mục mới đã được tạo:", newCategory);

  //       // Thêm danh mục mới vào danh sách
  //       const newCategoryOption = {
  //         value: newCategory.id,
  //         label: newCategory.name,
  //       };

  //       setCategories((prev) => [...prev, newCategoryOption]);
  //       toast.success(`Đã thêm danh mục "${newCategory.name}" thành công`);

  //       return newCategoryOption;
  //     } else {
  //       console.error("Không nhận được dữ liệu từ API tạo danh mục");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Chi tiết lỗi khi thêm danh mục:", error);
  //     return null;
  //   }
  // };

  return (
    <div>
      <AdminForm<AddProductFormData>
        title="Thêm sản phẩm mới"
        schema={productSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        backLink="/products-management"
        submitButtonText="Lưu sản phẩm"
        maxHeight="max-h-[calc(100vh-200px)]"
        formClassName="h-[calc(100vh-150px)]"
        contentClassName="pb-4 custom-scrollbar"
        isSubmitting={isLoading}
      >
        {isFetchingCategories ? (
          <div className="flex items-center justify-center h-full">
            <p>Đang tải danh mục...</p>
          </div>
        ) : (
          <>
            <Input
              name="name"
              label="Tên sản phẩm"
              placeholder="Nhập tên sản phẩm"
            />

            <Select
              name="categoryIds"
              label="Danh mục"
              placeholder="Chọn một danh mục"
              options={categories}
              isSearchable
            />

            <Textarea
              name="description"
              label="Mô tả"
              placeholder="Nhập mô tả sản phẩm"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="price"
                label="Giá (VNĐ)"
                type="number"
                placeholder="Nhập giá sản phẩm"
              />

              <Input
                name="quantity"
                label="Số lượng"
                type="number"
                placeholder="Nhập số lượng"
              />

              <Input
                name="volume"
                label="Khối lượng"
                type="number"
                placeholder="Nhập khối lượng"
              />
            </div>

            <ImageUpload
              name="productImages"
              label="Hình ảnh sản phẩm"
              multiple
            />

            <Checkbox name="isHidden" label="Ẩn sản phẩm" />
          </>
        )}
      </AdminForm>
    </div>
  );
}
