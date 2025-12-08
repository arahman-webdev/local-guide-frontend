"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, MapPin, Users, Clock, Star } from "lucide-react";

// Imported local images
import art from "@/app/images/art.png";
import food from "@/app/images/food.png";

const categories = [
  { 
    name: "FOOD", 
    image: food,
    icon: "🍜",
    description: "Culinary journeys & local flavors",
    count: 156,
    color: "from-orange-500 to-amber-500",
    bgColor: "bg-linear-to-br from-orange-50 to-amber-50"
  },
  { 
    name: "ART", 
    image: art,
    icon: "🎨",
    description: "Creative workshops & galleries",
    count: 89,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-linear-to-br from-purple-50 to-pink-50"
  },
  { 
    name: "ADVENTURE", 
    image: "/images/categories/adventure.jpg",
    icon: "🧗",
    description: "Thrilling outdoor experiences",
    count: 112,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-linear-to-br from-green-50 to-emerald-50"
  },
  { 
    name: "HISTORY", 
    image: "/images/categories/history.jpg",
    icon: "🏛️",
    description: "Ancient sites & heritage walks",
    count: 94,
    color: "from-amber-600 to-yellow-500",
    bgColor: "bg-linear-to-br from-amber-50 to-yellow-50"
  },
  { 
    name: "NIGHTLIFE", 
    image: "/images/categories/nightlife.jpg",
    icon: "🌃",
    description: "Evening entertainment & bars",
    count: 67,
    color: "from-blue-500 to-indigo-500",
    bgColor: "bg-linear-to-br from-blue-50 to-indigo-50"
  },
  { 
    name: "SHOPPING", 
    image: "/images/categories/shopping.jpg",
    icon: "🛍️",
    description: "Local markets & artisan goods",
    count: 78,
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-linear-to-br from-pink-50 to-rose-50"
  },
  { 
    name: "HERITAGE", 
    image: "/images/categories/heritage.jpg",
    icon: "🏯",
    description: "Cultural heritage & traditions",
    count: 103,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-linear-to-br from-teal-50 to-cyan-50"
  },
  { 
    name: "NATURE", 
    image: "/images/categories/other.jpg",
    icon: "🌿",
    description: "Natural wonders & wildlife",
    count: 124,
    color: "from-emerald-500 to-green-500",
    bgColor: "bg-linear-to-br from-emerald-50 to-green-50"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

export default function PopularCategories() {
  const router = useRouter();

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-white to-blue-50/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Explore Experiences
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              Discover by Category
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from curated categories to find the perfect local experience
            that matches your interests
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              variants={cardVariants as {}}
              whileHover="hover"
              onClick={() => router.push(`/tours?category=${cat.name}`)}
              className="group relative cursor-pointer"
            >
              {/* Card Container */}
              <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                {/* Background Image with linear Overlay */}
                <div className="absolute inset-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-linear-to-t ${cat.color} opacity-80 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[280px]">
                  {/* Top Section */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${cat.bgColor} p-3 rounded-xl shadow-lg`}>
                      <span className="text-2xl">{cat.icon}</span>
                    </div>
                    
                    {/* Tour Count Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full"
                    >
                      <span className="text-sm font-bold text-gray-800">
                        {cat.count} tours
                      </span>
                    </motion.div>
                  </div>

                  {/* Category Info */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white">
                      {cat.name}
                    </h3>
                    
                    <p className="text-white/90 text-sm">
                      {cat.description}
                    </p>
                  </div>

                  {/* Bottom Section */}
                  <div className="pt-6 mt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                          <span>4.8</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Small groups</span>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex items-center gap-1 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-white/30 transition-colors duration-300"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Glow */}
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating Label on Hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20"
              >
                <div className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full shadow-lg">
                  <span className="text-xs font-semibold text-white whitespace-nowrap">
                    Click to explore tours
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 shadow-lg max-w-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-6">
              Browse all available tours or contact us for custom experiences tailored to your interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/tours')}
                className="px-8 py-3 rounded-xl text-lg font-semibold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                View All Categories
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="px-8 py-3 rounded-xl text-lg font-semibold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
              >
                Request Custom Tour
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-20"
        >
          <div className="bg-linear-to-r from-blue-600/10 via-cyan-500/10 to-blue-700/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Users, value: '2,000+', label: 'Happy Travelers' },
                { icon: MapPin, value: '50+', label: 'Cities Covered' },
                { icon: Star, value: '4.9/5', label: 'Average Rating' },
                { icon: Clock, value: '24/7', label: 'Support Available' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-lg mb-4">
                    <stat.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}