"use client"

import Image from "next/image"
import { motion } from "framer-motion"

// Import your real images
import hero1 from "@/app/images/hero-bg.png" 
import hero2 from "@/app/images/hero-bg.png"
import hero3 from "@/app/images/hero-bg.png"

const cities = [
  { name: "Paris", img: hero1 },
  { name: "Bangkok", img: hero2 },
  { name: "New York", img: hero3 },
]

export default function FeaturedSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Featured Cities
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {cities.map(({ name, img }, index) => (
            <motion.div
              key={name}
              className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            >
              {/* Image Wrapper */}
              <div className="relative h-64 w-full overflow-hidden">

                {/* Motion Image */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full w-full group-hover:scale-125 transition-all duration-800"
                >
                  <Image
                    src={img}
                    alt={name}
                    fill
                    className="object-cover "
                    priority
                  />
                </motion.div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t 
                from-blue-600/20 to-black/20 
                group-hover:from-blue-600/80 group-hover:to-blue-600/30
                transition-all duration-300"></div>

                {/* City Title */}
                <motion.div
                  className="absolute bottom-5 left-5 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-2xl font-bold">{name}</h3>
                  <p className="text-sm opacity-90">Explore iconic city spots</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
     
    </section>
  )
}
