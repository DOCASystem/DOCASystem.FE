import React from "react";

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
  // Tính toán các trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    // Luôn hiển thị trang hiện tại, 1 trang trước và 1 trang sau nếu có
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center mt-6 ${className}`}>
      <nav className="flex items-center space-x-1">
        {/* Nút Previous */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-pink-100"
          }`}
        >
          &laquo;
        </button>

        {/* Hiển thị trang đầu tiên nếu không nằm trong danh sách */}
        {!getPageNumbers().includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded-md hover:bg-pink-100"
            >
              1
            </button>
            {getPageNumbers()[0] > 2 && <span className="px-2 py-1">...</span>}
          </>
        )}

        {/* Các số trang */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? "bg-pink-doca text-white"
                : "hover:bg-pink-100"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Hiển thị trang cuối cùng nếu không nằm trong danh sách */}
        {!getPageNumbers().includes(totalPages) && totalPages > 1 && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="px-2 py-1">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1 rounded-md hover:bg-pink-100"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Nút Next */}
        <button
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-pink-100"
          }`}
        >
          &raquo;
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
