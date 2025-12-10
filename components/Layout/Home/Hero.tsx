'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, MapPin, Star, Users, Globe } from 'lucide-react';
import Link from 'next/link';
import heroBg from "@/app/images/hero-bg.png";

export default function Hero() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      router.push(`/tours?city=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/tours');
    }
  };

  // Popular Bangladeshi destinations
  const popularDestinations = [
    { name: 'Dhaka', type: 'city', icon: '🏙️' },
    { name: 'Chittagong', type: 'city', icon: '⛰️' },
    { name: 'Sylhet', type: 'city', icon: '🍵' },
    { name: 'Cox\'s Bazar', type: 'beach', icon: '🏖️' },
    { name: 'Sundarbans', type: 'nature', icon: '🐯' },
    
  ];

  const popularCategories = [
    { name: 'Food Tours', category: 'FOOD', icon: '🍜' },
    { name: 'History', category: 'HISTORY', icon: '🏛️' },
    { name: 'Adventure', category: 'ADVENTURE', icon: '🧗' },
    { name: 'Nature', category: 'NATURE', icon: '🌿' },
  ];

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat pt-24 pb-20 lg:pt-32 lg:pb-48 xl:pt-40 xl:pb-56 text-white overflow-hidden"
      style={{ backgroundImage: `url(${heroBg.src})` }}
    >
      {/* Animated linear Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-900/70 via-purple-900/60 to-pink-800/50 backdrop-blur-[2px]"></div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with badges */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium">5000+ Authentic Experiences</span>
            <Star className="w-4 h-4 text-yellow-300 ml-2" />
          </div>

          <h1 className="text-5xl md:text-7xl  font-bold mb-6 leading-tight text-center">
            <span className="bg-linear-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              Discover Bangladesh
            </span>
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl font-extrabold bg-linear-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              With Local Experts
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl text-center leading-relaxed">
            Immerse yourself in authentic experiences guided by passionate locals. 
            From bustling cities to serene landscapes.
          </p>

          {/* Main Search Card */}
          <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-1 border border-white/20 shadow-2xl">
              <div className="bg-linear-to-br from-white/5 to-white/0 rounded-2xl p-6">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-400 rounded-xl">
                      <Search className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Where would you like to explore?
                    </h2>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-cyan-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-cyan-300" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Enter city, destination, or experience..."
                            className="flex-1 bg-transparent outline-none text-white placeholder-white/60 text-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="group relative overflow-hidden bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-10 py-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Explore Now
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </form>

                {/* Quick Search Sections */}
                <div className="mt-8 space-y-6">
                  {/* Popular Cities */}
                  <div>
                    <h3 className="text-lg font-semibold text-white/80 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-300" />
                      Popular Cities in Bangladesh
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {popularDestinations.map((dest) => (
                        <button
                          key={dest.name}
                          type="button"
                          onClick={() => router.push(`/tours?city=${dest.name}`)}
                          className="group relative overflow-hidden bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl px-5 py-3 flex items-center gap-2 transition-all duration-300 hover:scale-[1.05]"
                        >
                          <span className="text-xl">{dest.icon}</span>
                          <span className="font-medium">{dest.name}</span>
                          <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-cyan-400/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-400/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div>
                    <h3 className="text-lg font-semibold text-white/80 mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-300" />
                      Trending Experiences
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {popularCategories.map((cat) => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => router.push(`/tours?category=${cat.category}`)}
                          className="group relative overflow-hidden bg-linear-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl px-5 py-3 flex items-center gap-2 transition-all duration-300 hover:scale-[1.05]"
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span className="font-medium">{cat.name}</span>
                          <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-white/70 text-sm">Local Guides</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                2,000+
              </div>
              <div className="text-white/70 text-sm">Authentic Tours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-white/70 text-sm">Satisfaction Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link href="/register?role=guide" className="group relative">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Button className="relative bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-10 py-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02]">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Become a Local Guide
                </span>
              </Button>
            </Link>

            <Link href="/tours">
              <Button 
                variant="outline" 
                className="border-2 border-white/30 hover:border-white/50 bg-transparent hover:bg-white/10 text-white px-10 py-6 rounded-2xl text-lg font-bold transition-all duration-300"
              >
                Browse All Experiences →
              </Button>
            </Link>
           
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="rgba(255,255,255,0.1)"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Add custom animation for floating elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float infinite linear;
        }
      `}</style>
    </section>
  );
}