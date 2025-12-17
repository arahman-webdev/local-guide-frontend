// app/favorites/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  Trash2,
  ArrowRight,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FavoriteTour {
  id: string;
  wishlistId?: string;
  tour: {
    id: string;
    title: string;
    slug:string;
    description: string;
    fee: number;
    duration: string;
    maxGroupSize: number;
    city: string;
    country: string;
    category: string;
    averageRating: number;
    reviewCount: number;
    tourImages: Array<{
      id: string;
      imageUrl: string;
      caption?: string;
    }>;
  };
  createdAt: string;
}

export default function MyFavorite() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch user's wishlist
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to view favorites');
        router.push('/login?redirect=/favorites');
        return;
      }

      const response = await fetch('https://local-guide-backend-nine.vercel.app/api/wishlist/my-wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.clear();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setFavorites(data.data);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  

  // Remove tour from favorites
  const removeFromFavorites = async (tourId: string, wishlistId?: string) => {
    try {
      setRemovingId(tourId);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('Please login to manage favorites');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/remove/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tourId })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Removed from favorites');
        // Update local state
        setFavorites(prev => prev.filter(item => item.tour.id !== tourId));
      } else {
        toast.error(data.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Something went wrong');
    } finally {
      setRemovingId(null);
    }
  };

  // Navigate to tour details
  const viewTourDetails = (tourSlugOrId: string) => {
    router.push(`/tours/${tourSlugOrId}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  console.log("Wishlist", favorites)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 fill-red-500 text-red-500" />
                My Favorite Tours
              </h1>
              <p className="text-gray-600 mt-2">
                {favorites.length === 0 
                  ? 'No favorite tours yet'
                  : `You have ${favorites.length} favorite tour${favorites.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/tours')}
            >
              Explore More Tours
            </Button>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start exploring tours and add your favorites to see them here!
            </p>
            <Button
              onClick={() => router.push('/tours')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Browse Tours
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Tour Image */}
                <div className="relative h-48 w-full">
                  {item.tour.tourImages && item.tour.tourImages.length > 0 ? (
                    <Image
                      src={item.tour.tourImages[0].imageUrl}
                      alt={item.tour.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-white/70" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-gray-800">
                      {item.tour.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <button
                      onClick={() => removeFromFavorites(item.tour.id, item.wishlistId)}
                      disabled={removingId === item.tour.id}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow-lg transition-all disabled:opacity-50"
                      title="Remove from favorites"
                    >
                      {removingId === item.tour.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                      ) : (
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Tour Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {item.tour.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{item.tour.city}, {item.tour.country}</span>
                  </div>

                  {/* Tour Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700">{item.tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700">Max {item.tour.maxGroupSize}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.tour.averageRating || 'New'}</span>
                      <span className="text-sm text-gray-500">
                        ({item.tour.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">${item.tour.fee}</span>
                      <span className="text-gray-500">/person</span>
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Added {formatDate(item.createdAt)}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t">
                  <div className="flex w-full gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => removeFromFavorites(item.tour.id, item.wishlistId)}
                      disabled={removingId === item.tour.id}
                    >
                      {removingId === item.tour.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      )}
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => viewTourDetails(item.tour.slug)}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {favorites.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={fetchWishlist}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Refreshing...
                </>
              ) : (
                'Refresh List'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}