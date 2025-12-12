"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Globe, 
  Users, 
  Shield, 
  Award, 
  Heart, 
  Star, 
  MapPin, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Target,
  Compass,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function About() {
  const stats = [
    { value: "5000+", label: "Happy Travelers", icon: Users },
    { value: "300+", label: "Expert Guides", icon: Globe },
    { value: "50+", label: "Destinations", icon: MapPin },
    { value: "98%", label: "Satisfaction Rate", icon: Star }
  ];

  const values = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "We connect travelers with local guides who share genuine cultural insights and hidden gems."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "All our guides are verified, background-checked, and trained in safety protocols."
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "Every experience is curated to meet our high standards for memorable adventures."
    },
    {
      icon: Users,
      title: "Community",
      description: "We build meaningful connections between travelers and local communities."
    }
  ];

  const team = [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "Former travel journalist with 15+ years of exploring hidden gems worldwide."
    },
    {
      name: "Sarah Chen",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b786d49d?w=400&h=400&fit=crop&crop=face",
      bio: "Tourism management expert with a passion for sustainable travel."
    },
    {
      name: "Marcus Rodriguez",
      role: "Guide Relations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Former adventure guide turned advocate for local tourism professionals."
    }
  ];

  const achievements = [
    {
      title: "Travel Excellence Award 2023",
      icon: Trophy,
      description: "Recognized for outstanding tourism innovation"
    },
    {
      title: "Sustainable Tourism Partner",
      icon: Globe,
      description: "Certified eco-friendly travel platform"
    },
    {
      title: "Top Rated Platform",
      icon: Star,
      description: "4.9/5 rating from thousands of travelers"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-blue-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-900 via-purple-900 to-cyan-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Compass className="h-5 w-5" />
              <span className="text-sm font-medium">Since 2020</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Redefining
              <span className="block bg-linear-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Travel Experiences
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              We connect passionate travelers with expert local guides for authentic,
              unforgettable adventures around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl"
                asChild
              >
                <Link href="/tours">
                  Explore Tours
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
                asChild
              >
                <Link href="/become-guide">
                  Become a Guide
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative bg-white/10 backdrop-blur-md border-t border-white/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-r from-cyan-400 to-blue-400 rounded-xl mb-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={fadeInUp as {}}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] relative">
                  <Image
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=800&fit=crop"
                    alt="Travelers exploring with local guide"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Trusted by travelers worldwide</p>
                        <p className="text-sm text-gray-600">Join thousands of happy adventurers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp as {}}>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full mb-4">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Our Journey</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story: Where Passion Meets Purpose
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded by a group of travel enthusiasts who believed tourism should benefit both 
                travelers and local communities, TourGuide Pro was born from a simple idea: 
                <span className="font-semibold text-blue-600"> authentic experiences create lasting memories.</span>
              </p>
              <p className="text-gray-600 mb-8">
                We noticed that many travelers were missing out on genuine local interactions. 
                At the same time, knowledgeable locals lacked platforms to share their expertise. 
                By bridging this gap, we've created a global community where every tour tells a story 
                and every guide becomes a friend.
              </p>
              
              <div className="space-y-4">
                {[
                  "Verified local guides with deep cultural knowledge",
                  "Personalized experiences tailored to your interests",
                  "Sustainable tourism that supports local communities",
                  "24/7 support and safety assurance"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-linear-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from selecting guides to designing experiences
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeInUp as {}}
                  className="group"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full group-hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

    


      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-linear-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-12 text-center text-white overflow-hidden relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of travelers who've discovered authentic experiences with local experts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl"
                  asChild
                >
                  <Link href="/tours">
                    Discover Tours
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
                  asChild
                >
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}