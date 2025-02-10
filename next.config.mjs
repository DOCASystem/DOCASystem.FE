/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "res.cloudinary.com"],
    unoptimized: true,
  },
};

export default nextConfig;
