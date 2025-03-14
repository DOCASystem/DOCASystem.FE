import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

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
