import { NextRequest, NextResponse } from "next/server";
import { REAL_API_BASE_URL } from "@/utils/api-config";

/**
 * Định nghĩa interface cho đối tượng lỗi
 */
interface ProxyError {
  status?: number;
  statusText?: string;
  errorText?: string;
}

/**
 * API Proxy cho việc lấy chi tiết bài viết blog theo ID để tránh vấn đề CORS trong môi trường production
 *
 * @param request yêu cầu từ client
 * @param params tham số URL, bao gồm ID bài viết
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Lấy token từ header nếu có
  const token = request.headers.get("Authorization") || "";

  try {
    // Log ID bài viết đang được yêu cầu
    console.log(`API Proxy: Đang lấy thông tin bài viết với ID: ${params.id}`);

    // Danh sách các API URLs để thử theo thứ tự ưu tiên
    const apiUrlsToTry = [
      `${REAL_API_BASE_URL}/api/v1/blogs/${params.id}`,
      `https://api.doca.love/api/v1/blogs/${params.id}`,
    ];

    let responseData = null;
    let lastError: ProxyError = {};

    // Thử từng URL cho đến khi thành công
    for (const apiUrl of apiUrlsToTry) {
      try {
        console.log(`API Proxy: Đang thử gọi API: ${apiUrl}`);

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
        if (response.ok) {
          responseData = await response.json();
          console.log(
            `API Proxy: Lấy thông tin bài viết thành công`,
            responseData
          );

          // Trả về kết quả cho client
          return NextResponse.json(responseData, {
            status: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          });
        } else {
          const errorText = await response.text();
          console.error(
            `API Proxy: Lỗi từ server (${apiUrl}): ${response.status}`,
            errorText
          );

          lastError = {
            status: response.status,
            errorText,
            statusText: response.statusText,
          };

          // Nếu lỗi không phải 500, dừng việc thử các URLs khác
          if (response.status !== 500) {
            break;
          }
        }
      } catch (error) {
        console.error(`API Proxy: Lỗi khi gửi yêu cầu đến ${apiUrl}:`, error);
        lastError = { errorText: String(error) };
      }
    }

    // Nếu tất cả các URLs đều thất bại, trả về lỗi cuối cùng
    return NextResponse.json(
      {
        message: `Không thể lấy thông tin bài viết: ${
          lastError?.statusText || "Lỗi không xác định"
        }`,
        error: lastError?.errorText || String(lastError),
      },
      { status: lastError?.status || 500 }
    );
  } catch (error) {
    console.error("API Proxy: Lỗi khi xử lý yêu cầu:", error);
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
