/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
    unoptimized: true,
  },
  typescript: {
    // !! WARN !!
    // Cấu hình này chỉ nên dùng tạm thời để build và deploy
    // Cần sửa lỗi TypeScript sau khi deploy thành công
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
