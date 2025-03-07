"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ConfirmDialog from "@/components/common/dialog/confirm-dialog";
import Pagination from "@/components/common/pagination/pagination";

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
      total: 320000,
      status: "Đang vận chuyển",
      products: [
        {
          id: "5",
          name: "Túi đựng chó mèo",
          quantity: 1,
          price: 250000,
          category: "Phụ kiện",
        },
        {
          id: "6",
          name: "Đồ chơi cho chó",
          quantity: 2,
          price: 35000,
          category: "Đồ chơi",
        },
      ],
    },
    {
      id: "ORD-004",
      customerName: "Phạm Thị D",
      customerPhone: "0933445566",
      customerEmail: "phamthid@example.com",
      customerAddress: "101 Đường Võ Văn Tần, Q.3, TP.HCM",
      orderDate: "12/03/2024",
      total: 180000,
      status: "Đã giao hàng",
      products: [
        {
          id: "7",
          name: "Sữa tắm cho chó",
          quantity: 1,
          price: 120000,
          category: "Vệ sinh",
        },
        {
          id: "8",
          name: "Lược chải lông",
          quantity: 1,
          price: 60000,
          category: "Phụ kiện",
        },
      ],
    },
    {
      id: "ORD-005",
      customerName: "Hoàng Văn E",
      customerPhone: "0944556677",
      customerEmail: "hoangvane@example.com",
      customerAddress: "202 Đường Điện Biên Phủ, Q.Bình Thạnh, TP.HCM",
      orderDate: "11/03/2024",
      total: 220000,
      status: "Đã hủy",
      products: [
        {
          id: "9",
          name: "Thức ăn cho cá",
          quantity: 2,
          price: 60000,
          category: "Thức ăn",
        },
        {
          id: "10",
          name: "Chuồng chim",
          quantity: 1,
          price: 100000,
          category: "Phụ kiện",
        },
      ],
    },
    {
      id: "ORD-006",
      customerName: "Vũ Thị F",
      customerPhone: "0955667788",
      customerEmail: "vuthif@example.com",
      customerAddress: "303 Đường Cách Mạng Tháng 8, Q.10, TP.HCM",
      orderDate: "10/03/2024",
      total: 350000,
      status: "Chờ xác nhận",
      products: [
        {
          id: "11",
          name: "Thức ăn cho thỏ",
          quantity: 2,
          price: 85000,
          category: "Thức ăn",
        },
        {
          id: "12",
          name: "Chuồng thỏ",
          quantity: 1,
          price: 180000,
          category: "Phụ kiện",
        },
      ],
    },
    {
      id: "ORD-007",
      customerName: "Đặng Văn G",
      customerPhone: "0966778899",
      customerEmail: "dangvang@example.com",
      customerAddress: "404 Đường Nguyễn Văn Linh, Q.7, TP.HCM",
      orderDate: "09/03/2024",
      total: 270000,
      status: "Đã xác nhận",
      products: [
        {
          id: "13",
          name: "Thức ăn cho hamster",
          quantity: 3,
          price: 70000,
          category: "Thức ăn",
        },
        {
          id: "14",
          name: "Chuồng hamster",
          quantity: 1,
          price: 130000,
          category: "Phụ kiện",
        },
      ],
      blog: {
        id: "3",
        title: "Cách chăm sóc hamster",
      },
    },
  ]);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // State cho các dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Tính toán đơn hàng cần hiển thị cho trang hiện tại
  const currentOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [orders, currentPage]);

  // Tính tổng số trang
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  // Hàm xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openConfirmDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsConfirmDialogOpen(true);
  };

  // Xác nhận đơn hàng
  const confirmOrder = () => {
    if (selectedOrderId) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId
            ? {
                ...order,
                status:
                  order.status === "Chờ xác nhận"
                    ? "Đã xác nhận"
                    : order.status === "Đã xác nhận"
                    ? "Đang vận chuyển"
                    : order.status === "Đang vận chuyển"
                    ? "Đã giao hàng"
                    : order.status,
              }
            : order
        )
      );
      setIsConfirmDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const cancelConfirm = () => {
    setIsConfirmDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Mở dialog hủy đơn hàng
  const openCancelDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsCancelDialogOpen(true);
  };

  // Hủy đơn hàng
  const confirmCancel = () => {
    if (selectedOrderId) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId
            ? {
                ...order,
                status: "Đã hủy",
              }
            : order
        )
      );
      setIsCancelDialogOpen(false);
      setSelectedOrderId(null);
    }
  };

  const cancelCancelOrder = () => {
    setIsCancelDialogOpen(false);
    setSelectedOrderId(null);
  };

  // Lấy màu theo trạng thái
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Chờ xác nhận":
        return "bg-blue-100 text-blue-600";
      case "Đã xác nhận":
        return "bg-yellow-100 text-yellow-600";
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

  const getNextStatusText = (status: Order["status"]) => {
    switch (status) {
      case "Chờ xác nhận":
        return "Xác nhận";
      case "Đã xác nhận":
        return "Vận chuyển";
      case "Đang vận chuyển":
        return "Đã giao";
      default:
        return "";
    }
  };

  return (
    <div className=" mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-pink-doca">Đơn Hàng</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-2">
        {currentOrders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col p-4 border-b last:border-b-0 rounded-md my-2 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  Mã đơn hàng: {order.id}
                </h3>
                <p className="text-sm text-gray-600">
                  Ngày đặt: {order.orderDate}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-semibold">
                  {order.total.toLocaleString()}đ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Thông tin khách hàng
                </h4>
                <p className="text-sm">{order.customerName}</p>
                <p className="text-sm">{order.customerPhone}</p>
                <p className="text-sm">{order.customerEmail}</p>
                <p className="text-sm">{order.customerAddress}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Sản phẩm đã đặt
                </h4>
                <ul className="list-disc pl-5 text-sm">
                  {order.products.map((product) => (
                    <li key={product.id}>
                      {product.name} - SL: {product.quantity} - Đơn giá:{" "}
                      {product.price.toLocaleString()}đ
                    </li>
                  ))}
                </ul>
                {order.blog && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-500">
                      Bài viết liên quan
                    </h4>
                    <p className="text-sm">{order.blog.title}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-3 space-x-2">
              <Link
                href={`/orders-management/view?id=${order.id}`}
                className="px-4 py-1 text-sm text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-all"
              >
                Chi tiết
              </Link>

              <Link
                href={`/orders-management/edit?id=${order.id}`}
                className="px-4 py-1 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-all"
              >
                Chỉnh sửa
              </Link>

              {order.status !== "Đã giao hàng" && order.status !== "Đã hủy" && (
                <button
                  onClick={() => openConfirmDialog(order.id)}
                  className="px-4 py-1 text-sm text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-all"
                >
                  {getNextStatusText(order.status)}
                </button>
              )}

              {order.status !== "Đã giao hàng" && order.status !== "Đã hủy" && (
                <button
                  onClick={() => openCancelDialog(order.id)}
                  className="px-4 py-1 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-all"
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Thêm phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Dialog xác nhận đơn hàng */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        title="Xác nhận cập nhật trạng thái"
        message="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?"
        confirmButtonText="Xác nhận"
        cancelButtonText="Hủy"
        onConfirm={confirmOrder}
        onCancel={cancelConfirm}
        type="info"
      />

      {/* Dialog hủy đơn hàng */}
      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác."
        confirmButtonText="Hủy đơn"
        cancelButtonText="Đóng"
        onConfirm={confirmCancel}
        onCancel={cancelCancelOrder}
        type="danger"
      />
    </div>
  );
}
