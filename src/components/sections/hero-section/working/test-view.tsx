"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Urna Cras Et Mauris Congue Nunc Nisi Nec Tempus Cursus",
    date: "24 May, 2024",
    image: "/images/blog1.png",
  },
  {
    id: 2,
    title: "Id Tellus Dignissim Eu Nisi Aliquam. Massa Id Interdum",
    date: "24 May, 2024",
    image: "/images/blog2.png",
  },
  {
    id: 3,
    title: "Mus Cursus Pellentesque Blandit Tortor Suspendisse Ornare",
    date: "24 May, 2024",
    image: "/images/blog3.png",
  },
];

const products = [
  {
    id: 1,
    name: "Premium Dog Food",
    price: "$19.99",
    image: "/images/product1.png",
  },
  {
    id: 2,
    name: "Premium Cat Food",
    price: "$19.99",
    image: "/images/product2.png",
  },
  {
    id: 3,
    name: "Premium Dog Food",
    price: "$19.99",
    image: "/images/product3.png",
  },
];

export default function BlogProducts() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Blog</h2>
      <div className="flex gap-6 mb-10">
        {blogs.map((blog) => (
          <Card key={blog.id} className="w-1/3">
            <div className="relative">
              <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs rounded">
                News
              </span>
              <Image
                src={blog.image}
                alt={blog.title}
                width={300}
                height={200}
                className="rounded-lg"
              />
            </div>
            <CardContent>
              <p className="text-sm text-gray-500">{blog.date}</p>
              <h3 className="font-semibold text-lg">{blog.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Featured products</h2>
      <div className="flex gap-6">
        {products.map((product) => (
          <Card key={product.id} className="w-1/3 p-4">
            <div className="relative bg-gray-200 rounded-lg h-40 flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="opacity-50"
              />
            </div>
            <CardContent className="flex justify-between items-center mt-4">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-500">{product.price}</p>
              </div>
              <Heart className="text-gray-400 hover:text-red-500 cursor-pointer" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
