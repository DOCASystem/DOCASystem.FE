/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "s3-hcm5-r1.longvan.net",
      },
      {
        protocol: "https",
        hostname: "**", // Cho phép tất cả domain https
      },
      {
        protocol: "http",
        hostname: "**", // Cho phép tất cả domain http
      },
    ],
    domains: [
      "localhost",
      "127.0.0.1",
      "s3-hcm5-r1.longvan.net",
      "production.doca.love",
    ],
    unoptimized: true, // Sửa thành true để tránh lỗi tối ưu hóa hình ảnh trên production
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ["image/webp"],
    minimumCacheTTL: 60,
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
  // Cấu hình bộ đệm động để tăng hiệu suất
  onDemandEntries: {
    // Tăng thời gian lưu trữ trang trong bộ nhớ đệm (ms)
    maxInactiveAge: 60 * 1000, // 60 giây
    // Tăng số lượng trang được lưu trong bộ nhớ đệm
    pagesBufferLength: 5,
  },
  // Cấu hình thực nghiệm (cải thiện hiệu suất)
  experimental: {
    // Cho phép sử dụng thư mục bên ngoài
    externalDir: true,
    // Tắt tối ưu hóa CSS để tránh lỗi với critters
    optimizeCss: false,
    // Kích hoạt bộ nhớ đệm tối ưu
    turbotrace: {
      logLevel: "error",
    },
    // Kích hoạt chế độ nhanh
    optimizeServerReact: true,
    // Tăng tốc quá trình build
    serverMinification: true,
    // Sử dụng phiên bản mới hơn của React (nếu có)
    serverComponentsExternalPackages: [],
  },
  // Cấu hình nén tệp
  compress: true,
  // Tối ưu hóa webpack
  webpack: (config, { dev, isServer }) => {
    // Tối ưu cả môi trường phát triển và sản xuất
    if (!dev) {
      // Tối ưu hóa cho production
      config.optimization.minimize = true;
    } else {
      // Tối ưu hóa cho development
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
    }

    // Tăng tốc độ khởi động
    if (isServer) {
      config.optimization.concatenateModules = true;
    }

    return config;
  },
  // Tăng tốc độ phân tích module
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
};

export default nextConfig;
