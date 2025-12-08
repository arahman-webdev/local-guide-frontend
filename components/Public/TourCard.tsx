import Image from 'next/image';
import { MapPin, Calendar, DollarSign, Users, Star, Clock } from 'lucide-react';
import Link from 'next/link';

interface TourCardProps {
  tour: any;
}

export default function TourCard({ tour }: TourCardProps) {
  // Fix: Use tour.category directly (it might be a string or object)
  const categoryName = typeof tour.category === 'string' 
    ? tour.category 
    : tour.category?.name || tour.category;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Tour Image */}
      <div className="relative h-56 w-full">
        <Image
          src={tour.tourImages?.[0]?.imageUrl || '/placeholder-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {categoryName || 'Tour'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white text-gray-800 px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {tour.rating || '4.5'}
          </span>
        </div>
      </div>

      {/* Tour Content */}
      <div className="p-5">
        {/* Title and Location */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {tour.title}
        </h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-2" />
          <span className="text-sm">{tour.city}, {tour.country}</span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {tour.description}
        </p>

        {/* Tour Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-700">
            <DollarSign size={18} className="mr-2 text-blue-600" />
            <span className="font-semibold">${tour.fee || tour.tourFee}</span>
            <span className="text-sm text-gray-500 ml-1">/person</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock size={18} className="mr-2 text-blue-600" />
            <span>{tour.duration} hours</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Users size={18} className="mr-2 text-blue-600" />
            <span>Max {tour.maxGroupSize}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Calendar size={18} className="mr-2 text-blue-600" />
            <span>Flexible</span>
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              {tour.user?.profilePic ? (
                <Image
                  src={tour.user.profilePic}
                  alt={tour.user?.name || 'Guide'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <span className="font-bold text-blue-600">
                  {tour.user?.name?.charAt(0) || 'G'}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">By {tour.user?.name || 'Local Guide'}</p>
              <p className="text-sm text-gray-500">Certified Local Guide</p>
            </div>
          </div>
          <Link href={`/tours/${tour.slug}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300">
            View Details
          </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
}