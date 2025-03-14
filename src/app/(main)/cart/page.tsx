"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, CartItem } from "@/store/cart-store";

export default function CartPage() {
  // Sử dụng một state duy nhất để kiểm soát client-side rendering
  const [mounted, setMounted] = useState(false);

  // Lấy các phương thức và dữ liệu từ store
  const { items, updateQuantity, removeItem } = useCartStore();

  // Tính toán subtotal và total khi render thay vì lưu trong state
  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Tính tổng số sản phẩm trong giỏ hàng
  const calculateTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Định nghĩa phí giao hàng
  const calculateShippingFee = () => {
    const totalItems = calculateTotalItems();
    // Miễn phí giao hàng nếu mua từ 3 sản phẩm trở lên
    return totalItems >= 3 ? 0 : 15000;
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  // Chỉ đặt mounted = true sau khi component đã render ở client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    console.log("Tiến hành thanh toán");
    // Thêm xử lý thanh toán ở đây
  };

  // Đảm bảo hiển thị nội dung chỉ ở client-side
  if (!mounted) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 text-center">
        <div className="w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-doca"></div>
        </div>
      </div>
    );
  }

  // Tính toán các giá trị khi render, không lưu vào state
  const subtotal = calculateSubtotal();
  const shippingFee = calculateShippingFee();
  const total = subtotal + shippingFee;
  const totalItems = calculateTotalItems();

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center md:text-left">
        Giỏ hàng của bạn
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-8 md:py-10 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          <p className="text-lg md:text-xl mt-4 mb-6">
            Giỏ hàng của bạn đang trống
          </p>
          <Link
            href="/shop"
            className="inline-block bg-pink-doca text-white px-6 py-3 rounded-md hover:bg-pink-600 transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Phần sản phẩm - hiển thị table trên desktop, cards trên mobile */}
          <div className="lg:col-span-2">
            {/* Hiển thị dạng bảng trên màn hình lớn hơn */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-2">Sản Phẩm</th>
                    <th className="text-left py-4 px-2">Giá</th>
                    <th className="text-left py-4 px-2">Số Lượng</th>
                    <th className="text-left py-4 px-2">Thành Tiền</th>
                    <th className="py-4 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <div className="relative w-16 h-16 md:w-20 md:h-20 mr-4 flex-shrink-0">
                            <Image
                              src={item.imageUrl || "/images/food-test.png"}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 64px, 80px"
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm md:text-base">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm md:text-base">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <button
                            className="px-2 md:px-3 py-1 bg-gray-200 rounded-l-md"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="w-10 md:w-14 px-1 md:px-2 py-1 text-center border-gray-200 border-y text-sm md:text-base"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item,
                                parseInt(e.target.value) || 1
                              )
                            }
                            min={1}
                          />
                          <button
                            className="px-2 md:px-3 py-1 bg-gray-200 rounded-r-md"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm md:text-base font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                      <td className="py-4 px-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-500 hover:text-red-500 p-1"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hiển thị dạng card trên màn hình nhỏ */}
            <div className="md:hidden space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex mb-4">
                    <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/images/food-test.png"}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-base">{item.name}</h3>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-500 hover:text-red-500 p-1"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-l-md"
                        onClick={() =>
                          handleQuantityChange(item, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-10 px-1 py-1 text-center border-gray-200 border-y text-sm"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item,
                            parseInt(e.target.value) || 1
                          )
                        }
                        min={1}
                      />
                      <button
                        className="px-2 py-1 bg-gray-200 rounded-r-md"
                        onClick={() =>
                          handleQuantityChange(item, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-4 md:p-6 rounded-lg sticky top-4">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Thông tin đơn hàng
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm md:text-base">Tạm Tính</span>
                  <span className="font-medium text-sm md:text-base">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-4">
                  <span className="text-sm md:text-base">Phí giao hàng</span>
                  <span className="font-medium text-sm md:text-base">
                    {shippingFee === 0 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {totalItems > 0 && totalItems < 3 && (
                  <div className="text-xs text-gray-500 italic pb-2">
                    Mua thêm {3 - totalItems} sản phẩm để được miễn phí giao
                    hàng
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <span className="font-bold text-sm md:text-base">Tổng</span>
                  <span className="font-bold text-lg md:text-xl text-pink-doca">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-pink-doca text-white py-3 rounded-md mt-6 hover:bg-pink-600 transition-colors"
              >
                Thanh toán
              </button>

              <Link
                href="/shop"
                className="w-full block text-center text-gray-600 hover:text-pink-doca mt-4 text-sm md:text-base"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
