import { useState, useEffect, useCallback } from "react";
import memberService, {
  Member,
  MemberResponse,
} from "@/service/member-service";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Interface cho thành viên đã được format
export interface FormattedMember extends Member {
  formattedDate: string;
  formattedTime: string;
  roleText: string;
  statusText: string;
  orderCount: number;
}

export const useMembers = (token?: string) => {
  const [members, setMembers] = useState<FormattedMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    size: 30,
    totalElements: 0,
    totalPages: 0,
  });

  // Format thành viên từ API response
  const formatMembers = useCallback(
    (data: MemberResponse): FormattedMember[] => {
      console.log("API Response Data:", JSON.stringify(data, null, 2));

      if (!data) {
        console.error("No data returned from API");
        return [];
      }

      // Kiểm tra xem data có thuộc tính 'items' không
      const memberItems = data.items || [];

      // Nếu không có items nhưng data là một mảng, có thể API trả về mảng trực tiếp
      const membersArray = Array.isArray(data) ? data : memberItems;

      console.log("Members Array Length:", membersArray.length);

      if (membersArray.length === 0) {
        console.warn("No members found in API response");
        return [];
      }

      return membersArray.map((member) => {
        console.log("Processing member:", member.id);

        let dateObj;
        try {
          // Thời gian tạo thành viên có thể không có trong API, sử dụng thời gian hiện tại nếu không có
          const createdAt =
            member.orders.length > 0
              ? member.orders[0].createdAt
              : new Date().toISOString();

          dateObj = parseISO(createdAt);
        } catch (err) {
          console.error("Invalid date format:", err);
          dateObj = new Date();
        }

        // Lấy thông tin từ member.user (có thể có hoặc không)
        const user = member.user;

        // Xác định vai trò người dùng
        let roleText = "Khách hàng";
        const statusText = "Hoạt động";

        if (user && user.role !== undefined) {
          // Gán vai trò dựa trên role từ API (giả định role = 1 là Admin, role = 2 là Staff, role = 3 là User)
          roleText =
            user.role === 1
              ? "Admin"
              : user.role === 2
              ? "Nhân viên"
              : "Khách hàng";
        }

        const formattedMember: FormattedMember = {
          ...member,
          formattedDate: format(dateObj, "dd/MM/yyyy", { locale: vi }),
          formattedTime: format(dateObj, "HH:mm", { locale: vi }),
          roleText,
          statusText,
          orderCount: member.orders.length,
        };

        return formattedMember;
      });
    },
    []
  );

  // Thử lấy token từ localStorage nếu không truyền vào
  const getTokenFromStorage = useCallback((): string | null => {
    try {
      if (typeof window === "undefined") return null;

      // Thử lấy token từ localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken) return storedToken;

      // Thử lấy từ auth storage
      const authData = localStorage.getItem("userData");
      if (authData) {
        const parsedData = JSON.parse(authData);
        return parsedData?.token || null;
      }

      return null;
    } catch (e) {
      console.error("Error getting token from storage:", e);
      return null;
    }
  }, []);

  const fetchMembers = useCallback(
    async (page = 1, size = 30) => {
      // Sử dụng token truyền vào, hoặc thử lấy từ localStorage
      const authToken = token || getTokenFromStorage();

      if (!authToken) {
        setError("Vui lòng đăng nhập để xem danh sách thành viên.");
        setLoading(false);
        return;
      }

      console.log(
        "Fetching members with token:",
        authToken.substring(0, 15) + "..."
      );
      console.log("Page:", page, "Size:", size);

      setLoading(true);
      setError(null);

      try {
        const data = await memberService.getAllMembers(authToken, page, size);
        console.log("API response received");

        // Format và lưu trữ thành viên
        const formattedMembers = formatMembers(data);
        console.log("Formatted members count:", formattedMembers.length);
        setMembers(formattedMembers);

        // Cập nhật thông tin phân trang
        setPagination({
          page: data.page || page,
          size: data.size || size,
          totalElements: data.total || 0,
          totalPages: data.totalPages || 1,
        });
      } catch (err) {
        console.error("Error fetching members:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Lỗi khi tải dữ liệu thành viên";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token, formatMembers, getTokenFromStorage]
  );

  useEffect(() => {
    // Sử dụng token truyền vào, hoặc thử lấy từ localStorage
    const authToken = token || getTokenFromStorage();

    if (authToken) {
      console.log("Token available, fetching members...");
      fetchMembers(pagination.page, pagination.size);
    } else {
      console.warn("No token available, setting error state");
      setLoading(false);
      setError("Vui lòng đăng nhập để xem danh sách thành viên.");
    }
  }, [
    fetchMembers,
    token,
    pagination.page,
    pagination.size,
    getTokenFromStorage,
  ]);

  // Thay đổi trang
  const changePage = useCallback((newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    pagination,
    changePage,
  };
};

export default useMembers;
