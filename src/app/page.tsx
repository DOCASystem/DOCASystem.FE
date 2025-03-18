import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { RecommendedProducts } from "@/components/product/recommended-products";
import { FeaturedBlogs } from "@/components/blog/featured-blogs";
import { PetCategories } from "@/components/navigation/pet-categories";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "DOCA Pet Care | Help Your Pets Live Their Best Lives",
  description:
    "Shop pet care products and learn how to take better care of your furry friends with our expert guides.",
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-50 to-purple-50 pt-12 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Help Your Pets Live Their{" "}
              <span className="text-pink-doca">Best Lives</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Every purchase supports animal welfare. Shop quality products
              paired with expert care guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="w-full sm:w-auto px-8 py-3">
                  Shop Products
                </Button>
              </Link>
              <Link href="/blog">
                <Button className="w-full sm:w-auto px-8 py-3 bg-white text-pink-doca border border-pink-doca hover:bg-pink-50">
                  Read Care Guides
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/hero-pets.jpg"
                alt="Happy pet with owner"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-yellow-300 rounded-full opacity-20"></div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-pink-doca rounded-full opacity-10"></div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-doca">1200+</p>
              <p className="text-gray-600 text-sm">Quality Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-doca">300+</p>
              <p className="text-gray-600 text-sm">Care Guides</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-doca">10K+</p>
              <p className="text-gray-600 text-sm">Happy Pets</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-doca">$50K+</p>
              <p className="text-gray-600 text-sm">Donated</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Shop by Pet Type
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We have products and care guides for all types of pets, find
              exactly what your furry (or scaly) friend needs!
            </p>
          </div>
          <PetCategories />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Top-rated products to care for your pets
              </p>
            </div>
            <Link
              href="/products"
              className="text-pink-doca font-medium hover:underline"
            >
              View All Products
            </Link>
          </div>
          <RecommendedProducts />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shopping with DOCA Pet Care means your purchases help animals in
              need
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Shop Products
              </h3>
              <p className="text-gray-600">
                Browse our selection of high-quality pet care products for all
                types of pets.
              </p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Get Care Tips
              </h3>
              <p className="text-gray-600">
                Each product comes with expert care guides to help you take
                better care of your pets.
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Support Animals
              </h3>
              <p className="text-gray-600">
                A portion of every purchase goes to animal welfare organizations
                helping pets in need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Pet Care Guides
              </h2>
              <p className="text-gray-600">
                Expert advice for taking care of your pets
              </p>
            </div>
            <Link
              href="/blog"
              className="text-pink-doca font-medium hover:underline"
            >
              View All Guides
            </Link>
          </div>
          <FeaturedBlogs />
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              At DOCA Pet Care, we believe every pet deserves the best care
              possible. Through our unique model of pairing quality products
              with expert care guides, we&apos;re helping pet parents provide
              better lives for their furry family members while supporting
              animal welfare initiatives.
            </p>
            <div className="flex justify-center">
              <Link href="/about">
                <Button className="px-6 py-3">Learn More About Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
