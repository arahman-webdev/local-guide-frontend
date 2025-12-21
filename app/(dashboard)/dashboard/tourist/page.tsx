'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Heart,
  TrendingUp,
  Settings,
  Eye,
  Loader2,
  MessageSquare,
  Calendar,
  Award,
  ChevronRight,
  MapPin,
  Clock,
  Users,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface FavoriteTour {
  id: string;
  wishlistId?: string;
  tour: {
    id: string;
    title: string;
    slug: string;
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

interface TouristStats {
  totalBookings: number;
  upcomingTours: number;
  completedTours: number;
  totalSpent: number;
  reviewsWritten: number;
  wishlistCount: number;
  favoriteCategory: string;
}

export default function TouristDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TouristStats>({
    totalBookings: 0,
    upcomingTours: 0,
    completedTours: 0,
    totalSpent: 0,
    reviewsWritten: 0,
    wishlistCount: 0,
    favoriteCategory: 'Adventure'
  });
  const [favorites, setFavorites] = useState<FavoriteTour[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [recommendedTours, setRecommendedTours] = useState<any[]>([]);

  useEffect(() => {
    fetchTouristData();
  }, []);

  const fetchTouristData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch wishlist data
      const favoritesResponse = await fetch('https://local-guide-backend-nine.vercel.app/api/wishlist/my-wishlist', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json();
        
        if (favoritesData.success && favoritesData.data) {
          // Transform the API response to match our interface
          const transformedFavorites: FavoriteTour[] = favoritesData.data.map((item: any) => ({
            id: item.id || item._id,
            wishlistId: item.id || item._id,
            tour: {
              id: item.tour?.id || item.tour?._id || '',
              title: item.tour?.title || 'Unknown Tour',
              slug: item.tour?.slug || item.tour?.id || '',
              description: item.tour?.description || '',
              fee: item.tour?.fee || 0,
              duration: item.tour?.duration || '3 hours',
              maxGroupSize: item.tour?.maxGroupSize || 10,
              city: item.tour?.city || '',
              country: item.tour?.country || '',
              category: item.tour?.category || 'ADVENTURE',
              averageRating: item.tour?.averageRating || 4.5,
              reviewCount: item.tour?.reviewCount || 0,
              tourImages: item.tour?.tourImages?.map((img: any) => ({
                id: img.id || img._id,
                imageUrl: img.imageUrl,
                caption: img.caption
              })) || [{ id: 'default', imageUrl: '/default-tour.jpg' }]
            },
            createdAt: item.createdAt || new Date().toISOString()
          }));
          
          setFavorites(transformedFavorites);
          setStats(prev => ({ ...prev, wishlistCount: transformedFavorites.length }));
        }
      } else if (favoritesResponse.status === 404) {
        // API returns 404 when no wishlist exists
        setFavorites([]);
        setStats(prev => ({ ...prev, wishlistCount: 0 }));
      } else {
        throw new Error(`Failed to fetch favorites: ${favoritesResponse.status}`);
      }

      // Fetch other data (bookings, reviews, recommendations)
      await fetchOtherData(token);

    } catch (error: any) {
      console.error('Error fetching tourist data:', error);
      toast.error('Failed to load dashboard data');
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherData = async (token: string) => {
    try {
      // Fetch bookings
      const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let bookingsData: any[] = [];
      if (bookingsRes.ok) {
        const result = await bookingsRes.json();
        if (result.success) {
          bookingsData = result.data || [];
        }
      }

      // Calculate statistics from bookings
      const upcomingTours = bookingsData.filter((b: any) =>
        ['CONFIRMED', 'PENDING'].includes(b.status)
      ).length;

      const completedTours = bookingsData.filter((b: any) =>
        b.status === 'COMPLETED'
      ).length;

      const totalSpent = bookingsData.reduce((sum: number, booking: any) =>
        booking.status === 'COMPLETED' ? sum + (booking.totalAmount || booking.amount || 0) : sum, 0
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        totalBookings: bookingsData.length,
        upcomingTours,
        completedTours,
        totalSpent
      }));

      // Fetch recommendations (if API exists)
      const recommendationsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/recommended`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (recommendationsRes.ok) {
        const result = await recommendationsRes.json();
        if (result.success && result.data) {
          setRecommendedTours(result.data.slice(0, 3));
        }
      }

    } catch (error) {
      console.error('Error fetching other data:', error);
    }
  };

  const handleRemoveFavorite = async (tourId: string) => {
    try {
      setFavorites(prev => prev.filter(fav => fav.tour.id !== tourId));
      setStats(prev => ({ ...prev, wishlistCount: prev.wishlistCount - 1 }));
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`https://local-guide-backend-nine.vercel.app/api/wishlist/remove/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Removed from favorites');
      } else {
        toast.error(data.message || 'Failed to remove');
        // Revert on error
        fetchTouristData();
      }
    } catch (error) {
      toast.error('Failed to remove from favorites');
      fetchTouristData();
    }
  };

  const setMockData = () => {
    // Keep existing favorites if any, otherwise use mock
    if (favorites.length === 0) {
      setFavorites([
        {
          id: '1',
          wishlistId: 'wish1',
          tour: {
            id: 'tour1',
            title: 'Cox\'s Bazar Beach Tour',
            slug: 'coxs-bazar-beach-tour',
            description: 'Amazing beach experience',
            fee: 120,
            duration: '4 hours',
            maxGroupSize: 15,
            city: 'Cox\'s Bazar',
            country: 'Bangladesh',
            category: 'BEACH',
            averageRating: 4.8,
            reviewCount: 12,
            tourImages: [{ id: 'img1', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' }]
          },
          createdAt: '2024-12-01'
        }
      ]);
    }
    
    setStats({
      totalBookings: 8,
      upcomingTours: 2,
      completedTours: 6,
      totalSpent: 960,
      reviewsWritten: 3,
      wishlistCount: favorites.length || 1,
      favoriteCategory: 'Adventure',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
                Welcome Back, Traveler!
              </h1>
              <p className="text-gray-600">
                {favorites.length > 0 
                  ? `You have ${favorites.length} favorite tour${favorites.length !== 1 ? 's' : ''}`
                  : 'Start exploring and add tours to your favorites'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/tours')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                <Eye className="h-4 w-4 mr-2" />
                Explore More Tours
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.totalBookings}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Total Bookings</h3>
              <p className="text-sm text-gray-600">{stats.upcomingTours} upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.completedTours}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Completed Tours</h3>
              <p className="text-sm text-gray-600">${stats.totalSpent} total spent</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.wishlistCount}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Wishlist Items</h3>
              <p className="text-sm text-gray-600">Tours saved for later</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{stats.reviewsWritten}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Reviews Written</h3>
              <p className="text-sm text-gray-600">Help others choose</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Wishlist */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      My Favorite Tours
                    </CardTitle>
                    <CardDescription>
                      {favorites.length > 0 
                        ? 'Tours you\'ve saved for later' 
                        : 'No favorites yet. Explore tours and add them to your wishlist!'}
                    </CardDescription>
                  </div>
                  {favorites.length > 0 && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/favorites">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.slice(0, 4).map(item => (
                      <div key={item.id} className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          {item.tour.tourImages && item.tour.tourImages.length > 0 ? (
                            <img
                              src={item.tour.tourImages[0].imageUrl}
                              alt={item.tour.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <Heart className="h-12 w-12 text-white/70" />
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveFavorite(item.tour.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                            title="Remove from favorites"
                          >
                            <X className="h-5 w-5 text-red-500" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <h4 className="font-bold text-white line-clamp-1">{item.tour.title}</h4>
                            <p className="text-sm text-white/90">
                              {item.tour.city}, {item.tour.country}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{item.tour.averageRating || 'New'}</span>
                              <span className="text-xs text-gray-500">
                                ({item.tour.reviewCount || 0})
                              </span>
                            </div>
                            <span className="font-bold text-lg">${item.tour.fee}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.tour.duration}
                            </div>
                            <Badge variant="outline">
                              {item.tour.category.replace('_', ' ').toLowerCase()}
                            </Badge>
                          </div>
                          <Button 
                            className="w-full mt-4" 
                            onClick={() => router.push(`/tours/${item.tour.slug || item.tour.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Save tours you're interested in for later</p>
                    <Button onClick={() => router.push('/tours')}>
                      Explore Tours
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recommended Tours */}
            {recommendedTours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Recommended For You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedTours.map((tour: any) => (
                      <div 
                        key={tour.id} 
                        className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                        onClick={() => router.push(`/tours/${tour.id}`)}
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          {tour.images?.[0] ? (
                            <img
                              src={tour.images[0]}
                              alt={tour.title}
                              className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-100 to-cyan-100" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {tour.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{tour.rating || 'New'}</span>
                            </div>
                            <span className="font-bold">${tour.price || tour.fee || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            {tour.location || `${tour.city || ''}, ${tour.country || ''}`}
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full mt-2" 
                      onClick={() => router.push('/tours')}
                    >
                      View All Recommendations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}