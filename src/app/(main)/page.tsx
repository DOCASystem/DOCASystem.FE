"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import CardProduct from "@/components/common/card/card-product/card-food";
import { useState, useEffect } from "react";
import { GetProductDetailResponse } from "@/api/generated";
import { ProductService } from "@/service/product-service";
import { Blog, BlogService } from "@/service/blog-service";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<
    GetProductDetailResponse[]
  >([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchLatestBlogs();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await ProductService.getProducts({
        page: 1,
        size: 3,
      });

      if (response.data.items) {
        setFeaturedProducts(response.data.items);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await BlogService.getBlogs({
        page: 1,
        size: 3,
        sortBy: "createdAt",
        isAsc: false, // Sắp xếp giảm dần theo thời gian tạo
      });

      if (response.data.items) {
        setLatestBlogs(response.data.items);
      }
    } catch (error) {
      console.error("Lỗi khi lấy bài viết mới nhất:", error);
      setLatestBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Hàm lấy URL hình ảnh blog
  const getBlogImageUrl = (blog: Blog): string => {
    try {
      return BlogService.getBlogImageUrl(blog);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return "/images/blog-placeholder.png";
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto py-10 md:py-16 lg:py-20 px-4 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 space-y-4 md:space-y-6 px-4 lg:pl-10 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-[40px] lg:leading-[1.3] font-semibold text-pink-doca">
              Sài Gòn Time - Hơn 650 Sinh Mệnh Cần Bạn!
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              💔 Hơn 650 chiếc bụng đói – cần một bữa ăn.
              <br />
              💔 Hơn 650 đôi mắt ngây thơ – mong chờ một cơ hội.
              <br />
              💔 Hơn 650 trái tim – cần một bàn tay đưa ra giúp đỡ.
            </p>
            <div className="pt-4 md:pt-6 flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4">
              <Link href="/shop">
                <Button className="bg-pink-doca text-white hover:bg-pink-600 transition-colors">
                  Mua sắm ngay
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-white text-pink-doca border border-pink-doca rounded-lg hover:bg-pink-50 transition-colors">
                  Dịch vụ
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] w-full mt-6 lg:mt-0 px-2 sm:px-4">
            <div className="relative h-full w-full">
              <Image
                src="/images/saigon-home.png"
                alt="Saigon Time"
                fill
                className="object-contain rounded-2xl md:rounded-3xl opacity-95"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  maskImage:
                    "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
                }}
                priority
              />
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-3xl"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 60%, rgba(252, 231, 243, 0.5) 100%)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Thống kê và giới thiệu ngắn */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 text-center mb-10 md:mb-16">
            <div className="p-4 md:p-6 rounded-lg shadow-md bg-pink-50 hover:scale-105 transition-transform">
              <h3 className="text-3xl md:text-4xl font-bold text-pink-doca mb-2">
                5000+
              </h3>
              <p className="text-gray-600">Khách hàng hài lòng</p>
            </div>
            <div className="p-4 md:p-6 rounded-lg shadow-md bg-purple-50 hover:scale-105 transition-transform">
              <h3 className="text-3xl md:text-4xl font-bold text-pink-doca mb-2">
                200+
              </h3>
              <p className="text-gray-600">Sản phẩm chất lượng</p>
            </div>
            <div className="p-4 md:p-6 rounded-lg shadow-md bg-blue-50 hover:scale-105 transition-transform sm:col-span-2 md:col-span-1 sm:mx-auto md:mx-0 sm:max-w-xs md:max-w-none">
              <h3 className="text-3xl md:text-4xl font-bold text-pink-doca mb-2">
                24/7
              </h3>
              <p className="text-gray-600">Hỗ trợ khách hàng</p>
            </div>
          </div>

          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
              Về Doca
            </h2>
            <div className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              <p className="mb-4">
                Chúng mình cung cấp đa dạng các sản phẩm thức ăn thú cưng với
                chất lượng cao.
              </p>
              <p>
                Qua đó giúp đỡ các bé có hoàn cảnh khó khăn cần được giúp đỡ tại
                Trạm cứu hộ chó mèo Sài Gòn Time
              </p>
            </div>
            <div className="mt-6 md:mt-8">
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
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Khám phá những sản phẩm chăm sóc thú cưng tốt nhất của Chúng mình
            </p>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-doca"></div>
              </div>
              <p>Đang tải sản phẩm nổi bật...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="hover:-translate-y-2 transition-transform duration-300 mx-auto sm:mx-0 max-w-md w-full"
                  >
                    <CardProduct product={product} />
                  </div>
                ))}
              </div>
            </>
          )}

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
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Bài viết mới nhất
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Cập nhật những thông tin về những bé thú cưng mới nhất
            </p>
          </div>

          {loadingBlogs ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-doca"></div>
              </div>
              <p>Đang tải bài viết mới nhất...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {latestBlogs.length > 0 ? (
                latestBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="rounded-lg overflow-hidden shadow-md bg-white hover:-translate-y-2 transition-transform duration-300 mx-auto sm:mx-0 max-w-md w-full"
                  >
                    <Link href={`/blog/${blog.id}`}>
                      <div className="relative h-40 sm:h-44 md:h-48">
                        <Image
                          src={getBlogImageUrl(blog)}
                          alt={blog.name || "Bài viết"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">
                          {blog.name}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">
                          {blog.description}
                        </p>
                        <span className="text-pink-doca font-medium">
                          Đọc thêm →
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p>Không có bài viết nào.</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8 md:mt-10">
            <Link href="/blog">
              <Button className="bg-pink-doca text-white rounded-lg hover:bg-pink-600 transition-colors">
                Xem thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action / Liên hệ */}
      <section className="py-8 md:py-10 bg-pink-doca text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
            Bạn cần hỗ trợ?
          </h2>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href="/contact">
              <Button className="bg-white text-pink-doca rounded-lg hover:bg-gray-100 transition-colors">
                Liên hệ ngay
              </Button>
            </Link>
            <Link href="/about-us">
              <Button className="bg-transparent border border-white text-white rounded-lg hover:bg-white hover:text-pink-doca transition-colors">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
