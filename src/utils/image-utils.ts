// Hàm để nén hình ảnh - được tối ưu để giảm thời gian xử lý
export const compressImage = async (
  blob: Blob,
  quality = 0.7
): Promise<Blob> => {
  return new Promise<Blob>((resolve) => {
    try {
      // Kiểm tra kích thước, nếu < 1MB thì không cần nén
      if (blob.size < 1024 * 1024) {
        return resolve(blob);
      }

      const image = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.warn("Không thể lấy context 2d, trả về hình ảnh gốc");
        return resolve(blob);
      }

      const objectUrl = URL.createObjectURL(blob);

      image.onload = () => {
        // Giải phóng URL
        URL.revokeObjectURL(objectUrl);

        // Tính toán kích thước mới (giữ nguyên tỷ lệ)
        const maxDimension = 1000; // Giảm kích thước xuống 1000px
        let width = image.width;
        let height = image.height;

        if (width > height && width > maxDimension) {
          height = Math.floor((height / width) * maxDimension);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.floor((width / height) * maxDimension);
          height = maxDimension;
        }

        // Thiết lập canvas
        canvas.width = width;
        canvas.height = height;

        // Vẽ hình ảnh lên canvas
        ctx.drawImage(image, 0, 0, width, height);

        // Chuyển đổi thành blob với chất lượng thấp hơn
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              console.warn("Nén thất bại, trả về hình ảnh gốc");
              resolve(blob);
            }
          },
          "image/jpeg",
          quality
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        console.warn("Lỗi khi tải hình ảnh, trả về hình ảnh gốc");
        resolve(blob);
      };

      // Bắt đầu quá trình nạp ảnh
      image.src = objectUrl;
    } catch (error) {
      console.warn("Lỗi khi nén hình ảnh:", error);
      resolve(blob); // Trả về hình ảnh gốc thay vì gây lỗi
    }
  });
};
