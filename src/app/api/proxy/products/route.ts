import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

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
