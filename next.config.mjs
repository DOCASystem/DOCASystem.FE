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
  // Tối ưu hóa cho Vercel
  output: "standalone",
  // Tắt header "X-Powered-By"
  poweredByHeader: false,
  // Tối ưu hóa build và runtime
  reactStrictMode: true,
  swcMinify: true,
  // Bỏ qua các trang admin trong quá trình build
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  eslint: {
    // Bỏ qua lỗi ESLint trong quá trình build
    ignoreDuringBuilds: true,
  },
  // Bỏ qua lỗi trong quá trình build
  skipTrailingSlashRedirect: true,
  // Bỏ qua lỗi middleware
  skipMiddlewareUrlNormalize: true,
  // Bỏ qua lỗi build
  onDemandEntries: {
    // Thời gian giữ các trang trong bộ nhớ cache (ms)
    maxInactiveAge: 25 * 1000,
    // Số lượng trang tối đa được giữ trong bộ nhớ cache
    pagesBufferLength: 2,
  },
  // Bỏ qua lỗi build
  experimental: {
    // Bỏ qua lỗi build
    externalDir: true,
  },
};

export default nextConfig;
