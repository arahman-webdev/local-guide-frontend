"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";

const guides = [
  {
    name: "John Carter",
    city: "Paris, France",
    rating: 4.9,
    tours: 120,
    image: "https://i.ibb.co/Q3sKvhRc/react-js.png",
  },
  {
    name: "Aisha Rahman",
    city: "Bangkok, Thailand",
    rating: 4.8,
    tours: 98,
    image: "https://i.ibb.co/Q3sKvhRc/react-js.png",
  },
  {
    name: "Michael Smith",
    city: "New York, USA",
    rating: 5.0,
    tours: 150,
    image: "/images/guides/guide3.jpg",
  },
];

console.log(guides[0].image)

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

export default function TopRatedGuide() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            text-3xl md:text-4xl font-bold text-center mb-14
            bg-linear-to-br from-blue-700 to-fuchsia-500 bg-clip-text text-transparent
          "
        >
          Top-Rated Guides
        </motion.h2>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.name}
              custom={i}
              variants={cardVariants as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                rounded-2xl overflow-hidden shadow-md bg-white 
                group hover:shadow-xl transition-all duration-500 cursor-pointer
              "
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={guide.image}
                  alt={guide.name}
                  fill
                  className="
                    object-cover
                    group-hover:scale-110 transition-transform duration-700
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-[#DEE4FD] backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <Star className="text-yellow-500" size={16} />
                  <span className="font-semibold text-blue-900">{guide.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900">{guide.name}</h3>
                <p className="text-gray-600">{guide.city}</p>

                <p className="text-gray-500 mt-2 text-sm">
                  {guide.tours}+ Tours Completed
                </p>

                <button className="
                  mt-4 w-full py-2 rounded-xl font-semibold
                  bg-blue-600 text-white hover:bg-blue-700 transition
                ">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
