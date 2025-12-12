"use client";

import { Star, MapPin, Trophy, CheckCircle, Users } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Guide {
  id: number;
  name: string;
  city: string;
  country: string;
  rating: number;
  reviews: number;
  tours: number;
  specialties: string[];
  languages: string[];
  image: string;
  verified: boolean;
  yearsExperience: number;
}

const guides: Guide[] = [
  {
    id: 1,
    name: "John Carter",
    city: "Paris",
    country: "France",
    rating: 4.9,
    reviews: 128,
    tours: 156,
    specialties: ["Art History", "Food Tours", "Architecture"],
    languages: ["English", "French", "Spanish"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    yearsExperience: 8
  },
  {
    id: 2,
    name: "Aisha Rahman",
    city: "Bangkok",
    country: "Thailand",
    rating: 4.8,
    reviews: 94,
    tours: 98,
    specialties: ["Street Food", "Temples", "Markets"],
    languages: ["English", "Thai", "Mandarin"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b786d49d?w=400&h=400&fit=crop&crop=face",
    verified: true,
    yearsExperience: 6
  },
  {
    id: 3,
    name: "Michael Smith",
    city: "New York",
    country: "USA",
    rating: 5.0,
    reviews: 203,
    tours: 150,
    specialties: ["Skyscrapers", "Broadway", "History"],
    languages: ["English", "Italian"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w-400&h=400&fit=crop&crop=face",
    verified: true,
    yearsExperience: 12
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
  hover: {
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : i < rating
                ? "fill-yellow-400/50 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
        />
      ))}
      <span className="ml-1 font-semibold text-gray-900">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function TopRatedGuide() {
  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-linear-to-r from-blue-500 to-cyan-400 rounded-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Expert Guides
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                Meet Our Top-Rated Guides
              </span>
            </h2>

          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover authentic experiences with our verified local experts who know their cities inside out
          </motion.p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, i) => (
            <motion.div
              key={guide.id}
              custom={i}
              variants={cardVariants as {}}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, margin: "-50px" }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-xl transition-shadow duration-300 h-full">

                {/* Guide Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={guide.image}
                    alt={guide.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* linear Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        Top Rated
                      </span>
                    </div>

                    {guide.verified && (
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                          Verified Guide
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Name & Location */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {guide.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-blue-500 to-cyan-400 rounded-lg">
                          <span className="text-white text-sm font-bold">
                            #{i + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">
                        {guide.city}, {guide.country}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {guide.rating}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {guide.reviews}
                      </div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {guide.yearsExperience}y
                      </div>
                      <div className="text-sm text-gray-600">Experience</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((language) => (
                        <span
                          key={language}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-6">
                    <RatingStars rating={guide.rating} />
                    <div className="text-sm text-gray-600">
                      {guide.tours} tours
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <button className="
                    w-full py-3 px-4 rounded-xl font-semibold
                    bg-linear-to-r from-blue-600 to-cyan-500
                    text-white hover:from-blue-700 hover:to-cyan-600
                    transition-all duration-300 shadow-sm hover:shadow-md
                    flex items-center justify-center gap-2
                    group-hover:shadow-lg
                  ">
                    View Full Profile
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <button className="
            inline-flex items-center gap-3
            px-8 py-4 rounded-xl font-semibold
            bg-linear-to-r from-gray-900 to-blue-900
            text-white hover:from-blue-900 hover:to-gray-900
            transition-all duration-300 shadow-lg hover:shadow-xl
            border border-gray-800
          ">
            <Users className="w-5 h-5" />
            View All 250+ Expert Guides
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}