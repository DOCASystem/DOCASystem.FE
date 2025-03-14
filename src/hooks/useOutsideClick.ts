import { useEffect, RefObject } from "react";

/**
 * Hook để phát hiện khi người dùng nhấp chuột bên ngoài phần tử được tham chiếu
 * @param ref RefObject tham chiếu đến phần tử DOM cần theo dõi
 * @param callback Hàm callback được gọi khi nhấp chuột bên ngoài phần tử
 */
const useOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Thêm event listener khi component mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener khi component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
