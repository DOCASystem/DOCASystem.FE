"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/hooks/use-blog";
import { formatDate } from "@/utils/date-formatter";

interface BlogCardProps {
  blog: BlogPost;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export default function BlogCard({
  blog,
  variant = "default",
  className = "",
}: BlogCardProps) {
  // Prepare date string
  const publishedDate = formatDate(blog.publishedAt);

  // Truncate excerpt for different variants
  const truncateExcerpt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const excerptLength =
    variant === "compact" ? 80 : variant === "featured" ? 180 : 120;
  const truncatedExcerpt = truncateExcerpt(blog.excerpt, excerptLength);

  // Determine image sizes based on variant
  const getImageSizes = () => {
    switch (variant) {
      case "featured":
        return {
          width: 800,
          height: 400,
          className: "rounded-lg object-cover w-full h-[400px]",
        };
      case "compact":
        return {
          width: 120,
          height: 120,
          className: "rounded-md object-cover w-[120px] h-[120px]",
        };
      default:
        return {
          width: 400,
          height: 225,
          className: "rounded-lg object-cover w-full h-[225px]",
        };
    }
  };

  const imageProps = getImageSizes();

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-4 p-3 border rounded-lg ${className}`}
      >
        <div className="flex-shrink-0">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={imageProps.width}
            height={imageProps.height}
            className={imageProps.className}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${blog.slug}`}>
            <h3 className="font-medium text-base line-clamp-1 hover:text-pink-doca transition-colors">
              {blog.title}
            </h3>
          </Link>
          <p className="text-gray-500 text-xs mt-1">
            {publishedDate} • {blog.readTime} min read
          </p>
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
            {truncatedExcerpt}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={`grid md:grid-cols-5 gap-6 p-4 border rounded-xl ${className}`}
      >
        <div className="md:col-span-3">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={imageProps.width}
            height={imageProps.height}
            className={imageProps.className}
            priority
          />
        </div>
        <div className="md:col-span-2 flex flex-col justify-center">
          <div className="flex gap-2 mb-3">
            {blog.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {blog.petType.slice(0, 2).map((pet) => (
              <span
                key={pet}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {pet}
              </span>
            ))}
          </div>
          <Link href={`/blog/${blog.slug}`} className="group">
            <h2 className="text-2xl font-bold group-hover:text-pink-doca transition-colors">
              {blog.title}
            </h2>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            By {blog.author.name} • {publishedDate} • {blog.readTime} min read
          </p>
          <p className="text-gray-700 mt-3 line-clamp-3">{truncatedExcerpt}</p>
          <Link
            href={`/blog/${blog.slug}`}
            className="mt-4 inline-flex items-center text-pink-doca font-medium hover:underline"
          >
            Read more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`border rounded-xl overflow-hidden ${className}`}>
      <div className="relative overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          width={imageProps.width}
          height={imageProps.height}
          className={`${imageProps.className} transition-transform duration-300 hover:scale-105`}
        />
        {blog.featured && (
          <span className="absolute top-3 left-3 bg-pink-doca text-white text-xs px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          {blog.petType.slice(0, 1).map((pet) => (
            <span
              key={pet}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
            >
              {pet}
            </span>
          ))}
        </div>
        <Link href={`/blog/${blog.slug}`} className="group">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-pink-doca transition-colors">
            {blog.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs mt-2">
          {publishedDate} • {blog.readTime} min read
        </p>
        <p className="text-gray-700 text-sm mt-2 line-clamp-3">
          {truncatedExcerpt}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            {blog.author.avatar ? (
              <Image
                src={blog.author.avatar}
                alt={blog.author.name}
                width={24}
                height={24}
                className="rounded-full mr-2"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 mr-2"></div>
            )}
            <span className="text-xs text-gray-600">{blog.author.name}</span>
          </div>
          <Link
            href={`/blog/${blog.slug}`}
            className="text-sm text-pink-doca font-medium hover:underline"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
