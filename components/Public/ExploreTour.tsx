'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Globe } from 'lucide-react';
import TourCard from './TourCard';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';

// Loading component
function ExploreTourLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-blue-500/50 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-blue-500/50 rounded w-1/3 mb-8"></div>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex-1">
                <div className="h-4 bg-blue-500/50 rounded w-24 mb-2"></div>
                <div className="h-10 bg-white/20 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-blue-500/50 rounded w-24 mb-2"></div>
                <div className="h-10 bg-white/20 rounded"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-blue-500/50 rounded w-24 mb-2"></div>
                <div className="h-10 bg-white/20 rounded"></div>
              </div>
              <div className="flex items-end">
                <div className="h-10 bg-blue-500/70 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tours List Skeleton */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-48"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 bg-gray-300 rounded w-32"></div>
                <div className="h-10 bg-gray-300 rounded w-32"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main content component wrapped in Suspense
function ExploreTourContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [orderBy, setOrderBy] = useState(searchParams.get('orderBy') || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [totalTours, setTotalTours] = useState(0);

  // Language options
  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 
    'Japanese', 'Chinese', 'Korean', 'Arabic', 'Russian',
    'Portuguese', 'Hindi', 'Bengali', 'Turkish'
  ];

  // Build query parameters only for non-default values
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    if (page !== 1) params.append('page', page.toString());
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (category) params.append('category', category);
    if (city) params.append('city', city);
    if (language) params.append('language', language);
    if (sortBy !== 'createdAt') params.append('sortBy', sortBy);
    if (orderBy !== 'desc') params.append('orderBy', orderBy);
    if (selectedDate) params.append('date', selectedDate);
    if (priceRange[0] !== 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] !== 10000) params.append('maxPrice', priceRange[1].toString());
    
    return params;
  };

  // Fetch tours based on filters
  const fetchTours = async () => {
    setLoading(true);
    try {
      const params = buildQueryParams();
      
      // Update URL - only if there are any params
      const queryString = params.toString();
      const newUrl = queryString ? `/tours?${queryString}` : '/tours';
      
      // Only push to router if not initial load
      if (!isInitialLoad) {
        router.push(newUrl);
      }

      // For the API call
      const apiParams = new URLSearchParams();
      apiParams.append('page', page.toString());
      apiParams.append('limit', '5');
      
      if (searchTerm) apiParams.append('searchTerm', searchTerm);
      if (category) apiParams.append('category', category);
      if (city) apiParams.append('city', city);
      if (language) apiParams.append('language', language);
      if (sortBy) apiParams.append('sortBy', sortBy);
      if (orderBy) apiParams.append('orderBy', orderBy);
      if (selectedDate) apiParams.append('date', selectedDate);
      if (priceRange[0] > 0) apiParams.append('minPrice', priceRange[0].toString());
      if (priceRange[1] < 10000) apiParams.append('maxPrice', priceRange[1].toString());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tour?${apiParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setTours(data.data || []);
        setTotalTours(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.error('API returned success: false', data);
        setTours([]);
        setTotalTours(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
      setTotalTours(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTours();
  }, []);

  // Fetch when page changes
  useEffect(() => {
    if (!isInitialLoad) {
      fetchTours();
    }
  }, [page]);

  // Fetch when sort or order changes
  useEffect(() => {
    if (!isInitialLoad) {
      setPage(1);
      fetchTours();
    }
  }, [sortBy, orderBy]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTours();
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setCity('');
    setLanguage('');
    setPriceRange([0, 10000]);
    setSelectedDate('');
    setSortBy('createdAt');
    setOrderBy('desc');
    setPage(1);
    setTimeout(() => fetchTours(), 0);


  };


    console.log("from tour page",tours)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discover Authentic Local Experiences</h1>
          <p className="text-blue-100 text-lg mb-8">
            Book unique tours with passionate local guides
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-4 shadow-xl">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Search className="ml-1 text-gray-400" size={18} />
                  <label className="ml-2 text-sm text-gray-600">Search tours</label>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tour titles, descriptions..."
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <MapPin className="ml-1 text-gray-400" size={18} />
                  <label className="ml-2 text-sm text-gray-600">City</label>
                </div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Globe className="ml-1 text-gray-400" size={18} />
                  <label className="ml-2 text-sm text-gray-600">Language</label>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">All Languages</option>
                  {languageOptions.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-300 h-[42px]"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <FilterSidebar
                category={category}
                setCategory={setCategory}
                city={city}
                setCity={setCity}
                language={language}
                setLanguage={setLanguage}
                languageOptions={languageOptions}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onApplyFilters={() => {
                  setPage(1);
                  fetchTours();
                }}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Tours List */}
          <div className="lg:w-3/4">
            {/* Header with controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {loading ? 'Loading...' : `Found ${totalTours} Tours`}
                </h2>
                <p className="text-gray-600">
                  Showing {tours.length} tours on this page
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="createdAt">Newest</option>
                    <option value="fee">Price</option>
                    <option value="title">Title</option>
                  </select>
                  
                  <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                {/* Map Toggle */}
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    showMap 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MapPin size={20} />
                  {showMap ? 'List View' : 'Map View'}
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {(category || city || language || priceRange[0] > 0 || priceRange[1] < 10000 || selectedDate) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-blue-800">Active Filters:</h3>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Category: {category} ×
                    </span>
                  )}
                  {city && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      City: {city} ×
                    </span>
                  )}
                  {language && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Language: {language} ×
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Price: ${priceRange[0]} - ${priceRange[1]} ×
                    </span>
                  )}
                  {selectedDate && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Date: {selectedDate} ×
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 rounded w-1/2" />
                      <div className="h-3 bg-gray-300 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* No Results */}
                {tours.length === 0 && (
                  <div className="text-center py-12">
                    <Search size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No tours found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search or filters
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalTours > 0 && totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function ExploreTour() {
  return (
    <Suspense fallback={<ExploreTourLoading />}>
      <ExploreTourContent />
    </Suspense>
  );
}