import { useCallback, useEffect, useState } from "react";
import memberService, {
  Member,
  MemberResponse,
} from "@/service/member-service";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Interface for member pagination
export interface MemberPaginationState {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// Interface for formatted member data
export interface FormattedMember extends Member {
  formattedDate: string;
  formattedTime: string;
  roleText: string;
  statusText: string;
  orderCount: number;
}

export const useAdminMembers = (initialToken?: string) => {
  // States for members data
  const [members, setMembers] = useState<FormattedMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [pagination, setPagination] = useState<MemberPaginationState>({
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
  });

  // Format member data from API response
  const formatMembers = useCallback((data: Member[]): FormattedMember[] => {
    return data.map((member) => {
      let createdAt;
      try {
        // Use the first order's createdAt or current date if no orders
        createdAt =
          member.orders && member.orders.length > 0
            ? new Date(member.orders[0].createdAt)
            : new Date();
      } catch (e) {
        console.error("Error parsing date:", e);
        createdAt = new Date();
      }

      // Get role from user if available
      const role = member.user?.role || 0;

      return {
        ...member,
        formattedDate: format(createdAt, "dd/MM/yyyy", { locale: vi }),
        formattedTime: format(createdAt, "HH:mm", { locale: vi }),
        roleText: role === 1 ? "Admin" : "Người dùng",
        statusText:
          member.orders && member.orders.length > 0
            ? "Đã đặt hàng"
            : "Chưa đặt hàng",
        orderCount: member.orders ? member.orders.length : 0,
      };
    });
  }, []);

  // Get members with pagination
  const getMembers = useCallback(
    async (page = 1, size = 10) => {
      setIsLoading(true);
      setError(null);

      try {
        // Get token from localStorage if not provided
        const token = initialToken || localStorage.getItem("token") || "";

        if (!token) {
          console.error("No token available, cannot fetch members");
          setError("Bạn cần đăng nhập để xem danh sách thành viên");
          setIsLoading(false);
          return;
        }

        // Call API to get members
        const response: MemberResponse = await memberService.getAllMembers(
          token,
          page,
          size
        );

        console.log("Members API response:", response);

        if (response && response.items) {
          // Format members data
          const formattedMembers = formatMembers(response.items);
          setMembers(formattedMembers);

          // Update pagination state
          setPagination({
            page: response.page || page,
            size: response.size || size,
            total: response.total || 0,
            totalPages: response.totalPages || 1,
          });
        } else {
          setError("Không thể tải dữ liệu thành viên");
        }
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải dữ liệu thành viên"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [formatMembers, initialToken]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      getMembers(newPage, pagination.size);
    },
    [getMembers, pagination.size]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      getMembers(1, newSize);
    },
    [getMembers]
  );

  // Initial fetch
  useEffect(() => {
    getMembers(pagination.page, pagination.size);
  }, [getMembers, pagination.page, pagination.size]);

  return {
    members,
    isLoading,
    error,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    refreshMembers: () => getMembers(pagination.page, pagination.size),
  };
};

export default useAdminMembers;
