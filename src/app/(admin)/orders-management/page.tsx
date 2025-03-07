"use client";

import { useState } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";

// Định nghĩa kiểu dữ liệu cho đơn hàng
type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  orderDate: string;
  total: number;
  status:
    | "Chờ xác nhận"
    | "Đã xác nhận"
    | "Đang vận chuyển"
    | "Đã giao hàng"
    | "Đã hủy";
  products: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category: string;
  }[];
  blog?: {
    id: string;
    title: string;
  };
};

export default function AdminOrderPage() {
  // Dữ liệu mẫu cho đơn hàng
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      customerEmail: "nguyenvana@example.com",
      customerAddress: "123 Đường Lê Lợi, Q.1, TP.HCM",
      orderDate: "15/03/2024",
      total: 450000,
      status: "Chờ xác nhận",
      products: [
        {
          id: "1",
          name: "Thức ăn cho chó Royal Canin",
          quantity: 2,
          price: 120000,
          category: "Thức ăn",
        },
        {
          id: "3",
          name: "Vòng cổ chó mèo",
          quantity: 1,
          price: 85000,
          category: "Phụ kiện",
        },
      ],
      blog: {
        id: "2",
        title: "Cách chăm sóc thú cưng mùa nóng",
      },
    },
    {
      id: "ORD-002",
      customerName: "Trần Thị B",
      customerPhone: "0911223344",
      customerEmail: "tranthib@example.com",
      customerAddress: "456 Đường Nguyễn Huệ, Q.1, TP.HCM",
      orderDate: "14/03/2024",
      total: 520000,
      status: "Đã xác nhận",
      products: [
        {
          id: "2",
          name: "Thức ăn cho mèo Whiskas",
          quantity: 3,
          price: 90000,
          category: "Thức ăn",
        },
        {
          id: "4",
          name: "Cát vệ sinh cho mèo",
          quantity: 2,
          price: 125000,
          category: "Vệ sinh",
        },
      ],
    },
    {
      id: "ORD-003",
      customerName: "Lê Văn C",
      customerPhone: "0922334455",
      customerEmail: "levanc@example.com",
      customerAddress: "789 Đường Trần Hưng Đạo, Q.5, TP.HCM",
      orderDate: "13/03/2024",
      total: 750000,
      status: "Đang vận chuyển",
      products: [
        {
          id: "5",
          name: "Lồng chim inox",
          quantity: 1,
          price: 450000,
          category: "Nhà ở",
        },
        {
          id: "6",
          name: "Thức ăn cho chim",
          quantity: 4,
          price: 75000,
          category: "Thức ăn",
        },
      ],
      blog: {
        id: "3",
        title: "Cách huấn luyện chim cảnh",
      },
    },
    {
      id: "ORD-004",
      customerName: "Phạm Thị D",
      customerPhone: "0933445566",
      customerEmail: "phamthid@example.com",
      customerAddress: "101 Đường Võ Văn Tần, Q.3, TP.HCM",
      orderDate: "12/03/2024",
      total: 320000,
      status: "Đã giao hàng",
      products: [
        {
          id: "7",
          name: "Đồ chơi cho chó",
          quantity: 3,
          price: 65000,
          category: "Đồ chơi",
        },
        {
          id: "8",
          name: "Khay ăn cho mèo",
          quantity: 1,
          price: 125000,
          category: "Phụ kiện",
        },
      ],
    },
    {
      id: "ORD-005",
      customerName: "Hoàng Văn E",
      customerPhone: "0944556677",
      customerEmail: "hoangvane@example.com",
      customerAddress: "202 Đường Nam Kỳ Khởi Nghĩa, Q.3, TP.HCM",
      orderDate: "11/03/2024",
      total: 950000,
      status: "Đã hủy",
      products: [
        {
          id: "9",
          name: "Lồng mèo di chuyển",
          quantity: 1,
          price: 550000,
          category: "Phụ kiện",
        },
        {
          id: "10",
          name: "Áo cho chó",
          quantity: 2,
          price: 200000,
          category: "Quần áo",
        },
      ],
      blog: {
        id: "1",
        title: "Những loại thức ăn tốt cho chó",
      },
    },
  ]);

  // State để quản lý dialog xác nhận
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  // Hàm xử lý khi mở dialog xác nhận đơn hàng
  const openConfirmDialog = (orderId: string) => {
    setOrderToConfirm(orderId);
    setIsConfirmDialogOpen(true);
  };

  // Hàm xử lý khi xác nhận đơn hàng
  const confirmOrder = () => {
    if (orderToConfirm) {
      setOrders(
        orders.map((order) =>
          order.id === orderToConfirm
            ? { ...order, status: "Đã xác nhận" }
            : order
        )
      );
      setIsConfirmDialogOpen(false);
      setOrderToConfirm(null);
    }
  };

  // Hàm xử lý khi hủy xác nhận đơn hàng
  const cancelConfirm = () => {
    setIsConfirmDialogOpen(false);
    setOrderToConfirm(null);
  };

  // Hàm xử lý khi mở dialog hủy đơn hàng
  const openCancelDialog = (orderId: string) => {
    setOrderToCancel(orderId);
    setIsCancelDialogOpen(true);
  };

  // Hàm xử lý khi xác nhận hủy đơn hàng
  const confirmCancel = () => {
    if (orderToCancel) {
      setOrders(
        orders.map((order) =>
          order.id === orderToCancel ? { ...order, status: "Đã hủy" } : order
        )
      );
      setIsCancelDialogOpen(false);
      setOrderToCancel(null);
    }
  };

  // Hàm xử lý khi hủy yêu cầu hủy đơn hàng
  const cancelCancelOrder = () => {
    setIsCancelDialogOpen(false);
    setOrderToCancel(null);
  };

  // Hàm lấy màu sắc dựa theo trạng thái đơn hàng
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-600";
      case "Đã xác nhận":
        return "bg-blue-100 text-blue-600";
      case "Đang vận chuyển":
        return "bg-purple-100 text-purple-600";
      case "Đã giao hàng":
        return "bg-green-100 text-green-600";
      case "Đã hủy":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-doca">Quản lý đơn hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã đơn hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày đặt
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tổng tiền
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.total.toLocaleString()}đ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/orders-management/view/${order.id}`}
                        className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
                      >
                        Chi tiết
                      </Link>

                      <Link
                        href={`/orders-management/edit/${order.id}`}
                        className="px-2 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
                      >
                        Chỉnh sửa
                      </Link>

                      {order.status === "Chờ xác nhận" && (
                        <button
                          onClick={() => openConfirmDialog(order.id)}
                          className="px-2 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
                        >
                          Xác nhận
                        </button>
                      )}

                      {(order.status === "Chờ xác nhận" ||
                        order.status === "Đã xác nhận") && (
                        <button
                          onClick={() => openCancelDialog(order.id)}
                          className="px-2 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-all"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog xác nhận đơn hàng */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Xác nhận đơn hàng"
        message="Bạn có chắc chắn muốn xác nhận đơn hàng này? Khi xác nhận, đơn hàng sẽ được chuyển sang trạng thái 'Đã xác nhận'."
        confirmButtonText="Xác nhận"
        cancelButtonText="Hủy"
        onConfirm={confirmOrder}
        onCancel={cancelConfirm}
        type="info"
      />

      {/* Dialog hủy đơn hàng */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
        confirmButtonText="Hủy đơn hàng"
        cancelButtonText="Quay lại"
        onConfirm={confirmCancel}
        onCancel={cancelCancelOrder}
        type="danger"
      />
    </div>
  );
}
