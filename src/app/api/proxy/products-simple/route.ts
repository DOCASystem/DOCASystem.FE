import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

/**
 * API Proxy đơn giản để lấy danh sách sản phẩm
 * Nhằm giảm thiểu các vấn đề có thể xảy ra với CORS và authentication
 *
 * @param request yêu cầu từ client
 */
export async function GET(request: NextRequest) {
  // Lấy token từ header nếu có
  const token = request.headers.get("Authorization") || "";

  try {
    // Lấy query params từ URL
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "8";
    const categoryIds = searchParams.getAll("categoryIds");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Log request đang được gửi
    console.log(
      `API Proxy Simple: Đang lấy danh sách sản phẩm (page=${page}, size=${size})`
    );

    // Xây dựng URL cho API
    let apiUrl = `${REAL_API_BASE_URL}/api/v1/products?page=${page}&size=${size}`;

    // Thêm các tham số tìm kiếm nếu có
    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach((id) => {
        apiUrl += `&categoryIds=${id}`;
      });
    }

    if (minPrice) {
      apiUrl += `&minPrice=${minPrice}`;
    }

    if (maxPrice) {
      apiUrl += `&maxPrice=${maxPrice}`;
    }

    console.log(`API Proxy Simple: Gọi đến: ${apiUrl}`);

    // Gọi API để lấy danh sách sản phẩm
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      cache: "no-store", // Không cache kết quả
    });

    // Kiểm tra response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API Proxy Simple: Lỗi từ server: ${response.status}`,
        errorText
      );

      return NextResponse.json(
        {
          message: `Không thể lấy danh sách sản phẩm: ${response.statusText}`,
          error: errorText,
        },
        { status: response.status }
      );
    }

    // Lấy response data
    const responseData = await response.json();
    console.log(
      `API Proxy Simple: Lấy danh sách sản phẩm thành công, ${
        responseData.items?.length || 0
      } sản phẩm`
    );

    // Trả về kết quả cho client với headers CORS
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("API Proxy Simple: Lỗi khi gửi yêu cầu:", error);
    return NextResponse.json(
      { message: "Lỗi khi xử lý yêu cầu", error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * API Proxy đơn giản cho việc tạo sản phẩm không có hình ảnh
 * Nhằm giảm thiểu các vấn đề có thể xảy ra với formData và CORS
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
    console.log(
      "API Proxy Simple: Đang gửi yêu cầu tạo sản phẩm đơn giản đến server"
    );

    // Lấy dữ liệu JSON từ request
    const data = await request.json();
    console.log("API Proxy Simple: Nhận được dữ liệu:", data);

    // Tạo request đến API backend thực tế
    const response = await fetch(`${REAL_API_BASE_URL}/api/v1/products`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (error) {
      console.error("API Proxy Simple: Lỗi khi parse JSON response:", error);
      responseData = { message: "Không thể đọc dữ liệu phản hồi từ server" };
    }

    // Log kết quả
    console.log(`API Proxy Simple: Kết quả từ server: ${response.status}`);

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
    console.error("API Proxy Simple: Lỗi khi gửi yêu cầu:", error);
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
