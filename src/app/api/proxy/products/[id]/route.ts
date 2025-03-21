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

    // URL API chính xác để lấy chi tiết sản phẩm
    const apiUrl = `${REAL_API_BASE_URL}/api/v1/products/${params.id}`;
    console.log(`API Proxy: Gọi đến: ${apiUrl}`);

    // Thực hiện request với timeout để tránh treo quá lâu
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 giây timeout

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        signal: controller.signal,
        cache: "no-store", // Không cache kết quả
      });

      // Xóa timeout nếu request thành công
      clearTimeout(timeoutId);

      // Log chi tiết về response
      console.log(
        `API Proxy: Response status: ${response.status} ${response.statusText}`
      );
      // Log một vài header quan trọng thay vì duyệt qua tất cả
      console.log(
        `API Proxy: Content-Type: ${response.headers.get("content-type")}`
      );
      console.log(
        `API Proxy: Content-Length: ${response.headers.get("content-length")}`
      );

      // Kiểm tra response status
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `API Proxy: Lỗi từ server: ${response.status}`,
          errorText
        );

        // Tạo response JSON với thông tin lỗi chi tiết
        return NextResponse.json(
          {
            message: `Không thể lấy thông tin sản phẩm: ${response.statusText}`,
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

      // Lấy response data dưới dạng JSON và xử lý an toàn
      let responseData;
      try {
        const textData = await response.text();
        console.log(
          `API Proxy: Response body:`,
          textData.substring(0, 200) + "..."
        );
        responseData = textData ? JSON.parse(textData) : null;

        // Kiểm tra dữ liệu trả về
        if (!responseData || !responseData.id) {
          throw new Error("Dữ liệu trả về không hợp lệ hoặc thiếu thông tin");
        }

        console.log(
          `API Proxy: Lấy thông tin sản phẩm thành công`,
          responseData?.id || "ID không xác định"
        );
      } catch (parseError) {
        console.error("API Proxy: Lỗi khi parse JSON:", parseError);
        return NextResponse.json(
          {
            message: "Lỗi xử lý dữ liệu từ server",
            details: "Dữ liệu trả về không đúng định dạng JSON",
            status: 500,
            timestamp: new Date().toISOString(),
          },
          {
            status: 500,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          }
        );
      }

      // Trả về kết quả cho client với headers CORS
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
    // Xử lý lỗi chi tiết hơn
    console.error("API Proxy: Lỗi khi gửi yêu cầu:", error);

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
        productId: params.id,
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
