import Image from 'next/image';
import { MapPin, Calendar, DollarSign, Users, Star, Clock, Sparkles, Heart, Shield, Award } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TourCardProps {
  tour: any;
}

// Color mapping for categories
const categoryColors: Record<string, { bg: string; text: string; linear: string }> = {
  ADVENTURE: { bg: 'bg-linear-to-r from-emerald-500 to-teal-600', text: 'text-emerald-600', linear: 'from-emerald-500 to-teal-500' },
  CULTURAL: { bg: 'bg-linear-to-r from-amber-500 to-orange-600', text: 'text-amber-600', linear: 'from-amber-500 to-orange-500' },
  FOOD: { bg: 'bg-linear-to-r from-rose-500 to-pink-600', text: 'text-rose-600', linear: 'from-rose-500 to-pink-500' },
  NATURE: { bg: 'bg-linear-to-r from-green-500 to-emerald-600', text: 'text-green-600', linear: 'from-green-500 to-emerald-500' },
  HISTORICAL: { bg: 'bg-linear-to-r from-amber-700 to-yellow-600', text: 'text-amber-700', linear: 'from-amber-700 to-yellow-600' },
  ART: { bg: 'bg-linear-to-r from-purple-500 to-indigo-600', text: 'text-purple-600', linear: 'from-purple-500 to-indigo-500' },
  SHOPPING: { bg: 'bg-linear-to-r from-blue-500 to-cyan-600', text: 'text-blue-600', linear: 'from-blue-500 to-cyan-500' },
  NIGHTLIFE: { bg: 'bg-linear-to-r from-indigo-500 to-violet-600', text: 'text-indigo-600', linear: 'from-indigo-500 to-violet-500' },
  BEACH: { bg: 'bg-linear-to-r from-sky-500 to-blue-500', text: 'text-sky-600', linear: 'from-sky-500 to-blue-500' },
  WILDLIFE: { bg: 'bg-linear-to-r from-lime-500 to-green-600', text: 'text-lime-600', linear: 'from-lime-500 to-green-500' },
  DEFAULT: { bg: 'bg-linear-to-r from-blue-500 to-cyan-600', text: 'text-blue-600', linear: 'from-blue-500 to-cyan-500' },
};

export default function TourCard({ tour }: TourCardProps) {
  const categoryName = typeof tour.category === 'string' 
    ? tour.category 
    : tour.category?.name || tour.category;

  const categoryKey = categoryName?.toUpperCase() || 'DEFAULT';
  const colors = categoryColors[categoryKey] || categoryColors.DEFAULT;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      {/* Favorite Button */}
      <button className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300">
        <Heart className="w-5 h-5 text-gray-400 hover:text-rose-500" />
      </button>

      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={tour.tourImages?.[0]?.imageUrl || '/placeholder-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* linear Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 ${colors.bg} text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2`}>
          <Sparkles className="w-4 h-4" />
          <span className="font-semibold text-sm">{categoryName || 'Tour'}</span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-xl flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold">{tour.averageRating || '4.8'}</span>
          <span className="text-white/80 text-sm ml-1">({tour.reviewCount || 24})</span>
        </div>
        
        {/* Price Tag */}
        <div className="absolute bottom-4 right-4 bg-linear-to-r from-white/95 to-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">৳{tour.fee || tour.tourFee}</span>
            <span className="text-gray-600 text-sm ml-1">/person</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {tour.title}
          </h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{tour.city}, {tour.country}</span>
          </div>
        </div>

     

       

        {/* Guide Info & CTA */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              {tour.user?.profilePic ? (
                <Image
                  src={tour.user.profilePic}
                  alt={tour.user?.name || 'Guide'}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="font-bold text-white text-lg">
                    {tour.user?.name?.charAt(0) || 'G'}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 p-1 bg-linear-to-r from-green-400 to-emerald-500 rounded-full">
                <Shield className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{tour.user?.name || 'Local Guide'}</span>
                
              </div>
              <div className="text-xs text-gray-500">Certified</div>
            </div>
          </div>
          
          <Link href={`/tours/${tour.slug}`} className="group/link">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden bg-linear-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
            >
              <span className="relative z-10 flex items-center gap-2">
                View Details
                <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"></div>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-2xl pointer-events-none transition-colors duration-300"></div>
    </motion.div>
  );
}