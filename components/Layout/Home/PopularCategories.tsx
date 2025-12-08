"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Imported local images
import art from "@/app/images/art.png";
import food from "@/app/images/food.png";
import { useRouter } from "next/navigation";

const categories = [
  { name: "FOOD", image: food },
  { name: "ART", image: art },
  { name: "ADVENTURE", image: "/images/categories/adventure.jpg" },
  { name: "HISTORY", image: "/images/categories/history.jpg" },
  { name: "NIGHTLIFE", image: "/images/categories/nightlife.jpg" },
  { name: "SHOOPPING", image: "/images/categories/shopping.jpg" },
  { name: "HERITAGE", image: "/images/categories/heritage.jpg" },
  { name: "Other", image: "/images/categories/other.jpg" },
];



const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as any },
  }),
};




export default function PopularCategories() {

  const router = useRouter()
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="
            text-3xl md:text-4xl font-bold text-center mb-12
            bg-linear-to-br from-blue-600 to-indigo-500 bg-clip-text text-transparent
          "
        >
          Popular Categories
        </h2>

  

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              onClick={()=>router.push(`/tours?category=${cat.name}`)}
              className="
                group relative rounded-xl overflow-hidden shadow-md cursor-pointer
                hover:shadow-xl transition-all duration-500
              "
            >
              {/* Image wrapper */}
              <div className="relative h-44 w-full">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="
                    object-center
                    group-hover:scale-110 transition-transform duration-700
                  "
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

              {/* Title */}
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold text-lg tracking-wide drop-shadow-md">
                  {cat.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
