'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import TourCard from './TourCard';
import FilterSidebar from './FilterSidebar';
import Pagination from './Pagination';

export default function ExploreTour() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('searchTerm') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [orderBy, setOrderBy] = useState(searchParams.get('orderBy') || 'desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [totalTours, setTotalTours] = useState(0);

  // Build query parameters only for non-default values
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    // Only add page if not 1
    if (page !== 1) params.append('page', page.toString());
    
    // Only add searchTerm if not empty
    if (searchTerm) params.append('searchTerm', searchTerm);
    
    // Only add category if not empty
    if (category) params.append('category', category);
    
    // Only add sortBy if not 'createdAt' (default)
    if (sortBy !== 'createdAt') params.append('sortBy', sortBy);
    
    // Only add orderBy if not 'desc' (default)
    if (orderBy !== 'desc') params.append('orderBy', orderBy);
    
    // Only add date if selected
    if (selectedDate) params.append('date', selectedDate);
    
    // Only add price filters if not default [0, 1000]
    if (priceRange[0] !== 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] !== 1000) params.append('maxPrice', priceRange[1].toString());
    
    return params;
  };

  // Fetch tours based on filters
  const fetchTours = async (isCategoryChange = false) => {
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

      // For the API call, we need all parameters
      const apiParams = new URLSearchParams();
      apiParams.append('page', page.toString());
      apiParams.append('limit', '5'); // Request 9 items per page
      
      // Add filters only if they have values
      if (searchTerm) apiParams.append('searchTerm', searchTerm);
      if (category) apiParams.append('category', category);
      if (sortBy) apiParams.append('sortBy', sortBy);
      if (orderBy) apiParams.append('orderBy', orderBy);
      if (selectedDate) apiParams.append('date', selectedDate);
      if (priceRange[0] > 0) apiParams.append('minPrice', priceRange[0].toString());
      if (priceRange[1] < 1000) apiParams.append('maxPrice', priceRange[1].toString());

      console.log('API Request URL:', `http://localhost:5000/api/tour?${apiParams.toString()}`);
      
      const response = await fetch(`http://localhost:5000/api/tour?${apiParams.toString()}`);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success) {
        setTours(data.data || []);
        setTotalTours(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        
        // Debug: Check what we received
        console.log('Received tours:', data.data?.length);
        console.log('Total tours in DB:', data.pagination?.total);
        console.log('Pagination data:', data.pagination);
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
      setPage(1); // Reset to page 1 when sorting changes
      fetchTours();
    }
  }, [sortBy, orderBy]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTours();
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('');
    setPriceRange([0, 1000]);
    setSelectedDate('');
    setSortBy('createdAt');
    setOrderBy('desc');
    setPage(1);
    // Fetch immediately after reset
    setTimeout(() => fetchTours(), 0);
  };

  // Handle apply filters from sidebar
  const handleApplyFilters = () => {
    setPage(1);
    fetchTours(true);
  };

  // Handle category change from sidebar
  const handleCategoryChange = (newCategory: string) => {
    // Toggle category off if clicking the same one
    const finalCategory = category === newCategory ? '' : newCategory;
    setCategory(finalCategory);
    setPage(1);
    // Fetch immediately after category change
    setTimeout(() => fetchTours(true), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discover Authentic Local Experiences</h1>
          <p className="text-blue-100 text-lg mb-8">
            Book unique tours with passionate local guides
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-2 shadow-xl">
              <div className="flex-1 flex items-center">
                <Search className="ml-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for tours, cities, or guides..."
                  className="w-full px-4 py-3 text-gray-800 outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300"
              >
                Search
              </button>
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
                setCategory={handleCategoryChange}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onApplyFilters={handleApplyFilters}
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
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="createdAt">Newest</option>
                  <option value="fee">Price</option>
                  <option value="title">Title</option>
                </select>
                
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>

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
                {/* Tours Grid - Show actual number of tours returned */}
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