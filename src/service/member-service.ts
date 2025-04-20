import axios from "axios";

// Định nghĩa kiểu dữ liệu cho đơn hàng trong member
export interface MemberOrder {
  id: string;
  total: number;
  address: string;
  status: string;
  createdAt: string;
  modifiedAt: string;
  member: null; // Member không có trong response của order trong member
}

// Định nghĩa kiểu dữ liệu cho user
export interface User {
  id: string;
  username: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  role?: number;
}

// Định nghĩa kiểu dữ liệu cho thành viên
export interface Member {
  id: string;
  userId: string;
  user: User | null;
  username: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  commune: string | null;
  district: string | null;
  province: string | null;
  address: string | null;
  provinceCode: string | null;
  districtCode: string | null;
  communeCode: string | null;
  orders: MemberOrder[];
}

// Định nghĩa kiểu dữ liệu cho response API
export interface MemberResponse {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: Member[];
}

const BASE_API_URL = "https://production.doca.love";

// Tạo axios instance với timeout
const api = axios.create({
  baseURL: BASE_API_URL,
  timeout: 15000, // 15 giây
});

// Hàm để lấy token đúng
const getAuthHeader = (token: string) => {
  if (!token) return "";

  // Nếu token đã có "Bearer" thì sử dụng trực tiếp
  if (token.startsWith("Bearer ")) {
    return token;
  }

  return `Bearer ${token}`;
};

// Dữ liệu mẫu khi không có token hoặc API lỗi (chỉ dùng cho testing)
const MOCK_MEMBERS: Member[] = [
  {
    id: "1a29066d-a062-4484-aa5b-1d0be9bf7e7b",
    userId: "88a32854-ccb3-4659-39cd-08dd7f3461ac",
    user: null,
    username: "lethiyennhi311202@gmail.com",
    phoneNumber: "0906859068",
    fullName: "Trinh Tuan",
    commune: null,
    district: null,
    province: null,
    address: null,
    provinceCode: null,
    districtCode: null,
    communeCode: null,
    orders: [
      {
        id: "7f13708b-b093-4e91-b459-18dbc27ff832",
        total: 105000,
        address: "Sài Gòn Time",
        status: "Pending",
        createdAt: "2025-04-20T08:57:10.1929062",
        modifiedAt: "2025-04-20T08:57:10.192913",
        member: null,
      },
    ],
  },
  {
    id: "e0d26b1a-5f10-45f0-81b8-24fa99591fd1",
    userId: "809a8776-a2a7-4779-9e2f-08dd7b50aabc",
    user: null,
    username: "Nguyenyenphuongggg1412@gmail.com",
    phoneNumber: "0823328686",
    fullName: "Nguyễn Yến Phương",
    commune: null,
    district: null,
    province: null,
    address: null,
    provinceCode: null,
    districtCode: null,
    communeCode: null,
    orders: [],
  },
];

export const memberService = {
  getAllMembers: async (
    token: string,
    page = 1,
    size = 10
  ): Promise<MemberResponse> => {
    try {
      console.log("Fetching all members...");

      // Nếu không có token, trả về dữ liệu mẫu cho trường hợp phát triển
      if (!token) {
        console.log("No token - returning mock data for development");
        return {
          items: MOCK_MEMBERS,
          page: page,
          size: size,
          total: MOCK_MEMBERS.length,
          totalPages: 1,
        };
      }

      // Đảm bảo page và size hợp lệ
      if (page < 1) page = 1;
      if (size < 1) size = 10;
      if (size > 50) size = 50;

      console.log(`Calling API: GET /api/v1/members?page=${page}&size=${size}`);
      console.log(`Authorization: ${getAuthHeader(token).substring(0, 20)}...`);

      const response = await api.get(`/api/v1/members`, {
        params: {
          page,
          size,
        },
        headers: {
          Authorization: getAuthHeader(token),
        },
      });

      console.log("API Response Status:", response.status);
      console.log(
        "API Response Data Structure:",
        Object.keys(response.data || {})
      );

      // Nếu phản hồi là một mảng
      if (Array.isArray(response.data)) {
        console.log("Response is an array with length:", response.data.length);
        return {
          items: response.data,
          page: page,
          size: size,
          total: response.data.length,
          totalPages: Math.ceil(response.data.length / size),
        };
      }

      // Nếu phản hồi có thuộc tính 'items'
      if (response.data && response.data.items) {
        console.log(
          "Response has 'items' with length:",
          response.data.items.length
        );
        return response.data;
      }

      // Đảm bảo trả về đúng định dạng
      return {
        size: response.data?.size || size,
        page: response.data?.page || page,
        total: response.data?.total || 0,
        totalPages: response.data?.totalPages || 1,
        items: response.data?.items || [],
      };
    } catch (error) {
      console.error("Error fetching members:", error);

      // Nếu đang ở môi trường phát triển, trả về dữ liệu mẫu
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode - returning mock data after API error");
        return {
          items: MOCK_MEMBERS,
          page: page,
          size: size,
          total: MOCK_MEMBERS.length,
          totalPages: 1,
        };
      }

      // Xử lý lỗi cụ thể
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          throw new Error(
            "Không thể tải dữ liệu do quá thời gian chờ. Vui lòng thử lại sau."
          );
        }

        if (error.response) {
          console.error(
            "API Error Response:",
            error.response.status,
            error.response.data
          );
          const status = error.response.status;

          if (status === 401 || status === 403) {
            // Xóa token nếu đã hết hạn
            localStorage.removeItem("token");
            throw new Error(
              "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            );
          } else if (status >= 500) {
            throw new Error("Lỗi máy chủ. Vui lòng thử lại sau.");
          }
        }
      }

      throw new Error(
        "Không thể tải dữ liệu thành viên. Vui lòng thử lại sau."
      );
    }
  },

  getMemberById: async (id: string, token: string): Promise<Member> => {
    try {
      // Nếu không có token và đang ở môi trường phát triển, trả về dữ liệu mẫu
      if (!token && process.env.NODE_ENV === "development") {
        const mockMember = MOCK_MEMBERS.find((member) => member.id === id);
        if (mockMember) {
          return mockMember;
        }
        // Nếu không tìm thấy ID phù hợp, trả về thành viên đầu tiên
        return MOCK_MEMBERS[0];
      }

      const response = await api.get(`/api/v1/members/${id}`, {
        headers: {
          Authorization: getAuthHeader(token),
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching member with id ${id}:`, error);

      // Nếu đang ở môi trường phát triển, trả về dữ liệu mẫu
      if (process.env.NODE_ENV === "development") {
        const mockMember = MOCK_MEMBERS.find((member) => member.id === id);
        if (mockMember) {
          return mockMember;
        }
        return MOCK_MEMBERS[0];
      }

      throw error;
    }
  },
};

export default memberService;
