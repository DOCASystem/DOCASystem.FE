/**
 * Định dạng thời gian từ timestamp thành chuỗi "thời gian trước đây"
 * @param timestamp Timestamp dưới dạng milliseconds
 * @returns Chuỗi thời gian tương đối (vd: "5 phút trước")
 */
export function formatDistanceToNow(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  // Chuyển đổi thành các đơn vị thời gian
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Trả về chuỗi tương ứng
  if (seconds < 60) {
    return `${seconds} giây trước`;
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else if (days < 30) {
    return `${days} ngày trước`;
  } else {
    // Nếu quá lâu, hiển thị ngày tháng đầy đủ
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

/**
 * Định dạng ngày tháng thành chuỗi dễ đọc
 * @param date Date object hoặc timestamp
 * @returns Chuỗi ngày tháng định dạng
 */
export function formatDate(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;

  return dateObj.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Định dạng ngày tháng giờ phút thành chuỗi dễ đọc
 * @param date Date object hoặc timestamp
 * @returns Chuỗi ngày tháng giờ phút định dạng
 */
export function formatDateTime(date: Date | number): string {
  const dateObj = typeof date === "number" ? new Date(date) : date;

  return dateObj.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
