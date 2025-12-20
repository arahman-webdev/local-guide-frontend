"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Star, ArrowRight, Calendar, Globe } from "lucide-react"
import { useState } from "react"

// Replace with your actual images
import parisImage from "@/app/images/paris.webp"
import bangkokImage from "@/app/images/bankok.jpg"
import newyorkImage from "@/app/images/newyork.jpg"
import tokyoImage from "@/app/images/Tokyo-scaled.jpg"

const featuredCities = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    image: parisImage,
    tours: 42,
    rating: 4.8,
    reviews: 1250,

    priceRange: "Premium",
    season: "Spring/Fall",

    highlight: "Eiffel Tower Experience"
  },
  {
    id: 2,
    name: "Bangkok",
    country: "Thailand",
    image: bangkokImage,
    tours: 38,
    rating: 4.7,
    reviews: 980,

    priceRange: "Affordable",
    season: "Nov-Feb",
 
    highlight: "Grand Palace Tour"
  },
  {
    id: 3,
    name: "New York",
    country: "USA",
    image: newyorkImage,
    tours: 56,
    rating: 4.9,
    reviews: 2100,

    priceRange: "Luxury",
    season: "Year-round",

    highlight: "Broadway Show Package"
  },
  {
    id: 4,
    name: "Tokyo",
    country: "Japan",
    image: tokyoImage,
    tours: 35,
    rating: 4.6,
    reviews: 890,
 
    priceRange: "Premium",
    season: "Spring/Autumn",
  
    highlight: "Sushi Masterclass"
  },
]

export default function FeaturedDestinations() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100 mb-6"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-semibold text-sm">WORLD-CLASS DESTINATIONS</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Extraordinary</span> Cities
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Curated travel experiences designed by local experts. Each destination offers unique 
              cultural immersion, adventure, and unforgettable memories.
            </p>
          </motion.div>
        </div>

        {/* Stats Bar */}
     

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCities.map((city, index) => (
            <motion.div
              key={city.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1]
              }}
              viewport={{ once: true, margin: "-50px" }}
              onMouseEnter={() => setHoveredCard(city.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-blue-200">
                
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    className="h-full w-full"
                    animate={{ scale: hoveredCard === city.id ? 1.05 : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={city.image}
                      alt={`${city.name}, ${city.country}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      priority={index < 2}
                    />
                  </motion.div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <motion.div
                      className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20"
                      animate={{ y: hoveredCard === city.id ? 0 : -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold text-sm ml-1">{city.rating}</span>
                      <span className="text-white/80 text-xs ml-1">({city.reviews})</span>
                    </motion.div>
                    
                    <motion.div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold"
                      animate={{ y: hoveredCard === city.id ? 0 : -5 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {city.priceRange}
                    </motion.div>
                  </div>

                  {/* Highlight Badge */}
                  <motion.div
                    className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500/90 to-indigo-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                  >
                    <div className="text-xs opacity-90">Featured Experience</div>
                    <div className="text-sm font-semibold">{city.highlight}</div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-500">{city.country}</span>
                    <span className="text-gray-300 mx-2">•</span>
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-500">{city.season}</span>
                  </div>

                  {/* City Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {city.name}
                  </h3>

                  {/* Description */}
              


                  {/* Stats & CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Available Tours</div>
                      <div className="text-lg font-bold text-gray-900">{city.tours}+</div>
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={`/destinations/${city.id}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 group/btn"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400/30 pointer-events-none transition-colors duration-300" />
              </div>

              {/* Floating Duration Badge */}
           
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            {/* Background glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl rounded-full"></div>
            
            <Link
              href="/destinations"
              className="relative inline-flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-2xl hover:shadow-2xl transition-all duration-300 group/cta border border-gray-800"
            >
              <span className="text-lg">Explore All 80+ Destinations</span>
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <p className="text-gray-500 mt-6 text-sm">
            ✈️ 24/7 support • Best price guarantee • Flexible cancellation
          </p>
        </motion.div>
      </div>
    </section>
  )
}