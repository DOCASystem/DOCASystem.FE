import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

/**
 * API Proxy cho việc lấy danh sách sản phẩm để tránh vấn đề CORS trong môi trường production
 *
 * @param request yêu cầu từ client
 */
export async function GET(request: NextRequest) {
  // Lấy token từ header nếu có
  const token = request.headers.get("Authorization") || "";

  try {
    // Lấy các tham số truy vấn từ URL
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    const categoryIds = searchParams.get("categoryIds");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    // Tạo URL cho API
    let apiUrl = `${REAL_API_BASE_URL}/api/v1/products?page=${page}&size=${size}`;

    // Thêm các tham số tìm kiếm nếu có
    if (categoryIds) apiUrl += `&categoryIds=${categoryIds}`;
    if (minPrice) apiUrl += `&minPrice=${minPrice}`;
    if (maxPrice) apiUrl += `&maxPrice=${maxPrice}`;
    if (search) apiUrl += `&search=${encodeURIComponent(search)}`;

    console.log(`API Proxy: Gọi đến: ${apiUrl}`);

    // Thực hiện request
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
      console.error(`API Proxy: Lỗi từ server: ${response.status}`, errorText);

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
      `API Proxy: Lấy danh sách sản phẩm thành công, số lượng: ${
        responseData.content?.length || 0
      }`
    );

    // Trả về kết quả cho client với headers CORS
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
 * API Proxy cho việc tạo sản phẩm không có hình ảnh
 *
 * @param request yêu cầu từ client
 */
export async function POST(request: NextRequest) {
  // Lấy token từ header
  const token = request.headers.get("Authorization") || "";

  // Kiểm tra token
  if (!token) {
    return NextResponse.json(
      { message: "Không có quyền truy cập" },
      { status: 401 }
    );
  }

  try {
    console.log("API Proxy: Đang xử lý yêu cầu tạo sản phẩm");

    // Lấy dữ liệu JSON từ request
    const jsonData = await request.json();
    console.log("API Proxy: Dữ liệu sản phẩm:", jsonData);

    // URL API để tạo sản phẩm
    const apiUrl = `${REAL_API_BASE_URL}/api/v1/products`;
    console.log(`API Proxy: Gọi POST đến: ${apiUrl}`);

    // Thực hiện request đến backend
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(jsonData),
    });

    // Kiểm tra response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Proxy: Lỗi từ server: ${response.status}`, errorText);

      return NextResponse.json(
        {
          message: `Không thể tạo sản phẩm: ${response.statusText}`,
          error: errorText,
        },
        { status: response.status }
      );
    }

    // Lấy response data
    const responseData = await response.json();
    console.log(`API Proxy: Tạo sản phẩm thành công`, responseData);

    // Trả về kết quả cho client với headers CORS
    return NextResponse.json(responseData, {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
