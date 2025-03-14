import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

/**
 * API Proxy cho việc lấy danh sách danh mục để tránh vấn đề CORS trong môi trường production
 *
 * @param request yêu cầu từ client
 */
export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization");

  // Lấy query params
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "30";

  try {
    // Log request đang được gửi
    console.log("API Proxy Categories: Đang gửi yêu cầu đến server");

    // Tạo fetch request đến API backend thực tế
    const response = await fetch(
      `${REAL_API_BASE_URL}/api/v1/categories?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: token || "",
          Accept: "application/json",
        },
      }
    );

    // Lấy response data
    const responseData = await response.json();

    // Log kết quả
    console.log(`API Proxy Categories: Kết quả từ server: ${response.status}`);

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
    console.error("API Proxy Categories: Lỗi khi gửi yêu cầu:", error);
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
