"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/hooks/use-product";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui";
import { useBlogById } from "@/hooks/use-blog";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "featured" | "compact" | "cart";
  className?: string;
  showRelatedBlog?: boolean;
}

export default function ProductCard({
  product,
  variant = "default",
  className = "",
  showRelatedBlog = false,
}: ProductCardProps) {
  const cart = useCart();
  const { blog, isLoading: isBlogLoading } = useBlogById(
    showRelatedBlog && product.associatedBlogId ? product.associatedBlogId : ""
  );
  const showBlog =
    showRelatedBlog && product.associatedBlogId && blog && !isBlogLoading;

  // Format price with discount if available
  const formatPrice = (price: number, discount?: number) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

    if (!discount) return formattedPrice;

    const discountedPrice = price * (1 - discount / 100);
    const formattedDiscountedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(discountedPrice);

    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold">{formattedDiscountedPrice}</span>
        <span className="text-gray-500 line-through text-sm">
          {formattedPrice}
        </span>
        <span className="text-green-600 text-sm">-{discount}%</span>
      </div>
    );
  };

  // Handle add to cart
  const handleAddToCart = () => {
    cart.addItem(product, 1);
  };

  // Associated blog component
  const AssociatedBlog = () => {
    if (!showBlog) return null;

    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-1">Related care guide:</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="text-sm text-pink-doca hover:underline flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="line-clamp-1">{blog.title}</span>
        </Link>
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-4 p-3 border rounded-lg ${className}`}
      >
        <div className="flex-shrink-0">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={80}
            height={80}
            className="rounded-md object-cover w-[80px] h-[80px]"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-base line-clamp-1 hover:text-pink-doca transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="mt-1">
            {formatPrice(product.price, product.discountPercentage)}
          </div>
          {product.stock > 0 ? (
            <p className="text-green-600 text-xs mt-1">In Stock</p>
          ) : (
            <p className="text-red-600 text-xs mt-1">Out of Stock</p>
          )}
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="px-3 py-1 text-sm"
        >
          Add
        </Button>
      </div>
    );
  }

  if (variant === "cart") {
    return (
      <div className={`flex items-center gap-4 p-4 ${className}`}>
        <div className="flex-shrink-0">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={60}
            height={60}
            className="rounded-md object-cover w-[60px] h-[60px]"
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-base line-clamp-1 hover:text-pink-doca transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="mt-1">
            {formatPrice(product.price, product.discountPercentage)}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={`grid md:grid-cols-5 gap-6 p-4 border rounded-xl ${className}`}
      >
        <div className="md:col-span-3 relative">
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={600}
            height={400}
            className="rounded-lg object-cover w-full h-full"
            priority
          />
          {product.discountPercentage && (
            <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col">
          <div className="flex gap-2 mb-3">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {product.category}
            </span>
            {product.petType.slice(0, 1).map((pet) => (
              <span
                key={pet}
                className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
              >
                {pet}
              </span>
            ))}
          </div>
          <Link href={`/products/${product.id}`} className="group">
            <h2 className="text-2xl font-bold group-hover:text-pink-doca transition-colors">
              {product.title}
            </h2>
          </Link>
          <div className="mt-2 text-lg">
            {formatPrice(product.price, product.discountPercentage)}
          </div>
          <p className="text-gray-700 mt-3 line-clamp-3">
            {product.description}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="px-6"
            >
              Add to Cart
            </Button>
            <Link
              href={`/products/${product.id}`}
              className="text-pink-doca hover:underline font-medium"
            >
              View Details
            </Link>
          </div>
          <AssociatedBlog />
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`border rounded-xl overflow-hidden ${className}`}>
      <div className="relative overflow-hidden h-48">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={300}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        {product.discountPercentage && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {product.petType.slice(0, 1).map((pet) => (
            <span
              key={pet}
              className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
            >
              {pet}
            </span>
          ))}
        </div>
        <Link href={`/products/${product.id}`} className="group">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-pink-doca transition-colors">
            {product.title}
          </h3>
        </Link>
        <div className="mt-2">
          {formatPrice(product.price, product.discountPercentage)}
        </div>
        <p className="text-gray-700 text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="px-3 py-1 text-sm"
          >
            Add to Cart
          </Button>
        </div>
        <AssociatedBlog />
      </div>
    </div>
  );
}
