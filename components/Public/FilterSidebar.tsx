'use client';

import React from 'react';
import { Filter, X, MapPin, Globe } from 'lucide-react';

const categories = [
  'FOOD',
  'ART',
  'ADVENTURE',
  'HISTORY',
  'NIGHTLIFE',
  'NATURE',
  'WILDLIFE',
  'SHOPPING'
];

interface FilterSidebarProps {
  category: string;
  setCategory: (category: string) => void;
  city: string;
  setCity: (city: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  languageOptions: string[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onApplyFilters: () => void;
  onReset: () => void;
}

export default function FilterSidebar({
  category,
  setCategory,
  city,
  setCity,
  language,
  setLanguage,
  languageOptions,
  priceRange,
  setPriceRange,
  selectedDate,
  setSelectedDate,
  onApplyFilters,
  onReset
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MapPin size={16} />
          City
        </h4>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                category === cat
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      {/* <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Globe size={16} />
          Language
        </h4>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Languages</option>
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div> */}

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
        <div className="px-2">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="10"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max="10000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Tour Date</h4>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>



      {/* Apply Filters Button */}
      <button
        onClick={onApplyFilters}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
      >
        Apply Filters
      </button>
    </div>
  );
}