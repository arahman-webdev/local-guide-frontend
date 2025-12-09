// app/tours/[slug]/page.tsx
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
    AlertCircle
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
    const router = useRouter();
    const [tour, setTour] = useState<TourDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedStartTime, setSelectedStartTime] = useState<string>('');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('');
    const [participants, setParticipants] = useState(1);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'host'>('details');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Available time slots (30-minute intervals from 8 AM to 8 PM)
    // Helper to convert 24h to 12h format - DEFINE THIS FIRST
    // Helper to convert 24h to 12h format - DEFINE THIS FIRST
    const convertTo12Hour = (time24: string) => {
        // Add validation
        if (!time24 || typeof time24 !== 'string') {
            console.error('Invalid time24 input:', time24);
            return 'Invalid Time';
        }
        
        const parts = time24.split(':');
        console.log('Time24:', time24, 'Parts:', parts); // Debug log
        
        if (parts.length !== 2) {
            console.error('Invalid time format:', time24);
            return 'Invalid Time';
        }
        
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        
        // Validate numbers
        if (isNaN(hours) || isNaN(minutes)) {
            console.error('Invalid numbers in time:', time24, hours, minutes);
            return 'Invalid Time';
        }
        
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    // Available time slots (30-minute intervals from 8 AM to 8 PM)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const time12 = convertTo12Hour(time24); // Now this works
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
            // Validation
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

            // Check if user is logged in
            const token = localStorage.getItem('accessToken');
            if (!token) {
                toast.error('Please login to book this tour');
                router.push(`/login?redirect=/tours/${params.slug}`);
                return;
            }

            setBookingLoading(true);
            const loadingToast = toast.loading('Creating your booking...');

            // Convert to ISO string
            const startTimeISO = `${selectedDate}T${selectedStartTime}:00Z`;
            const endTimeISO = `${selectedDate}T${selectedEndTime || calculateEndTime(selectedStartTime)}:00Z`;

            console.log('Booking details:', {
                tourId: tour.id,
                startTime: startTimeISO,
                endTime: endTimeISO,
                participants
            });

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
            toast.dismiss(loadingToast);

            console.log('Booking response:', result);

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
                    // Success without payment
                    toast.success('Booking Confirmed!', {
                        description: `Booking Code: ${result.data.booking?.bookingCode || 'Success'}`,
                        action: result.data.booking?.id ? {
                            label: 'View Details',
                            onClick: () => router.push(`/bookings/${result.data.booking.id}`)
                        } : undefined
                    });

                    // Reset form
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

    // Calculate total price
    const calculateTotal = () => {
        if (!tour) return 0;
        const basePrice = tour.fee * participants;
        const serviceFee = basePrice * 0.1;
        return (basePrice + serviceFee).toFixed(2);
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
                    <div className="h-full w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
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
                                    { id: 'reviews', label: `Reviews (${tour.totalReviews || 0})` },
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

                        {/* Tab Content - Same as before, shortened for brevity */}
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
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
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
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
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

                                    {/* Start Time Selection */}
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

                                    {/* End Time Display */}
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

                                    {/* Participants */}
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

                                    {/* Price Summary */}
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

                                    {/* Book Button */}
                                    <Button
                                        onClick={handleBookingRequest}
                                        disabled={!selectedDate || !selectedStartTime || bookingLoading}
                                        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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

                                    {/* Requirements Check */}
                                    {(!selectedDate || !selectedStartTime) && (
                                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-yellow-700">
                                                Please select a date and start time to book this tour.
                                            </p>
                                        </div>
                                    )}

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