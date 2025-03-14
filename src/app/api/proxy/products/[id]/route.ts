import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

/**
 * API Proxy cho việc lấy chi tiết sản phẩm theo ID để tránh vấn đề CORS trong môi trường production
 *
 * @param request yêu cầu từ client
 * @param params tham số URL, bao gồm ID sản phẩm
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Lấy token từ header nếu có
  const token = request.headers.get("Authorization") || "";

  try {
    // Log ID sản phẩm đang được yêu cầu
    console.log(`API Proxy: Đang lấy thông tin sản phẩm với ID: ${params.id}`);

    // Tạo fetch request đến API backend thực tế
    const apiUrl = `${REAL_API_BASE_URL}/api/v1/products/${params.id}`;
    console.log(`API Proxy: Gọi đến: ${apiUrl}`);

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
          message: `Không thể lấy thông tin sản phẩm: ${response.statusText}`,
          error: errorText,
        },
        { status: response.status }
      );
    }

    // Lấy response data
    const responseData = await response.json();
    console.log(`API Proxy: Lấy thông tin sản phẩm thành công`);

    // Trả về kết quả cho client với headers CORS
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
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
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
