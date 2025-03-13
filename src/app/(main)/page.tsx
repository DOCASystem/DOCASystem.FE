"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import CardProduct from "@/components/common/card/card-product/card-food";
import { mockProducts } from "@/mock/products";
import { mockBlogs } from "@/mock/blogs";

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 3);
  const latestBlogs = mockBlogs.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto py-20 px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 pl-10">
            <h1 className="text-[45px] font-semibold text-pink-doca">
              Chúng em cần yêu thương, một chút tấm lòng nhỏ.
            </h1>
            <p className="text-lg text-gray-600">
              Để một con vật cảm thấy an toàn và hạnh phúc, tình yêu thương và
              sẻ chia là điều vô cùng quan trọng.
            </p>
            <div className="pt-6 flex flex-wrap gap-4">
              <Link href="/shop">
                <Button className="bg-pink-doca text-white hover:bg-pink-600 transition-colors">
                  Mua sắm ngay
                </Button>
              </Link>
              <Link href="/service-doca">
                <Button className="bg-white text-pink-doca border border-pink-doca rounded-lg hover:bg-pink-50 transition-colors">
                  Dịch vụ
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative h-[400px] md:h-[500px]">
            <Image
              src="/images/pet-love.png"
              alt="Pet love"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Thống kê và giới thiệu ngắn */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-16">
            <div className="p-6 rounded-lg shadow-md bg-pink-50 hover:scale-105 transition-transform">
              <h3 className="text-4xl font-bold text-pink-doca mb-2">5000+</h3>
              <p className="text-gray-600">Khách hàng hài lòng</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-purple-50 hover:scale-105 transition-transform">
              <h3 className="text-4xl font-bold text-pink-doca mb-2">200+</h3>
              <p className="text-gray-600">Sản phẩm chất lượng</p>
            </div>
            <div className="p-6 rounded-lg shadow-md bg-blue-50 hover:scale-105 transition-transform">
              <h3 className="text-4xl font-bold text-pink-doca mb-2">24/7</h3>
              <p className="text-gray-600">Hỗ trợ khách hàng</p>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Về Doca Pet Shop</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp đa dạng các sản phẩm thức ăn thú cưng với chất
              lượng cao. Qua đó giúp đỡ các bé có hoàn cảnh khó khăn có thể được
              chăm sóc tốt hơn.
            </p>
            <div className="mt-8">
              <Link href="/about-us">
                <Button className="bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những sản phẩm chăm sóc thú cưng tốt nhất của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="hover:-translate-y-2 transition-transform duration-300"
              >
                <CardProduct product={product} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop">
              <Button className="bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors">
                Xem Thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dịch vụ */}

      {/* Blog */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Bài viết mới nhất</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cập nhật những thông tin về những bé thú cưng mới nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <div
                key={blog.id}
                className="rounded-lg overflow-hidden shadow-md bg-white hover:-translate-y-2 transition-transform duration-300"
              >
                <Link href={`/blog/${blog.id}`}>
                  <div className="relative h-48">
                    <Image
                      src="/images/blog-placeholder.png"
                      alt={blog.name || "Bài viết"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {blog.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.description}
                    </p>
                    <span className="text-pink-doca font-medium">
                      Đọc thêm →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/blog">
              <Button className="bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors">
                Xem thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action / Liên hệ */}
      <section className="py-10 bg-pink-doca text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Bạn cần hỗ trợ?</h2>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-white text-pink-doca rounded-lg hover:bg-gray-100 transition-colors">
                Liên hệ ngay
              </Button>
            </Link>
            <Link href="/about-us">
              <Button className="bg-transparent border border-white text-white  rounded-lg hover:bg-white hover:text-pink-doca transition-colors">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
