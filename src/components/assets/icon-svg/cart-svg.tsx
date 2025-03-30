import * as React from "react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { CartService } from "@/service/cart-service";

interface CartIconProps {
  width?: number;
  height?: number;
  viewBox?: string;
  className?: string;
}

const CartIcon: React.FC<CartIconProps> = ({
  width = 24,
  height = 24,
  viewBox = "0 0 24 24",
  className = "text-black hover:text-[#F36]",
  ...props
}) => {
  const [cartCount, setCartCount] = useState(0);

  // Hàm fetch số lượng sản phẩm trong giỏ hàng từ API
  const fetchCartCount = async () => {
    try {
      const cartItems = await CartService.getCart();
      // Đếm số lượng sản phẩm khác nhau trong giỏ hàng (không phải tổng số lượng)
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
      setCartCount(0);
    }
  };

  // Lấy dữ liệu khi component mount và khi store thay đổi
  useEffect(() => {
    fetchCartCount();

    // Đăng ký sự kiện lắng nghe cập nhật giỏ hàng
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "doca-cart-storage") {
        fetchCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Theo dõi sự thay đổi của store để cập nhật UI
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // Khi store thay đổi, cập nhật lại số lượng từ API
    fetchCartCount();
  }, [items]);

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" />
        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" />
        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-doca text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
