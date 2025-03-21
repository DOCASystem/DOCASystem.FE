import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

/**
 * API Proxy cho việc lấy danh sách sản phẩm để tránh vấn đề CORS trong môi trường production
 *
 * @param request yêu cầu từ client
 */
export async function GET(request: NextRequest) {
  try {
    // Lấy tất cả các tham số query từ URL
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Log thông tin truy vấn
    console.log("API Proxy Products: Đang lấy danh sách sản phẩm");
    console.log(
      "API Proxy Products: Tham số tìm kiếm:",
      Object.fromEntries(searchParams)
    );

    // Tạo URL mới cho API thực tế
    const apiUrl = new URL(`${REAL_API_BASE_URL}/api/v1/products`);

    // Thêm tất cả các tham số query vào URL mới
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    // Lấy token từ header nếu có
    const token = request.headers.get("Authorization") || "";

    // Log URL API thực tế
    console.log("API Proxy Products: Gọi đến API:", apiUrl.toString());

    // Thêm timeout để tránh treo quá lâu
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout

    try {
      // Gọi API thực tế
      const response = await fetch(apiUrl.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        signal: controller.signal,
        cache: "no-store",
      });

      // Xóa timeout
      clearTimeout(timeoutId);

      // Log thông tin response
      console.log(`API Proxy Products: Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `API Proxy Products: Lỗi từ server: ${response.status}`,
          errorText
        );

        return NextResponse.json(
          {
            message: `Không thể lấy danh sách sản phẩm: ${response.statusText}`,
            error: errorText,
            status: response.status,
            timestamp: new Date().toISOString(),
          },
          {
            status: response.status,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }

      // Lấy response data dưới dạng JSON
      let responseData;
      try {
        const textData = await response.text();
        responseData = textData ? JSON.parse(textData) : null;
      } catch (parseError) {
        console.error("API Proxy Products: Lỗi khi parse JSON:", parseError);
        return NextResponse.json(
          {
            message: "Lỗi khi xử lý dữ liệu từ server",
            error: "Dữ liệu không đúng định dạng JSON",
            status: 500,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }

      // Trả về kết quả cho client
      return NextResponse.json(responseData, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    // Xử lý lỗi
    console.error("API Proxy Products: Lỗi:", error);

    // Phân loại lỗi để trả về thông tin hữu ích hơn
    let errorMessage = "Lỗi khi xử lý yêu cầu";
    let errorStatus = 500;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Yêu cầu quá thời gian. Vui lòng thử lại sau.";
        errorStatus = 504; // Gateway Timeout
      } else {
        errorMessage = `Lỗi: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        message: errorMessage,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      {
        status: errorStatus,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

/**
 * API Proxy cho việc tạo sản phẩm để tránh vấn đề CORS trong môi trường production
 *
 * @param request yêu cầu từ client
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization");

  // Kiểm tra token
  if (!token) {
    return NextResponse.json(
      { message: "Không tìm thấy token xác thực" },
      { status: 401 }
    );
  }

  try {
    // Log request đang được gửi
    console.log("API Proxy: Đang gửi yêu cầu tạo sản phẩm đến server");

    // Chuyển tiếp formData đến API thực tế
    const formData = await request.formData();
    console.log(
      "API Proxy: Nhận được formData với các keys:",
      Array.from(formData.keys())
    );

    // Tạo fetch request đến API backend thực tế
    const response = await fetch(`${REAL_API_BASE_URL}/api/v1/products`, {
      method: "POST",
      headers: {
        Authorization: token,
        // Content-Type sẽ được tự động thiết lập cho formData
      },
      body: formData,
    });

    // Lấy response data
    const responseData = await response.json();

    // Log kết quả
    console.log(`API Proxy: Kết quả từ server: ${response.status}`);

    // Trả về kết quả cho client
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("API Proxy: Lỗi khi gửi yêu cầu:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu", error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Xử lý CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
