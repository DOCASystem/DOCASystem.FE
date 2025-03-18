"use client";

import { useFeaturedProducts } from "@/hooks/use-product";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui";

export function RecommendedProducts() {
  const { featuredProducts, isLoading, isError } = useFeaturedProducts();

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }

  // If no featured products available
  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          No featured products available at the moment.
        </p>
      </div>
    );
  }

  // Show featured products
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.slice(0, 4).map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showRelatedBlog={true}
        />
      ))}
    </div>
  );
}
