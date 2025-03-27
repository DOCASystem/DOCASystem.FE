import axios from "axios";

export interface Member {
  id: string;
  userId: string;
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
}

export interface Order {
  id: string;
  total: number;
  address: string;
  status: string;
  createdAt: string;
  modifiedAt: string;
  member: Member;
}

export interface ApiResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

const BASE_API_URL = "https://production.doca.love";

export const orderService = {
  getAllOrders: async (
    token: string,
    page = 1,
    size = 30
  ): Promise<Order[]> => {
    try {
      const response = await axios.get<ApiResponse<Order>>(
        `${BASE_API_URL}/api/v1/orders`,
        {
          params: {
            page,
            size,
            isAsc: true,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      return response.data?.content || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderById: async (id: string, token: string): Promise<Order> => {
    try {
      const response = await axios.get(`${BASE_API_URL}/api/v1/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching order with id ${id}:`, error);
      throw error;
    }
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    token: string
  ): Promise<Order> => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/api/v1/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error updating order status for id ${id}:`, error);
      throw error;
    }
  },
};

export default orderService;
