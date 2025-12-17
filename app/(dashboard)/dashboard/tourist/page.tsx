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
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface FavoriteTour {
  id: string;
  title: string;
  image: string;
  guideName: string;
  rating: number;
  price: number;
  location: string;
  duration: string;
  category: string;
}

interface Review {
  id: string;
  tourId: string;
  tourTitle: string;
  rating: number;
  comment: string;
  createdAt: string;
  guideResponse?: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
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

      // Fetch tourist data in parallel
      const [bookingsRes, favoritesRes, recommendationsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/my-wishlist`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/tours/recommended`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      let bookingsData: any[] = [];
      let favoritesData: FavoriteTour[] = [];
      let recommendationsData: any[] = [];

      // Process bookings for stats only
      if (bookingsRes.ok) {
        const result = await bookingsRes.json();
        if (result.success) {
          bookingsData = result.data || [];
        }
      }

      // Process favorites
      if (favoritesRes.ok) {
        const result = await favoritesRes.json();
        if (result.success) {
          favoritesData = result.data.map((tour: any) => ({
            id: tour.id || tour._id,
            title: tour.title || 'Unknown Tour',
            image: tour.images?.[0]?.imageUrl || '/default-tour.jpg',
            guideName: tour.guide?.name || tour.user?.name || 'Unknown Guide',
            rating: tour.rating || 4.5,
            price: tour.fee || 0,
            location: `${tour.city || ''}, ${tour.country || ''}`,
            duration: tour.duration || '3 hours',
            category: tour.category || 'ADVENTURE',
          }));
        }
      }

      // Process recommendations
      if (recommendationsRes.ok) {
        const result = await recommendationsRes.json();
        if (result.success) {
          recommendationsData = result.data || [];
        }
      }

      // Fetch reviews - use a different endpoint or mock for now
      // Since we don't have a proper endpoint, we'll use mock reviews
      const reviewsData = await fetchUserReviews(token);

      // Calculate statistics
      const upcomingTours = bookingsData.filter((b: any) =>
        ['CONFIRMED', 'PENDING'].includes(b.status)
      ).length;

      const completedTours = bookingsData.filter((b: any) =>
        b.status === 'COMPLETED'
      ).length;

      const totalSpent = bookingsData.reduce((sum: number, booking: any) =>
        booking.status === 'COMPLETED' ? sum + (booking.totalAmount || booking.amount || 0) : sum, 0
      );

      // Update state
      setStats({
        totalBookings: bookingsData.length,
        upcomingTours,
        completedTours,
        totalSpent,
        reviewsWritten: reviewsData.length,
        wishlistCount: favoritesData.length,
        favoriteCategory: getFavoriteCategory(bookingsData),
      });

      setFavorites(favoritesData);
      setReviews(reviewsData);
      setRecommendedTours(recommendationsData.slice(0, 3));

    } catch (error: any) {
      console.error('Error fetching tourist data:', error);
      toast.error('Failed to load dashboard data');

      // Fallback mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Mock function to get user reviews (replace with actual API)
  const fetchUserReviews = async (token: string): Promise<Review[]> => {
    try {
      // Try to fetch from actual API if available
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/user`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data.map((review: any) => ({
            id: review.id || review._id,
            tourId: review.tourId || review.tour?._id,
            tourTitle: review.tour?.title || 'Unknown Tour',
            rating: review.rating || 5,
            comment: review.comment || '',
            createdAt: review.createdAt || new Date().toISOString(),
            guideResponse: review.guideResponse,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }

    // Return mock data if API fails
    return [
      {
        id: '1',
        tourId: 'tour3',
        tourTitle: 'Cox\'s Bazar Beach Tour',
        rating: 5,
        comment: 'Amazing experience! Michael was very knowledgeable and showed us hidden spots.',
        createdAt: '2024-12-11',
        guideResponse: 'Thank you for the wonderful review! Hope to see you again soon!',
      },
      {
        id: '2',
        tourId: 'tour4',
        tourTitle: 'Sundarbans Boat Safari',
        rating: 4,
        comment: 'Great tour but wish it was longer. Wildlife sightings were incredible!',
        createdAt: '2024-12-05',
      },
    ];
  };

  const getFavoriteCategory = (bookings: any[]) => {
    if (bookings.length === 0) return 'Adventure';
    // In real app, analyze booking categories
    return 'Adventure';
  };

  const setMockData = () => {
    setStats({
      totalBookings: 12,
      upcomingTours: 3,
      completedTours: 8,
      totalSpent: 2450,
      reviewsWritten: 6,
      wishlistCount: 5,
      favoriteCategory: 'Adventure',
    });

    setFavorites([
      {
        id: '1',
        title: 'Sylhet Tea Garden Tour',
        image: 'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?w=400&auto=format&fit=crop',
        guideName: 'Emma Wilson',
        rating: 4.9,
        price: 85,
        location: 'Sylhet, Bangladesh',
        duration: '4 hours',
        category: 'NATURE',
      },
      {
        id: '2',
        title: 'Chittagong Hill Tracts Trek',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop',
        guideName: 'David Brown',
        rating: 4.7,
        price: 120,
        location: 'Chittagong, Bangladesh',
        duration: 'Full day',
        category: 'ADVENTURE',
      },
    ]);

    
  };

  const handleRemoveFavorite = async (tourId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/favorites/${tourId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Removed from favorites');
        setFavorites(favorites.filter(fav => fav.id !== tourId));
        setStats(prev => ({ ...prev, wishlistCount: prev.wishlistCount - 1 }));
      }
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-50 to-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }


  console.log("favrote................", favorites)

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50/30 to-white p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-cyan-500 mb-2">
                Welcome Back, Traveler!
              </h1>
              <p className="text-gray-600">
                Your travel dashboard overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push('/tours')}
                className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
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
          <Card className="bg-linear-to-br from-blue-50 to-white border-blue-100">
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

          <Card className="bg-linear-to-br from-green-50 to-white border-green-100">
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

          <Card className="bg-linear-to-br from-purple-50 to-white border-purple-100">
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

          <Card className="bg-linear-to-br from-yellow-50 to-white border-yellow-100">
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
            {/* Wishlist */}
            {favorites.length > 0 ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-600" />
                        My Wishlist
                      </CardTitle>
                      <CardDescription>
                        Tours you've saved for later
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/wishlist">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map(tour => (
                      <div key={tour.id} className="group relative overflow-hidden rounded-lg border hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={tour?.image}
                            alt={tour.title}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => handleRemoveFavorite(tour.id)}
                            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white"
                          >
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
                            <h4 className="font-bold text-white">{tour.title}</h4>
                            <p className="text-sm text-white/90">{tour.location}</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{tour.rating}</span>
                            </div>
                            <span className="font-bold text-lg">${tour.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {tour.duration}
                            </div>
                            <Badge variant="outline">{tour.category}</Badge>
                          </div>
                          <Button className="w-full mt-4" asChild>
                            <Link href={`/tours/${tour.id}`}>
                              Book Now
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-6">Save tours you're interested in for later</p>
                  <Button onClick={() => router.push('/tours')}>
                    Explore Tours
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                      <p className="text-xs text-gray-500 mt-1">{review.tourTitle}</p>
                      {review.guideResponse && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <span className="font-medium">Guide response:</span>
                          <p className="text-gray-600">{review.guideResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {reviews.length === 0 && (
                    <div className="text-center py-2">
                      <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No reviews yet. Share your experience after completing tours!
                      </p>
                    </div>
                  )}
                  {reviews.length > 0 && (
                    <Button variant="ghost" className="w-full text-sm" asChild>
                      <Link href="/reviews">
                        View All Reviews
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

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
                    {recommendedTours.map(tour => (
                      <div 
                        key={tour.id} 
                        className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                        onClick={() => router.push(`/tours/${tour.id}`)}
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={tour.image}
                            alt={tour.title}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {tour.title}
                          </h4>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{tour.rating}</span>
                            </div>
                            <span className="font-bold">${tour.price}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            {tour.location}
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

        {/* Quick Stats Card */}
        <Card className="bg-linear-to-r from-blue-600 to-cyan-500 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">${stats.totalSpent}</div>
                <p className="text-blue-100">Total Spent</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{stats.completedTours}</div>
                <p className="text-blue-100">Tours Completed</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{stats.reviewsWritten}</div>
                <p className="text-blue-100">Reviews Written</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{stats.wishlistCount}</div>
                <p className="text-blue-100">Wishlist Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}