"use client";

import Link from "next/link";
import Image from "next/image";

// Define pet categories
const petCategories = [
  {
    id: "dogs",
    name: "Dogs",
    icon: "/images/categories/dog.jpg",
    count: 450,
    bgColor: "bg-amber-50",
  },
  {
    id: "cats",
    name: "Cats",
    icon: "/images/categories/cat.jpg",
    count: 380,
    bgColor: "bg-blue-50",
  },
  {
    id: "birds",
    name: "Birds",
    icon: "/images/categories/bird.jpg",
    count: 120,
    bgColor: "bg-green-50",
  },
  {
    id: "small-pets",
    name: "Small Pets",
    icon: "/images/categories/small-pet.jpg",
    count: 150,
    bgColor: "bg-purple-50",
  },
  {
    id: "fish",
    name: "Fish",
    icon: "/images/categories/fish.jpg",
    count: 180,
    bgColor: "bg-pink-50",
  },
  {
    id: "reptiles",
    name: "Reptiles",
    icon: "/images/categories/reptile.jpg",
    count: 90,
    bgColor: "bg-orange-50",
  },
];

export function PetCategories() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {petCategories.map((category) => (
        <Link
          key={category.id}
          href={`/products?petType=${category.id}`}
          className={`${category.bgColor} rounded-xl p-4 text-center hover:shadow-md transition-shadow duration-300 flex flex-col items-center`}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <Image
              src={category.icon}
              alt={category.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-gray-800">{category.name}</h3>
          <p className="text-xs text-gray-500">{category.count} products</p>
        </Link>
      ))}
    </div>
  );
}
