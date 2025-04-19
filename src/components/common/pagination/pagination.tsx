import React, { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // Đảm bảo currentPage là một số hợp lệ
  const validCurrentPage = useMemo(() => {
    return Math.max(1, Math.min(currentPage, totalPages || 1));
  }, [currentPage, totalPages]);

  // Tính toán các trang cần hiển thị và lưu vào biến để tránh tính toán lại
  const pageNumbers = useMemo(() => {
    const pages = [];
    // Luôn hiển thị trang hiện tại, 1 trang trước và 1 trang sau nếu có
    const startPage = Math.max(1, validCurrentPage - 1);
    const endPage = Math.min(totalPages, validCurrentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }, [validCurrentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center mt-6 ${className}`}>
      <nav className="flex items-center space-x-1">
        {/* Nút Previous */}
        <button
          onClick={() =>
            validCurrentPage > 1 && onPageChange(validCurrentPage - 1)
          }
          disabled={validCurrentPage === 1}
          className={`px-3 py-1 rounded-md ${
            validCurrentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-pink-100"
          }`}
          type="button"
          aria-label="Trang trước"
        >
          &laquo;
        </button>

        {/* Hiển thị trang đầu tiên nếu không nằm trong danh sách */}
        {!pageNumbers.includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`px-3 py-1 rounded-md hover:bg-pink-100`}
              type="button"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-2 py-1">...</span>}
          </>
        )}

        {/* Các số trang */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              validCurrentPage === page
                ? "bg-pink-doca text-white"
                : "hover:bg-pink-100"
            }`}
            type="button"
            aria-current={validCurrentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Hiển thị trang cuối cùng nếu không nằm trong danh sách */}
        {!pageNumbers.includes(totalPages) && totalPages > 1 && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 py-1">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-1 rounded-md hover:bg-pink-100`}
              type="button"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Nút Next */}
        <button
          onClick={() =>
            validCurrentPage < totalPages && onPageChange(validCurrentPage + 1)
          }
          disabled={validCurrentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            validCurrentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-pink-100"
          }`}
          type="button"
          aria-label="Trang sau"
        >
          &raquo;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
