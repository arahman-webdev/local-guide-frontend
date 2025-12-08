'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Demo Data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Williams',
    role: 'Tourist from USA',
    rating: 5,
    quote: "Exploring Bangladesh through local eyes was a life-changing experience. The food tour in Old Dhaka introduced me to flavors I never knew existed!",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=400&auto=format&fit=crop&q=80',
    location: 'Dhaka Food Tour',
    date: 'January 2024',
    isFeatured: false,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Travel Blogger',
    rating: 5,
    quote: "The Sundarbans tour was absolutely breathtaking. Our local guide's knowledge of the mangrove ecosystem made the experience unforgettable. Highly recommended!",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    location: 'Sundarbans Adventure',
    date: 'December 2023',
    isFeatured: true,
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Photographer',
    rating: 5,
    quote: "As a photographer, the Hill Tracts tour provided incredible opportunities. The local guide knew all the perfect spots for sunrise and sunset shots!",
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=80',
    location: 'Hill Tracts Photography Tour',
    date: 'November 2023',
    isFeatured: false,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'History Enthusiast',
    rating: 5,
    quote: "The historical tour of Sonargaon was incredibly insightful. The guide's passion for preserving Bangladeshi heritage was truly inspiring.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    location: 'Sonargaon Heritage Tour',
    date: 'October 2023',
    isFeatured: false,
  },
  {
    id: 5,
    name: 'Fatima Ahmed',
    role: 'Local Explorer',
    rating: 5,
    quote: "Even as a local, I discovered hidden gems in my own city through this platform. The boat tour in Barisal was a magical experience!",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80',
    location: 'Barisal River Tour',
    date: 'September 2023',
    isFeatured: true,
  },
  {
    id: 6,
    name: 'Rajiv Sharma',
    role: 'Nature Lover',
    rating: 5,
    quote: "The Cox's Bazar beach cleanup tour combined tourism with purpose. Meeting local conservationists was a highlight of my trip to Bangladesh.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    location: 'Cox\'s Bazar Eco Tour',
    date: 'August 2023',
    isFeatured: false,
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );
};

export default function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const itemsPerView = typeof window !== 'undefined' ? (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1) : 3;

  const totalSlides = Math.ceil(testimonials.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, currentIndex]);

  // Handle responsive items per view
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerView = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      const newTotalSlides = Math.ceil(testimonials.length / newItemsPerView);
      if (currentIndex >= newTotalSlides) {
        setCurrentIndex(newTotalSlides - 1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  // Get visible testimonials based on current index
  const visibleTestimonials = testimonials.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  );

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-white to-blue-50/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Traveler Stories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              Experiences That Inspire
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover what travelers are saying about their authentic adventures
            with our local guides across Bangladesh
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-3xl mx-auto">
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '2K+', label: 'Happy Travelers' },
            { value: '98%', label: 'Would Recommend' },
            { value: '500+', label: 'Local Guides' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Slider Container */}
        <div 
          className="relative mb-12"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full w-12 h-12 bg-white shadow-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
            size="icon"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </Button>

          <Button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full w-12 h-12 bg-white shadow-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
            size="icon"
          >
            <ChevronRight className="w-6 h-6 text-blue-600" />
          </Button>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-0">
            {visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="relative">
                {/* Featured Badge */}
                {testimonial.isFeatured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full text-white text-xs font-bold shadow-lg">
                      <Award className="w-4 h-4" />
                      <span>Featured Review</span>
                    </div>
                  </div>
                )}

                <Card className="h-full border-none shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* linear Border */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-cyan-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 h-full flex flex-col">
                    {/* Quote Icon */}
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Quote className="w-7 h-7 text-blue-600" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                      <RatingStars rating={testimonial.rating} />
                    </div>

                    {/* Quote Text */}
                    <p className="text-gray-700 text-lg italic leading-relaxed mb-6 flex-1">
                      "{testimonial.quote}"
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent my-6"></div>

                    {/* Reviewer Info */}
                    <div className="flex items-center">
                      <div className="relative mr-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                        />
                        {/* Verified Badge */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                            <p className="text-sm text-blue-600 font-medium">{testimonial.role}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">{testimonial.date}</div>
                          </div>
                        </div>
                        
                        {/* Location */}
                        <div className="mt-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">{testimonial.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Slider Dots */}
        <div className="flex justify-center items-center gap-3 mb-12">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? 'w-8 h-3 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full'
                  : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-block bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Create Your Own Story?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered the authentic beauty of Bangladesh with local experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href={'/tours'}>
              <Button className="px-8 py-6 rounded-xl text-lg font-semibold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Browse All Tours
              </Button>
             </Link>
              <Button variant="outline" className="px-8 py-6 rounded-xl text-lg font-semibold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                Read More Stories
              </Button>
            </div>
          </div>
        </div>
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
      `}</style>
    </section>
  );
}