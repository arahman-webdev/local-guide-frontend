'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    Star,
    Shield,
    Heart,
    Share2,
    ArrowLeft,
    Check,
    MessageCircle,
    Award,
    Globe,
    Coffee,
    Camera,
    Wifi,
    Utensils,
    Car,
    Bed,
    ChevronRight,
    ChevronLeft,
    CreditCard,
    AlertCircle,
    X,
    ThumbsUp,
    User,
    Calendar as CalendarIcon,
    MessageSquare,
    Star as StarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface TourDetail {
    id: string;
    slug: string;
    title: string;
    description: string;
    fee: number;
    duration: string | number;
    maxGroupSize: number;
    minGroupSize: number;
    category: string;
    city: string;
    country: string;
    meetingPoint: string;
    includes: string[];
    excludes: string[];
    whatToBring: string[];
    requirements: string[];
    languages: string[];
    availableDays: string[];
    tourImages: Array<{
        id: string;
        imageUrl: string;
        caption?: string;
    }>;
    user: {
        id: string;
        name: string;
        profilePic: string;
        bio: string;
        joinedAt: string;
        rating: number;
        totalReviews: number;
        verified: boolean;
        languages: string[];
    };
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        profilePic: string;
    };
}

export default function TourDetail() {
    const params = useParams();
    const router = useRouter();
    const [tour, setTour] = useState<TourDetail | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = useState<string>('');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('');
    const [participants, setParticipants] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'host' | 'exclusions'>('details');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userHasBooked, setUserHasBooked] = useState(false);

    // Helper to convert 24h to 12h format
    const convertTo12Hour = (time24: string) => {
        if (!time24 || typeof time24 !== 'string') {
            return 'Invalid Time';
        }
        
        const parts = time24.split(':');
        if (parts.length !== 2) {
            return 'Invalid Time';
        }
        
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        if (isNaN(hours) || isNaN(minutes)) {
            return 'Invalid Time';
        }
        
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Generate time slots
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const time12 = convertTo12Hour(time24);
                slots.push({ value: time24, label: time12 });
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    // Calculate end time based on start time and tour duration
    const calculateEndTime = (startTime: string) => {
        if (!tour?.duration || !startTime) return '';

        try {
            let durationHours: number;
            if (typeof tour.duration === 'string') {
                const match = tour.duration.match(/\d+/);
                durationHours = match ? parseInt(match[0], 10) : 3;
            } else {
                durationHours = tour.duration || 3;
            }

            const [hours, minutes] = startTime.split(':').map(Number);
            const totalMinutes = hours * 60 + minutes + (durationHours * 60);
            const endHours = Math.floor(totalMinutes / 60);
            const endMinutes = totalMinutes % 60;

            return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
        } catch (error) {
            console.error('Error calculating end time:', error);
            return '';
        }
    };

    // Update end time when start time changes
    useEffect(() => {
        if (selectedStartTime) {
            const endTime = calculateEndTime(selectedStartTime);
            setSelectedEndTime(endTime);
        }
    }, [selectedStartTime, tour?.duration]);

    // Fetch tour data and reviews
    useEffect(() => {
        const fetchTourData = async () => {
            try {
                setLoading(true);
                // Fetch tour details
                const tourResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/${params.slug}`);
                const tourData = await tourResponse.json();

                if (tourData.success) {
                    setTour(tourData.data);
                    
                    // Fetch reviews for this tour
                    const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${tourData.data.id}`);
                    const reviewsData = await reviewsResponse.json();
                    
                    if (reviewsData.success) {
                        setReviews(reviewsData.data || []);
                    }
                    
                    // Check if user has booked this tour (for review eligibility)
                    checkUserBooking(tourData.data.id);
                } else {
                    setError('Tour not found');
                }
            } catch (err) {
                setError('Failed to load tour details');
                console.error('Error fetching tour:', err);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchTourData();
        }
    }, [params.slug]);

    // Check if current user has booked this tour
    const checkUserBooking = async (tourId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (result.success) {
                const hasBooked = result.data.some((booking: any) => 
                    booking.tourId === tourId && 
                    booking.status === 'COMPLETED'
                );
                setUserHasBooked(hasBooked);
            }
        } catch (error) {
            console.error('Error checking user booking:', error);
        }
    };

    // Calculate next available dates
    const getAvailableDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    };

    const availableDates = getAvailableDates();

    // Handle booking request
    const handleBookingRequest = async () => {
        try {
            if (!selectedDate) {
                toast.error('Please select a date');
                return;
            }

            if (!selectedStartTime) {
                toast.error('Please select a start time');
                return;
            }

            if (!tour?.id) {
                toast.error('No tour selected');
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to book this tour');
                router.push(`/login?redirect=/tours/${params.slug}`);
                return;
            }

            setBookingLoading(true);

            const startTimeISO = `${selectedDate}T${selectedStartTime}:00Z`;
            const endTimeISO = `${selectedDate}T${selectedEndTime || calculateEndTime(selectedStartTime)}:00Z`;

            const bookingData = {
                tourId: tour.id,
                startTime: startTimeISO,
                endTime: endTimeISO,
                paymentMethod: "ssl"
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.clear();
                    router.push('/login');
                    return;
                }
                throw new Error(result.message || `Booking failed with status: ${response.status}`);
            }

            if (result.success && result.data) {
                if (result.data.paymentUrl) {
                    toast.success('Booking Created!', {
                        description: `Booking Code: ${result.data.booking?.bookingCode || 'N/A'}`,
                        duration: 3000,
                    });

                    setTimeout(() => {
                        window.location.href = result.data.paymentUrl;
                    }, 2000);
                } else {
                    toast.success('Booking Confirmed!', {
                        description: `Booking Code: ${result.data.booking?.bookingCode || 'Success'}`,
                        action: result.data.booking?.id ? {
                            label: 'View Details',
                            onClick: () => router.push(`/bookings/${result.data.booking.id}`)
                        } : undefined
                    });

                    setSelectedDate('');
                    setSelectedStartTime('');
                    setSelectedEndTime('');
                    setParticipants(1);
                }
            } else {
                throw new Error(result.message || 'Unknown error occurred');
            }

        } catch (error: any) {
            console.error('Booking error:', error);

            if (error.name === 'RangeError' || error.message.includes('Invalid time')) {
                toast.error('Invalid Date/Time', {
                    description: 'Please select a valid date and time combination'
                });
            } else {
                toast.error('Booking Failed', {
                    description: error.message || 'Please try again',
                    action: {
                        label: 'Retry',
                        onClick: () => handleBookingRequest()
                    }
                });
            }
        } finally {
            setBookingLoading(false);
        }
    };

    // Handle review submission
    const handleSubmitReview = async () => {
        try {
            if (!reviewComment.trim()) {
                toast.error('Please write a review');
                return;
            }

            if (!tour?.id) {
                toast.error('No tour selected');
                return;
            }

            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to submit a review');
                router.push(`/login?redirect=/tours/${params.slug}`);
                return;
            }

            setSubmittingReview(true);

            const reviewData = {
                tourId: tour.id,
                rating: reviewRating,
                comment: reviewComment
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${tour.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData)
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired. Please login again.');
                    localStorage.clear();
                    router.push('/login');
                    return;
                }
                throw new Error(result.message || 'Failed to submit review');
            }

            if (result.success) {
                toast.success('Review submitted successfully!');
                
                // Refresh reviews
                const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${tour.id}`);
                const reviewsData = await reviewsResponse.json();
                
                if (reviewsData.success) {
                    setReviews(reviewsData.data || []);
                }
                
                // Reset form
                setReviewComment('');
                setReviewRating(5);
                setShowReviewForm(false);
            } else {
                throw new Error(result.message || 'Failed to submit review');
            }

        } catch (error: any) {
            console.error('Review submission error:', error);
            toast.error('Failed to submit review', {
                description: error.message || 'Please try again'
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        if (!tour) return 0;
        const basePrice = tour.fee * participants;
        const serviceFee = basePrice * 0.1;
        return (basePrice + serviceFee).toFixed(2);
    };

    // Render star rating
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !tour) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The tour you are looking for does not exist.'}</p>
                    <Button onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50  ">
            {/* Hero Image Gallery */}
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                {tour.tourImages.length > 0 ? (
                    <div className="relative h-full w-full">
                        <Image
                            src={tour.tourImages[activeImageIndex].imageUrl}
                            alt={tour.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        {tour.tourImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setActiveImageIndex((prev) =>
                                        prev === 0 ? tour.tourImages.length - 1 : prev - 1
                                    )}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => setActiveImageIndex((prev) =>
                                        prev === tour.tourImages.length - 1 ? 0 : prev + 1
                                    )}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {tour.tourImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImageIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${activeImageIndex === index
                                                ? 'bg-white w-8'
                                                : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-full w-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Camera className="h-24 w-24 text-white/50" />
                    </div>
                )}

                <button
                    onClick={() => window.history.back()}
                    className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="absolute top-6 right-6 flex gap-2">
                    <button  className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all">
                        <Heart className="h-5 w-5" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>

                <div className="absolute bottom-6 left-6">
                    <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 px-4 py-2 text-sm font-medium">
                        {tour.category}
                    </Badge>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {tour.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    <span className="font-medium">{tour.city}, {tour.country}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-gray-900">{tour.averageRating || 4.8}</span>
                                    <span className="text-gray-600">({tour.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    <span className="text-sm">Verified Experience</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">Duration</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{tour.duration}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">Group Size</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">Max {tour.maxGroupSize}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Globe className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">Languages</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{tour.languages?.join(', ') || 'English'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CalendarIcon className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">Flexible</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">Book Now</p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="border-b border-gray-200 mb-8">
                            <nav className="flex space-x-8">
                                {[
                                    { id: 'details', label: 'Tour Details' },
                                    { id: 'exclusions', label: 'Inclusions & Exclusions' },
                                    { id: 'reviews', label: `Reviews (${tour.reviewCount || 0})` },
                                    { id: 'host', label: 'Your Host' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">About this experience</h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {tour.description}
                                        </p>
                                    </div>

                                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                            Meeting Point
                                        </h4>
                                        <p className="text-gray-700">{tour.meetingPoint}</p>
                                    </div>

                                    {tour.whatToBring && tour.whatToBring.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">What to Bring</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {tour.whatToBring.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                                        <Check className="h-5 w-5 text-blue-500 shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {tour.requirements && tour.requirements.length > 0 && (
                                        <div className="mb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Requirements</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {tour.requirements.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                                        <Check className="h-5 w-5 text-blue-500 shrink-0" />
                                                        <span className="text-gray-700">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'exclusions' && (
                                <motion.div
                                    key="exclusions"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* What's Included */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Check className="h-6 w-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">What's Included</h3>
                                                <p className="text-gray-600">All these are covered in your tour fee</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {tour.includes?.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                                                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* What's Excluded */}
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <X className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">What's Excluded</h3>
                                                <p className="text-gray-600">These are not covered in your tour fee</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {tour.excludes?.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-100">
                                                    <X className="h-5 w-5 text-red-500 shrink-0" />
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div
                                    key="reviews"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    {/* Review Summary */}
                                    <div className="bg-white rounded-2xl p-6 border">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">Reviews</h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-3xl font-bold">{tour.averageRating?.toFixed(1) || '4.8'}</span>
                                                    <span className="text-gray-600">· {tour.reviewCount || 0} reviews</span>
                                                </div>
                                            </div>
                                            {userHasBooked && (
                                                <Button
                                                    onClick={() => setShowReviewForm(true)}
                                                    className="bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Write a Review
                                                </Button>
                                            )}
                                        </div>

                                        {/* Review Form Modal */}
                                    
                                            <div className="mb-6 p-6 bg-gray-50 rounded-xl border">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-bold text-gray-900">Write a Review</h4>
                                                    <button
                                                        onClick={() => setShowReviewForm(false)}
                                                        className="text-gray-500 hover:text-gray-700"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Rating
                                                    </label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setReviewRating(star)}
                                                                className="text-2xl focus:outline-none"
                                                            >
                                                                {star <= reviewRating ? '⭐' : '☆'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <Textarea
                                                        placeholder="Share your experience with this tour..."
                                                        value={reviewComment}
                                                        onChange={(e) => setReviewComment(e.target.value)}
                                                        className="min-h-[120px]"
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setShowReviewForm(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleSubmitReview}
                                                        disabled={submittingReview || !reviewComment.trim()}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        {submittingReview ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            'Submit Review'
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                    

                                        {/* Reviews List */}
                                        <div className="space-y-6">
                                            {reviewsLoading ? (
                                                <div className="text-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                                </div>
                                            ) : reviews.length > 0 ? (
                                                reviews.map((review) => (
                                                    <div key={review.id} className="pb-6 border-b last:border-0 last:pb-0">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage src={review.user.profilePic} />
                                                                    <AvatarFallback>
                                                                        {review.user.name.charAt(0).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <h5 className="font-medium text-gray-900">
                                                                        {review.user.name}
                                                                    </h5>
                                                                    <div className="flex items-center gap-2">
                                                                        {renderStars(review.rating)}
                                                                        <span className="text-sm text-gray-500">
                                                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ThumbsUp className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-700">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8">
                                                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                        No reviews yet
                                                    </h4>
                                                    <p className="text-gray-600">
                                                        Be the first to review this tour!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                         
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="sticky top-24"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                                <div className="bg-linear-to-r from-blue-600 to-cyan-500 p-6 text-white">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <div>
                                            <span className="text-3xl font-bold">${tour.fee}</span>
                                            <span className="text-white/80 ml-1">/person</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <Star className="h-4 w-4 fill-white" />
                                            <span className="text-sm font-medium">{tour.averageRating}</span>
                                        </div>
                                    </div>
                                    <p className="text-white/90">Instant confirmation • Free cancellation</p>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            Select Date
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableDates.slice(0, 9).map((date) => {
                                                const dateObj = new Date(date);
                                                return (
                                                    <button
                                                        key={date}
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`p-3 rounded-lg border transition-all ${selectedDate === date
                                                            ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="text-sm">
                                                            {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                                                        </div>
                                                        <div className="text-lg font-semibold">
                                                            {dateObj.getDate()}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-blue-500" />
                                            Start Time
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                                            {timeSlots.map((slot) => (
                                                <button
                                                    key={slot.value}
                                                    onClick={() => setSelectedStartTime(slot.value)}
                                                    className={`p-3 rounded-lg border transition-all ${selectedStartTime === slot.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {slot.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedStartTime && (
                                        <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-700">Tour Duration</p>
                                                    <p className="text-sm text-gray-600">{tour.duration}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-gray-700">End Time</p>
                                                    <p className="text-lg font-semibold text-blue-600">
                                                        {convertTo12Hour(selectedEndTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            Participants
                                        </label>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                                                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={participants <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="text-2xl font-bold text-gray-900">{participants}</span>
                                                <button
                                                    onClick={() => setParticipants(Math.min(tour.maxGroupSize, participants + 1))}
                                                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={participants >= tour.maxGroupSize}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                Max {tour.maxGroupSize} people
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">${tour.fee} × {participants} person(s)</span>
                                                <span className="font-medium">${(tour.fee * participants).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Service fee</span>
                                                <span className="font-medium">${(tour.fee * participants * 0.1).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-blue-600">
                                                        ${calculateTotal()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleBookingRequest}
                                        disabled={!selectedDate || !selectedStartTime || bookingLoading}
                                        className="w-full py-6 text-lg font-bold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {bookingLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="mr-2 h-5 w-5" />
                                                Book Now
                                            </>
                                        )}
                                    </Button>

                                    {(!selectedDate || !selectedStartTime) && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-yellow-700">
                                                Please select a date and start time to book this tour.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 space-y-4 text-sm text-gray-600">
                                        <div className="flex items-start gap-3">
                                            <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>Secure booking with payment protection</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                            <span>Free cancellation up to 24 hours before</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MessageCircle className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                            <span>Chat with your guide before booking</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 bg-white rounded-2xl p-6 border">
                                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    Your Safety Matters
                                </h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600">All guides are verified and background-checked</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600">Secure payment processing</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-600">24/7 customer support</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}