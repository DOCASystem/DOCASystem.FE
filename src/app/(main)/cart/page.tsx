"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { CartService, CartItemResponse } from "@/service/cart-service";
import { PaymentService } from "@/service/payment-service";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>(
    {}
  );

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  // Lấy dữ liệu giỏ hàng từ API
  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const data = await CartService.getCart();
      setCartItems(data);
      setError(null);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu giỏ hàng:", err);
      setError("Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại sau.");
      toast.error("Không thể tải dữ liệu giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  };

  // Chỉ đặt mounted = true sau khi component đã render ở client
  useEffect(() => {
    setMounted(true);
    fetchCartData();
  }, []);

  // Tính toán tổng giá trị đơn hàng
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Xử lý tăng số lượng sản phẩm
  const handleIncreaseQuantity = async (item: CartItemResponse) => {
    if (updatingItems[item.productId]) return;

    // Kiểm tra xem còn hàng không
    if (item.quantity >= item.productQuantity) {
      toast.warning(`Chỉ còn ${item.productQuantity} sản phẩm trong kho`);
      return;
    }

    try {
      setUpdatingItems((prev) => ({ ...prev, [item.productId]: true }));

      await CartService.updateCartItem({
        productId: item.productId,
        blogId: item.blogId,
        quantity: item.quantity + 1,
      });

      // Cập nhật state nội bộ
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } catch (error) {
      console.error("Lỗi khi tăng số lượng sản phẩm:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [item.productId]: false }));
    }
  };

  // Xử lý giảm số lượng sản phẩm
  const handleDecreaseQuantity = async (item: CartItemResponse) => {
    if (updatingItems[item.productId]) return;

    if (item.quantity <= 1) {
      toast.info("Số lượng tối thiểu là 1");
      return;
    }

    try {
      setUpdatingItems((prev) => ({ ...prev, [item.productId]: true }));

      await CartService.updateCartItem({
        productId: item.productId,
        blogId: item.blogId,
        quantity: item.quantity - 1,
      });

      // Cập nhật state nội bộ
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } catch (error) {
      console.error("Lỗi khi giảm số lượng sản phẩm:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [item.productId]: false }));
    }
  };

  // Xử lý nhập số lượng sản phẩm trực tiếp
  const handleQuantityChange = async (
    item: CartItemResponse,
    newQuantity: number
  ) => {
    if (updatingItems[item.productId]) return;

    // Kiểm tra giá trị hợp lệ
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    } else if (newQuantity > item.productQuantity) {
      newQuantity = item.productQuantity;
      toast.warning(`Chỉ còn ${item.productQuantity} sản phẩm trong kho`);
    }

    // Nếu số lượng không thay đổi, không cần cập nhật
    if (newQuantity === item.quantity) return;

    try {
      setUpdatingItems((prev) => ({ ...prev, [item.productId]: true }));

      await CartService.updateCartItem({
        productId: item.productId,
        blogId: item.blogId,
        quantity: newQuantity,
      });

      // Cập nhật state nội bộ
      setCartItems((prevItems) =>
        prevItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [item.productId]: false }));
    }
  };

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng của bạn đang trống");
      return;
    }

    setIsProcessingCheckout(true);

    try {
      const response = await PaymentService.checkout({
        address: "Sài Gòn Time", // Địa chỉ mặc định
      });

      // Log thông tin response để debug
      console.log("Thanh toán thành công:", response);

      // Kiểm tra URL chuyển hướng từ API - thêm kiểm tra cụ thể hơn
      if (
        response &&
        response.redirectUrl &&
        response.redirectUrl.trim() !== ""
      ) {
        toast.success("Đang chuyển đến trang thanh toán");

        // Log URL trước khi chuyển hướng
        console.log("Đang chuyển hướng đến:", response.redirectUrl);

        // Chuyển hướng trực tiếp không qua setTimeout để tránh lỗi
        window.location.href = response.redirectUrl;
      } else {
        console.error("URL thanh toán không hợp lệ:", response);
        toast.error("Không nhận được thông tin thanh toán từ hệ thống");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      toast.error("Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.");
    } finally {
      setIsProcessingCheckout(false);
    }
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

  // Hiển thị loader khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center md:text-left">
          Giỏ hàng của bạn
        </h1>
        <div className="w-full flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-doca"></div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="container mx-auto py-6 md:py-10 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center md:text-left">
          Giỏ hàng của bạn
        </h1>
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <p className="text-lg md:text-xl mt-4 mb-6 text-red-600">{error}</p>
          <button
            onClick={fetchCartData}
            className="inline-block bg-pink-doca text-white px-6 py-3 rounded-md hover:bg-pink-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Tính toán các giá trị khi render, không lưu vào state
  const subtotal = calculateSubtotal();
  const total = subtotal; // Không tính phí ship

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center md:text-left">
        Giỏ hàng của bạn
      </h1>

      {cartItems.length === 0 ? (
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
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr
                      key={item.productId}
                      className="border-b border-gray-200"
                    >
                      <td className="py-4 px-2">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <div className="relative w-16 h-16 md:w-20 md:h-20 mr-4 flex-shrink-0">
                              <Image
                                src={item.mainImage || "/images/food-test.png"}
                                alt={item.productName}
                                fill
                                sizes="(max-width: 768px) 64px, 80px"
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-sm md:text-base">
                                {item.productName}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm md:text-base">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className={`px-2 md:px-3 py-1 rounded-l-md ${
                              updatingItems[item.productId] ||
                              item.quantity <= 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            disabled={
                              updatingItems[item.productId] ||
                              item.quantity <= 1
                            }
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
                                parseInt(e.target.value)
                              )
                            }
                            min={1}
                            max={item.productQuantity}
                            disabled={updatingItems[item.productId]}
                          />
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className={`px-2 md:px-3 py-1 rounded-r-md ${
                              updatingItems[item.productId] ||
                              item.quantity >= item.productQuantity
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            disabled={
                              updatingItems[item.productId] ||
                              item.quantity >= item.productQuantity
                            }
                          >
                            +
                          </button>
                          {updatingItems[item.productId] && (
                            <div className="ml-2">
                              <div className="animate-spin h-4 w-4 border-2 border-pink-doca border-t-transparent rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm md:text-base">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Hiển thị dạng card trên mobile */}
            <div className="md:hidden space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.mainImage || "/images/food-test.png"}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {item.productName}
                      </h3>
                      <div className="mt-2 flex flex-wrap justify-between">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Giá:</span>{" "}
                          {formatPrice(item.price)}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center w-full">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className={`w-8 h-8 flex items-center justify-center rounded-l-md ${
                              updatingItems[item.productId] ||
                              item.quantity <= 1
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            disabled={
                              updatingItems[item.productId] ||
                              item.quantity <= 1
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            className="w-10 h-8 text-center border-gray-200 border-y text-sm"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item,
                                parseInt(e.target.value)
                              )
                            }
                            min={1}
                            max={item.productQuantity}
                            disabled={updatingItems[item.productId]}
                          />
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className={`w-8 h-8 flex items-center justify-center rounded-r-md ${
                              updatingItems[item.productId] ||
                              item.quantity >= item.productQuantity
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                            disabled={
                              updatingItems[item.productId] ||
                              item.quantity >= item.productQuantity
                            }
                          >
                            +
                          </button>
                          {updatingItems[item.productId] && (
                            <div className="ml-2">
                              <div className="animate-spin h-4 w-4 border-2 border-pink-doca border-t-transparent rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 font-medium text-sm text-right">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phần tóm tắt đơn hàng */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isProcessingCheckout || cartItems.length === 0}
                className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
                  isProcessingCheckout || cartItems.length === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-pink-doca hover:bg-pink-600"
                }`}
              >
                {isProcessingCheckout ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Thanh toán"
                )}
              </button>
              <div className="mt-4">
                <Link
                  href="/shop"
                  className="block w-full text-center py-2 text-sm text-pink-doca hover:underline"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
