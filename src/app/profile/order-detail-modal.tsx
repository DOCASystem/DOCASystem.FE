"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import orderService, { OrderItem } from "@/service/order-service";

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose,
  token,
}) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderItems = async () => {
      if (!isOpen || !orderId) return;

      setLoading(true);
      setError(null);

      try {
        const items = await orderService.getOrderItems(orderId, token);
        setOrderItems(items);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItems();
  }, [orderId, isOpen, token]);

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý khi click outside modal để đóng
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Chi tiết đơn hàng #{orderId.substring(0, 8)}...
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5"
            onClick={onClose}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-doca"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : orderItems.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              Không có chi tiết đơn hàng để hiển thị.
            </div>
          ) : (
            <div className="space-y-6">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  {/* Sản phẩm */}
                  {item.product && (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/4">
                        <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                          {item.product.productImages?.length > 0 &&
                          item.product.productImages.find(
                            (img) => img.isMain
                          ) ? (
                            <Image
                              src={
                                item.product.productImages.find(
                                  (img) => img.isMain
                                )?.imageUrl || ""
                              }
                              alt={item.product.name}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Không có hình ảnh
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2">
                          {item.product.name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <div>
                            <span className="text-gray-600">Số lượng:</span>{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Giá:</span>{" "}
                            <span className="font-medium">
                              {formatCurrency(item.product.price)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Thành tiền:</span>{" "}
                            <span className="font-medium text-pink-doca">
                              {formatCurrency(
                                item.product.price * item.quantity
                              )}
                            </span>
                          </div>
                          {item.product.volume > 0 && (
                            <div>
                              <span className="text-gray-600">Khối lượng:</span>{" "}
                              <span className="font-medium">
                                {item.product.volume} kg
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3">
                          <h5 className="font-medium text-gray-700 mb-1">
                            Mô tả sản phẩm:
                          </h5>
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {item.product.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blog */}
                  {item.blog && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-lg font-semibold mb-2">
                        Blog liên quan: {item.blog.name}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-2">
                        {item.blog.description}
                      </p>
                      <div className="text-sm text-gray-500">
                        Ngày tạo:{" "}
                        {new Date(item.blog.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <button
            type="button"
            className="w-full inline-flex justify-center px-4 py-2 bg-pink-doca text-white rounded-md hover:bg-pink-600 focus:outline-none"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
