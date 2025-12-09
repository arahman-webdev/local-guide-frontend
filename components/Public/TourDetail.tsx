// app/tours/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
    ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface TourDetail {
    id: string;
    slug: string;
    title: string;
    description: string;
    fee: number;
    duration: string | number;
    maxGroupSize: number;
    category: string;
    city: string;
    country: string;
    meetingPoint: string;
    includes: string[];
    requirements: string[];
    languages: string[];
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
    rating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
}

export default function TourDetail() {
    const params = useParams();
    const [tour, setTour] = useState<TourDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [participants, setParticipants] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'host'>('details');

    // Available time slots
    const timeSlots = ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

    // Sample reviews data
    const reviews = [
        {
            id: 1,
            user: {
                name: 'Sarah Johnson',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=100&auto=format',
                country: 'USA'
            },
            rating: 5,
            date: '2024-01-15',
            comment: 'Absolutely incredible experience! The guide was so knowledgeable about local history. Highly recommended!',
            likes: 24,
            isVerified: true
        },
        {
            id: 2,
            user: {
                name: 'Michael Chen',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format',
                country: 'Canada'
            },
            rating: 5,
            date: '2024-01-10',
            comment: 'The food tour was exceptional. We tried authentic dishes we never would have found on our own.',
            likes: 18,
            isVerified: true
        },
        {
            id: 3,
            user: {
                name: 'Emma Rodriguez',
                avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&auto=format',
                country: 'Spain'
            },
            rating: 4,
            date: '2024-01-05',
            comment: 'Great tour with amazing photography opportunities. Our guide knew all the perfect spots!',
            likes: 12,
            isVerified: true
        }
    ];

    // Fetch tour data
    useEffect(() => {
        const fetchTour = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour/${params.slug}`);
                const data = await response.json();

                if (data.success) {
                    setTour(data.data);
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
            fetchTour();
        }
    }, [params.slug]);


    console.log("tour from tour detail page", tour)

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
        
        if (!selectedTime) {
            toast.error('Please select a time');
            return;
        }

        if (!tour?.id) {
            toast.error('No tour selected');
            return;
        }

        // Show loading toast
        const loadingToast = toast.loading('Creating your booking...');

        
        const convertTimeTo24Hour = (time12h: string) => {
            try {
                if (!time12h) return null;
                
                // If already in 24-hour format (no AM/PM)
                if (!time12h.includes('AM') && !time12h.includes('PM')) {
                    return time12h;
                }
                
                const [time, modifier] = time12h.split(' ');
                let [hours, minutes] = time.split(':');
                
                if (modifier === 'PM' && hours !== '12') {
                    hours = String(parseInt(hours, 10) + 12);
                }
                if (modifier === 'AM' && hours === '12') {
                    hours = '00';
                }
                
                return `${hours.padStart(2, '0')}:${minutes}`;
            } catch (error) {
                console.error('Time conversion error:', error);
                return null;
            }
        };

        const time24h = convertTimeTo24Hour(selectedTime);
        if (!time24h) {
            toast.dismiss(loadingToast);
            toast.error('Invalid time format selected');
            return;
        }

        // Debug log
        console.log('Selected values:', {
            selectedDate,
            selectedTime,
            time24h
        });

        // Create ISO string with proper error handling
        let startTimeISO: string;
        let endTimeISO: string;
        
        try {
            // Combine date and time
            const dateTimeString = `${selectedDate}T${time24h}:00`;
            const startTime = new Date(dateTimeString);
            
            // Validate the date
            if (isNaN(startTime.getTime())) {
                throw new Error('Invalid date/time combination');
            }
            
            startTimeISO = startTime.toISOString();
            
            // Calculate end time (default 3 hours or use tour duration)
            const durationHours = typeof tour.duration === 'string' 
                ? parseInt(tour.duration.split(' ')[0]) || 3 
                : (tour.duration || 3);
            
            const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));
            endTimeISO = endTime.toISOString();
            
            console.log('Generated ISO times:', {
                startTimeISO,
                endTimeISO
            });
        } catch (dateError) {
            toast.dismiss(loadingToast);
            toast.error('Invalid date/time selected');
            console.error('Date creation error:', dateError);
            return;
        }

        const bookingData = {
            tourId: tour.id,
            startTime: startTimeISO,
            endTime: endTimeISO,
            paymentMethod: "ssl"
        };

        console.log('Sending booking data:', bookingData);



        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               
            },
            credentials: "include",
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();
        
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        console.log('Booking response:', result);

        if (!response.ok) {
            throw new Error(result.message || `Booking failed with status: ${response.status}`);
        }

        // Handle success response
        if (result.success && result.data) {
            if (result.data.paymentUrl) {
                // Success with payment URL
                toast.success('Booking Created!', {
                    description: `Booking Code: ${result.data.booking?.bookingCode || 'N/A'}`,
                    duration: 3000,
                });

                // Redirect to payment after delay
                setTimeout(() => {
                    window.location.href = result.data.paymentUrl;
                }, 2000);
            } else {
                // Success without payment (free tour maybe)
                toast.success('Booking Confirmed!', {
                    description: `Booking Code: ${result.data.booking?.bookingCode || 'Success'}`,
                    action: result.data.booking?.id ? {
                        label: 'View Details',
                        onClick: () => window.location.href = `/bookings/${result.data.booking.id}`
                    } : undefined
                });

                // Reset form
                setSelectedDate('');
                setSelectedTime('');
                setParticipants(1);
            }
        } else {
            throw new Error(result.message || 'Unknown error occurred');
        }

    } catch (error: any) {
        console.error('Booking error:', error);
        
        // Check if it's the RangeError from toISOString
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
    }
};
    // Helper function to calculate end time (add tour duration)
 const getEndTime = (startTime: string) => {
    if (!tour?.duration) return '18:00'; // Default end time

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

        const endHours = Math.floor(totalMinutes / 60) % 24;
        const endMinutes = totalMinutes % 60;

        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    } catch (error) {
        console.error('Error calculating end time:', error);
        return '18:00';
    }
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
        <div className="min-h-screen bg-gray-50">
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
                        {/* Image Navigation */}
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

                                {/* Image Dots */}
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

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                {/* Action Buttons */}
                <div className="absolute top-6 right-6 flex gap-2">
                    <button className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all">
                        <Heart className="h-5 w-5" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all">
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-6 left-6">
                    <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 px-4 py-2 text-sm font-medium">
                        {tour.category}
                    </Badge>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {tour.title}
                            </h1>

                            {/* Location & Rating */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    <span className="font-medium">{tour.city}, {tour.country}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-gray-900">{tour.rating || 4.8}</span>
                                    <span className="text-gray-600">({tour.totalReviews || 128} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Shield className="h-5 w-5 text-green-500" />
                                    <span className="text-sm">Verified Experience</span>
                                </div>
                            </div>

                            {/* Quick Stats */}
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
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                        <span className="font-medium">Flexible</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">Book Now</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Tabs */}
                        <div className="border-b border-gray-200 mb-8">
                            <nav className="flex space-x-8">
                                {[
                                    { id: 'details', label: 'Tour Details' },
                                    { id: 'reviews', label: `Reviews (${reviews.length})` },
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

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            {activeTab === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Description */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">About this experience</h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {tour.description}
                                        </p>
                                    </div>

                                    {/* Meeting Point */}
                                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                            Meeting Point
                                        </h4>
                                        <p className="text-gray-700">{tour.meetingPoint}</p>
                                    </div>

                                    {/* What's Included */}
                                    <div className="mb-8">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">What's Included</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(tour.includes || [
                                                'Local guide services',
                                                'All entrance fees',
                                                'Bottled water',
                                                'Traditional snacks',
                                                'Transportation during tour',
                                                'Souvenir photos'
                                            ]).map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                                                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                                                    <span className="text-gray-700">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div className="mb-8">
                                        <h4 className="text-xl font-bold text-gray-900 mb-4">What to Bring</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {(tour.requirements || [
                                                'Camera',
                                                'Water Bottle',
                                                'Snacks',
                                                'Transport'
                                            ]).map((item, index) => (
                                                <div key={index} className="flex flex-col items-center p-4 bg-white rounded-xl border text-center">
                                                    <div className="text-blue-500 mb-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            {/* Map requirements to icons */}
                                                            {(() => {
                                                                const requirement = typeof item === 'string' ? item.toLowerCase() : '';
                                                                if (requirement.includes('camera')) return <Camera className="h-5 w-5" />;
                                                                if (requirement.includes('water') || requirement.includes('bottle')) return <Coffee className="h-5 w-5" />;
                                                                if (requirement.includes('snack') || requirement.includes('food')) return <Utensils className="h-5 w-5" />;
                                                                if (requirement.includes('transport') || requirement.includes('car')) return <Car className="h-5 w-5" />;
                                                                if (requirement.includes('wifi')) return <Wifi className="h-5 w-5" />;
                                                                if (requirement.includes('bed')) return <Bed className="h-5 w-5" />;
                                                                return <Check className="h-5 w-5" />;
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {typeof item === 'string' ? item : 'Requirement'}
                                                    </span>
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
                                >
                                    {/* Review Stats */}
                                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
                                        <div className="flex flex-col md:flex-row items-center justify-between">
                                            <div className="text-center md:text-left mb-4 md:mb-0">
                                                <div className="text-5xl font-bold text-gray-900 mb-2">
                                                    {tour.rating || 4.8}
                                                </div>
                                                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-5 w-5 ${i < Math.floor(tour.rating || 4.8)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600">
                                                    Based on {tour.totalReviews || 128} reviews
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <div key={star} className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600 w-8">{star} star</span>
                                                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400"
                                                                style={{ width: `${(star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 8 : star === 2 ? 2 : 0)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    <div className="space-y-6">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="bg-white rounded-2xl p-6 border">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-12 w-12 border-2 border-white shadow">
                                                            <AvatarImage src={review.user.avatar} />
                                                            <AvatarFallback>
                                                                {review.user.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900">{review.user.name}</h5>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <span>{review.user.country}</span>
                                                                {review.isVerified && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        <Check className="h-3 w-3 mr-1" />
                                                                        Verified
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 mb-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-4 w-4 ${i < review.rating
                                                                        ? 'fill-yellow-400 text-yellow-400'
                                                                        : 'text-gray-300'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(review.date).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700 mb-4">{review.comment}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <button className="flex items-center gap-1 hover:text-blue-600">
                                                        <Heart className="h-4 w-4" />
                                                        <span>Helpful ({review.likes})</span>
                                                    </button>
                                                    <button className="flex items-center gap-1 hover:text-blue-600">
                                                        <MessageCircle className="h-4 w-4" />
                                                        <span>Reply</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Load More Reviews */}
                                    <div className="text-center mt-8">
                                        <Button variant="outline" className="px-8">
                                            Load More Reviews
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'host' && (
                                <motion.div
                                    key="host"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Host Profile */}
                                    <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8">
                                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                            <div className="relative">
                                                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                                                    <AvatarImage src={tour.user?.profilePic || ''} />
                                                    <AvatarFallback className="text-3xl">
                                                        {tour.user?.name?.charAt(0) || 'G'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {tour.user?.verified && (
                                                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900">{tour.user?.name}</h3>
                                                        <p className="text-gray-600">Local Guide in {tour.city}</p>
                                                    </div>
                                                    <div className="mt-4 md:mt-0">
                                                        <Button variant="outline" className="gap-2">
                                                            <MessageCircle className="h-4 w-4" />
                                                            Contact Guide
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                                            {tour.user?.rating || 4.9}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Guide Rating</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                                            {tour.user?.totalReviews || 245}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Reviews</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
                                                        <div className="text-sm text-gray-600">Years Experience</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-gray-900 mb-1">
                                                            {tour.user?.languages?.length || 3}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Languages</div>
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-6">
                                                    {tour.user?.bio || "Passionate local guide with extensive knowledge of the area's history, culture, and hidden gems. I love sharing authentic experiences with travelers from around the world."}
                                                </p>

                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="h-5 w-5 text-blue-500" />
                                                        <span className="text-sm font-medium">Certified Tour Guide</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-5 w-5 text-green-500" />
                                                        <span className="text-sm font-medium">Verified ID & Background Check</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-5 w-5 text-purple-500" />
                                                        <span className="text-sm font-medium">
                                                            Speaks: {tour.user?.languages?.join(', ') || 'English, Spanish, French'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Host's Other Tours */}
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-6">
                                            Other Experiences by {tour.user?.name?.split(' ')[0]}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[1, 2, 3, 4].map((item) => (
                                                <div key={item} className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow">
                                                    <div className="h-40 bg-linear-to-r from-blue-100 to-cyan-100" />
                                                    <div className="p-4">
                                                        <h5 className="font-bold text-gray-900 mb-2">Sunset Photography Tour</h5>
                                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                                            <span>3 hours • $45/person</span>
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span>4.9</span>
                                                            </div>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            View Details
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
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
                                {/* Price Header */}
                                <div className="bg-linear-to-r from-blue-600 to-cyan-500 p-6 text-white">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <div>
                                            <span className="text-3xl font-bold">${tour.fee}</span>
                                            <span className="text-white/80 ml-1">/person</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <Star className="h-4 w-4 fill-white" />
                                            <span className="text-sm font-medium">{tour.rating || 4.8}</span>
                                        </div>
                                    </div>
                                    <p className="text-white/90">Instant confirmation • Free cancellation</p>
                                </div>

                                {/* Booking Form */}
                                <div className="p-6">
                                    {/* Date Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            <Calendar className="inline h-4 w-4 mr-2 text-blue-500" />
                                            Select Date
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availableDates.slice(0, 9).map((date) => (
                                                <button
                                                    key={date}
                                                    onClick={() => setSelectedDate(date)}
                                                    className={`p-3 rounded-lg border transition-all ${selectedDate === date
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="text-sm">
                                                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                                                    </div>
                                                    <div className="text-lg font-semibold">
                                                        {new Date(date).getDate()}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Time Selection */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            <Clock className="inline h-4 w-4 mr-2 text-blue-500" />
                                            Select Time
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`p-3 rounded-lg border transition-all ${selectedTime === time
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600 font-medium'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Participants */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            <Users className="inline h-4 w-4 mr-2 text-blue-500" />
                                            Participants
                                        </label>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                                                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-800"
                                                    disabled={participants <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="text-2xl font-bold text-gray-900">{participants}</span>
                                                <button
                                                    onClick={() => setParticipants(Math.min(tour.maxGroupSize, participants + 1))}
                                                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-800"
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

                                    {/* Price Summary */}
                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">${tour.fee} × {participants} person(s)</span>
                                                <span className="font-medium">${tour.fee * participants}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Service fee</span>
                                                <span className="font-medium">${(tour.fee * participants * 0.1).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3">
                                                <div className="flex justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-blue-600">
                                                        ${(tour.fee * participants * 1.1).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <Button
                                        onClick={handleBookingRequest}
                                        className="w-full py-6 text-lg font-bold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl"
                                    >
                                        Request to Book
                                    </Button>

                                    {/* Booking Info */}
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

                            {/* Safety Info */}
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