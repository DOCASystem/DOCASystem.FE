"use client";

import { useFeaturedBlogs } from "@/hooks/use-blog";
import BlogCard from "./blog-card";
import { Skeleton } from "@/components/ui";

export function FeaturedBlogs() {
  const { featuredBlogs, isLoading, isError } = useFeaturedBlogs();

  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-3 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full mr-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
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
          Failed to load blog posts. Please try again later.
        </p>
      </div>
    );
  }

  // If no featured blogs available
  if (featuredBlogs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          No featured blog posts available at the moment.
        </p>
      </div>
    );
  }

  // Display featured blog post at the top
  if (featuredBlogs.length >= 4) {
    return (
      <div className="space-y-6">
        <BlogCard blog={featuredBlogs[0]} variant="featured" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBlogs.slice(1, 4).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    );
  }

  // If fewer than 4 blogs, just show them in a grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {featuredBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
