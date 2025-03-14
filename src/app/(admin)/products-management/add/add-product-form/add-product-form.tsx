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
import { useAuthContext } from "@/contexts/auth-provider";

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
  const { userData } = useAuthContext();
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsFetchingCategories] = useState(true);
  const [apiUrl, setApiUrl] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Giá trị mặc định - đặt ở đầu component
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

  // Lấy và lưu API URL để debug
  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_API_URL || "https://production.doca.love";
    setApiUrl(url);
    console.log("API URL hiện tại:", url);

    // Kiểm tra kết nối đến API
    const checkApiConnection = async () => {
      try {
        // Thay vì kiểm tra kết nối trực tiếp đến API, sẽ thử lấy danh mục
        console.log(
          "Bỏ qua việc kiểm tra kết nối đến API trực tiếp để tránh lỗi CORS"
        );

        // Kết nối sẽ được kiểm tra gián tiếp khi lấy danh mục
        toast.info("Đang kết nối đến máy chủ...", {
          toastId: "api-connecting",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Lỗi khi kiểm tra kết nối API:", error);
        // Thông báo lỗi
        toast.error(
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.",
          {
            toastId: "api-connection-error",
            autoClose: false,
          }
        );
      }
    };

    checkApiConnection();
  }, []);

  // Lấy danh sách danh mục
  useEffect(() => {
    let isMounted = true; // Biến kiểm tra component có còn mounted không

    const fetchCategories = async () => {
      // Sử dụng biến để tránh setState khi component đã unmounted
      if (!isMounted) return;

      setIsFetchingCategories(true);
      try {
        console.log("Đang lấy danh sách danh mục...");

        // Thử lấy danh mục với 2 phương pháp khác nhau
        let categoryResponse = null;

        // Phương pháp 1: Dùng service
        try {
          categoryResponse = await CategoryService.getCategories({
            page: 1,
            size: 30,
          });

          console.log("Kết nối API thành công qua CategoryService");
          toast.dismiss("api-connection-warning");
          toast.dismiss("api-connection-error");
        } catch (serviceError) {
          console.error("Không thể lấy danh mục qua service:", serviceError);

          // Phương pháp 2: Thử dùng fetch với proxy
          try {
            const token = localStorage.getItem("token");
            const proxyResponse = await fetch(
              "/api/proxy/categories?page=1&size=30",
              {
                headers: {
                  Authorization: token ? `Bearer ${token}` : "",
                },
              }
            );

            if (proxyResponse.ok) {
              categoryResponse = { data: await proxyResponse.json() };
              console.log("Kết nối API thành công qua proxy API");
              toast.dismiss("api-connection-warning");
              toast.dismiss("api-connection-error");
            }
          } catch (proxyError) {
            console.error("Không thể lấy danh mục qua proxy:", proxyError);
          }
        }

        if (categoryResponse && categoryResponse.data && isMounted) {
          const data = categoryResponse.data as CategoryResponseIPaginate;
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
    console.log("=== BẮT ĐẦU QUÁ TRÌNH XỬ LÝ FORM SUBMISSION ===");
    console.log("Form submitted with data:", data);
    console.log("Kiểu dữ liệu categoryIds:", typeof data.categoryIds);
    console.log("Giá trị categoryIds:", data.categoryIds);

    try {
      // Log giá trị đầu vào
      console.log("isLoading trước khi set:", isLoading);
      console.log("categoryIds bên ngoài form:", selectedCategory);

      // Kiểm tra quyền admin trước khi thêm sản phẩm
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("LỖI: Không có token xác thực");
        toast.error("Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn", {
          toastId: "no-token-error",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Kiểm tra quyền admin từ userData (đã lấy từ context ở đầu component)
      if (userData?.username !== "admin") {
        console.error("LỖI: Người dùng không có quyền admin");
        toast.error(
          "Bạn không có quyền thêm sản phẩm. Chỉ admin mới có quyền này.",
          {
            toastId: "no-admin-error",
          }
        );
        return;
      }

      // Kiểm tra giá trị categoryIds có hợp lệ không
      if (
        !data.categoryIds ||
        (Array.isArray(data.categoryIds) && data.categoryIds.length === 0)
      ) {
        console.error("LỖI: Không có danh mục được chọn");
        toast.error("Vui lòng chọn một danh mục", {
          toastId: "category-required-error",
        });
        return; // Dừng việc submit nếu không có danh mục
      }

      setIsLoading(true);

      // Tiếp tục với phần còn lại của hàm onSubmit
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

      // Kiểm tra danh mục
      if (!data.categoryIds) {
        validationErrors.push("Vui lòng chọn một danh mục");
        console.error("Không có danh mục được chọn");
      } else {
        console.log("Kiểu dữ liệu categoryIds:", typeof data.categoryIds);
        console.log("Giá trị categoryIds:", data.categoryIds);
      }

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

      // Chuẩn bị dữ liệu categoryIds để gửi đến API
      let categoryIdArray: string[] = [];
      if (typeof data.categoryIds === "string") {
        // Nếu là chuỗi và không rỗng, thêm vào mảng
        if (data.categoryIds) {
          categoryIdArray = [data.categoryIds];
          console.log(
            "categoryIds là chuỗi, đã chuyển thành mảng:",
            categoryIdArray
          );
        } else {
          console.error("LỖI: categoryIds là chuỗi rỗng");
          toast.error("Vui lòng chọn một danh mục");
          setIsLoading(false);
          return;
        }
      } else if (Array.isArray(data.categoryIds)) {
        // Nếu đã là mảng, sử dụng trực tiếp
        if (data.categoryIds.length > 0) {
          categoryIdArray = data.categoryIds;
          console.log("categoryIds đã là mảng:", categoryIdArray);
        } else {
          console.error("LỖI: categoryIds là mảng rỗng");
          toast.error("Vui lòng chọn một danh mục");
          setIsLoading(false);
          return;
        }
      } else {
        console.error("LỖI: categoryIds không hợp lệ", data.categoryIds);
        toast.error("Dữ liệu danh mục không hợp lệ");
        setIsLoading(false);
        return;
      }

      console.log("Mảng danh mục để gửi API:", categoryIdArray);

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
        console.log("Token tồn tại, tiến hành gọi API");
        console.log("Đang sử dụng token admin để tạo sản phẩm mới");
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
        console.error("LỖI KHI GỌI API TẠO SẢN PHẨM:", apiError);

        // Kiểm tra lỗi quyền
        if (
          axios.isAxiosError(apiError) &&
          (apiError.response?.status === 401 ||
            apiError.response?.status === 403)
        ) {
          toast.error(
            "Bạn không có quyền thêm sản phẩm. Chỉ admin mới có quyền này.",
            {
              toastId: "permission-error",
            }
          );
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          handleApiError(apiError);
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-pink-700 mb-6">
        Thêm sản phẩm mới
      </h1>

      <AdminForm<AddProductFormData>
        schema={productSchema}
        defaultValues={defaultValues}
        onSubmit={(data) => {
          console.log("=== FORM SUBMIT ĐƯỢC KÍCH HOẠT QUA ADMINFORM ===");
          console.log("Nút submit của AdminForm được nhấn");

          // Log dữ liệu form để kiểm tra
          console.log("Form data từ AdminForm:", JSON.stringify(data, null, 2));
          console.log("Selected category state:", selectedCategory);

          // Kiểm tra giá trị categoryIds
          if (!data.categoryIds && selectedCategory) {
            console.log(
              "Gán categoryIds từ selectedCategory:",
              selectedCategory
            );
            data.categoryIds = selectedCategory;
          }

          // Kiểm tra lỗi
          const errors: string[] = [];
          if (!data.name) errors.push("Tên sản phẩm là bắt buộc");
          if (!data.description) errors.push("Mô tả sản phẩm là bắt buộc");
          if (!data.categoryIds) errors.push("Danh mục sản phẩm là bắt buộc");
          if (data.price <= 0) errors.push("Giá sản phẩm phải lớn hơn 0");

          // Hiển thị lỗi nếu có
          if (errors.length > 0) {
            errors.forEach((error) => toast.error(error));
            return;
          }

          // Đánh dấu xử lý và gọi hàm submit
          try {
            console.log("Gọi hàm onSubmit từ AdminForm handler");
            onSubmit(data);
          } catch (error) {
            console.error("Lỗi khi gọi hàm onSubmit:", error);
            toast.error("Đã xảy ra lỗi khi xử lý form");
          }
        }}
        isSubmitting={isLoading}
        submitButtonText="Lưu sản phẩm"
        backLink="/products-management"
        backButtonText="Hủy"
      >
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
          onChange={(value) => {
            console.log(
              "Sự kiện onChange của Select được gọi với value:",
              value
            );
            console.log("Kiểu dữ liệu của value:", typeof value);

            // Hiển thị thông tin về danh mục đã chọn
            if (value) {
              setSelectedCategory(typeof value === "string" ? value : null);
              const selectedCat = categories.find((cat) => cat.value === value);
              if (selectedCat) {
                console.log(
                  "Đã tìm thấy danh mục trong danh sách:",
                  selectedCat
                );
                toast.info(`Đã chọn danh mục: ${selectedCat.label}`, {
                  autoClose: 1500,
                  toastId: "category-selected",
                });
              } else {
                console.warn("Không tìm thấy danh mục với value:", value);
              }
            } else {
              console.log("Giá trị được chọn là null hoặc undefined");
              setSelectedCategory(null);
            }
          }}
          className="w-full border-pink-500 focus:ring-2 focus:ring-pink-500"
          labelClassName="text-pink-700 font-medium"
        />

        {/* Hiển thị danh mục đã chọn */}
        {selectedCategory && (
          <div className="mb-4 p-2 border border-pink-200 bg-pink-50 rounded-md">
            <p className="text-sm font-medium text-pink-700">
              Danh mục đã chọn:
            </p>
            <div className="mt-1">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                {categories.find((cat) => cat.value === selectedCategory)
                  ?.label || "Danh mục không xác định"}
              </div>
            </div>
          </div>
        )}

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

        <ImageUpload name="productImages" label="Hình ảnh sản phẩm" multiple />

        <Checkbox name="isHidden" label="Ẩn sản phẩm" />
      </AdminForm>
    </div>
  );
}
