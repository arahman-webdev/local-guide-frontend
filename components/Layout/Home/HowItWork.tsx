"use client"

import { MapPin, Star, Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function HowItWork() {
    const steps = [
        {
            icon: <MapPin size={32} />,
            title: "Discover Authentic Experiences",
            desc: "Browse unique, locally curated tours designed by passionate guides. Narrow down your search based on destination, interests, and categories that fit your travel plans.",
        },
        {
            icon: <Users size={32} />,
            title: "Connect & Chat with Guides",
            desc: "Ask questions, discuss trip expectations, and understand what your guide offers. Clear communication helps you build a personalized experience.",
        },
        {
            icon: <Calendar size={32} />,
            title: "Book Effortlessly",
            desc: "Securely book your chosen experience with our seamless booking system. Select dates, confirm your details, and you're all set for an unforgettable adventure.",
        },
        {
            icon: <Star size={32} />,
            title: "Enjoy & Leave a Review",
            desc: "Explore your destination like a true local. After the tour, share your feedback to help future travelers discover trusted guides.",
        },
    ]

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">

                {/* Title */}
                <motion.h2
                    className="text-3xl md:text-4xl font-bold mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    How It Works
                </motion.h2>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-4 gap-4 text-center">

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 group"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.15,
                                ease: "easeOut",
                            }}
                        >
                            {/* Icon */}
                            <div
                                className=" mb-6 bg-[#D8DEFC] inline-block text-blue-600 group-hover:text-white p-3 rounded-xs transition-all duration-600 ease-in-out group-hover:bg-blue-800 group-hover:scale-125"
                           
                            >
                                {step.icon}
                            </div>

       

                            {/* Title */}
                            <h3
                                className="
                            text-xl font-semibold mt-3 mb-2
                            bg-linear-to-br
                            from-[#0b1ae9]
                            to-[color-mix(in_srgb,rgb(11,26,233)_80%,rgb(255,107,107))]
                            bg-clip-text text-transparent"
                            >
                                {step.title}
                            </h3>



                            {/* Description */}
                            <p className="text-gray-600 text-center leading-relaxed">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    )
}
