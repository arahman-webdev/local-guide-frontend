"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Heart,
  User,
  LogOut,
  Home,
  Compass,
  Calendar,
  Shield,
  MapPin,
  Info,
  Briefcase,
  Loader2,
  ChevronDown,
  Palette,
  Utensils,
  Mountain,
  Moon,
  ShoppingBag,
  BookOpen,
  Castle,
  Leaf,
  Sparkles,
  Star,
  TrendingUp,
  Award,
  Globe,
  Clock,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getMyProfile, logOut } from "@/app/utils/auth";
import art from "@/app/images/art.png"
import food from "@/app/images/food.png" 
import adventure from "@/app/images/adventure.png"
import nightlife from "@/app/images/nightlife.avif"
import shopping from "@/app/images/shopping.webp"
import history from "@/app/images/history.webp"
import heritage from "@/app/images/herritage.webp"
import nature from "@/app/images/nature.avif"
import Image from "next/image";

type UserType = {
  name: string;
  email?: string;
  role?: "ADMIN" | "GUIDE" | "TOURIST";
  profilePic?: string;
};

type NavItem = {
  name: string;
  href: string;
  icon?: React.ReactNode;
  roles?: ("ADMIN" | "GUIDE" | "TOURIST" | "ALL")[];
  megaMenu?: boolean;
};




const tourCategories = [
  { 
    name: "Art", 
    slug: "ART",
    icon: <Palette className="h-5 w-5" />, 
    count: "85+",
    image: art, // Use imported image
    color: "from-purple-500 to-pink-500",
    description: "Creative tours, galleries & workshops"
  },
  { 
    name: "Food", 
    slug: "FOOD",
    icon: <Utensils className="h-5 w-5" />, 
    count: "120+",
    image: food, // Use imported image
    color: "from-amber-500 to-orange-500",
    description: "Culinary experiences & food trails"
  },
  { 
    name: "Adventure", 
    slug: "ADVENTURE",
    icon: <Mountain className="h-5 w-5" />, 
    count: "95+",
    image: adventure,
    color: "from-green-500 to-emerald-500",
    description: "Thrilling activities & outdoor adventures"
  },
  { 
    name: "Nightlife", 
    slug: "NIGHTLIFE",
    icon: <Moon className="h-5 w-5" />, 
    count: "45+",
    image: nightlife,
    color: "from-indigo-500 to-purple-500",
    description: "Evening tours & entertainment"
  },
  { 
    name: "Shopping", 
    slug: "SHOPPING",
    icon: <ShoppingBag className="h-5 w-5" />, 
    count: "60+",
    image: shopping,
    color: "from-blue-500 to-cyan-500",
    description: "Markets, boutiques & local crafts"
  },
  { 
    name: "History", 
    slug: "HISTORY",
    icon: <BookOpen className="h-5 w-5" />, 
    count: "75+",
    image: history,
    color: "from-yellow-500 to-amber-500",
    description: "Historical sites & cultural insights"
  },
  { 
    name: "Heritage", 
    slug: "HERITAGE",
    icon: <Castle className="h-5 w-5" />, 
    count: "55+",
    image: heritage,
    color: "from-red-500 to-pink-500",
    description: "UNESCO sites & ancient monuments"
  },
  { 
    name: "Nature", 
    slug: "NATURE",
    icon: <Leaf className="h-5 w-5" />, 
    count: "110+",
    image: nature,
    color: "from-green-500 to-teal-500",
    description: "Parks, wildlife & natural wonders"
  },
];

// Popular destinations
const popularDestinations = [
  { name: "Dhaka", tours: 78, href: "/tours?city=dhaka" },
  { name: "Cox's Bazar", tours: 42, href: "/tours?city=coxs-bazar" },
  { name: "Sundarbans", tours: 28, href: "/tours?city=sundarbans" },
  { name: "Sylhet", tours: 35, href: "/tours?city=sylhet" },
  { name: "Chittagong", tours: 31, href: "/tours?city=chittagong" },
  { name: "Rangamati", tours: 19, href: "/tours?city=rangamati" },
];



export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [megaMenuTimeout, setMegaMenuTimeout] = useState<NodeJS.Timeout | null>(null);

  /* -------------------- Fetch User -------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res?.data) {
          setUser(res.data);

          if (res.data.role === "TOURIST") {
            await fetchWishlistCount();
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  /* -------------------- Fetch Wishlist Count -------------------- */
  const fetchWishlistCount = async () => {
    try {
      setWishlistLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        "https://local-guide-backend-nine.vercel.app/api/wishlist/my-wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setWishlistCount(data?.data?.length || 0);
      }
    } catch (error) {
      console.error("Wishlist fetch failed", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (user?.role === "TOURIST") {
        fetchWishlistCount();
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlist-updated", handleWishlistUpdate);
  }, [user]);

  /* -------------------- Navigation Items -------------------- */
  const getNavItems = (): NavItem[] => {
    if (!user) {
      return [
        { name: "Home", href: "/", icon: <Home className="h-4 w-4" />, roles: ["ALL"] },
        { name: "Tours", href: "/tours", icon: <Compass className="h-4 w-4" />, roles: ["ALL"], megaMenu: true },
        { name: "About", href: "/about", icon: <Info className="h-4 w-4" />, roles: ["ALL"] },
        { name: "Contact", href: "/contact", icon: <Info className="h-4 w-4" />, roles: ["ALL"] },
      ];
    }

    const baseItems: NavItem[] = [
      { name: "Home", href: "/", icon: <Home className="h-4 w-4" />, roles: ["ALL"] },
      { name: "Tours", href: "/tours", icon: <Compass className="h-4 w-4" />, roles: ["ALL"], megaMenu: true },
      
    ];

    switch (user.role) {
      case "ADMIN":
        return [
          ...baseItems,
          { name: "Dashboard", href: "/dashboard/admin", icon: <Shield className="h-4 w-4" />, roles: ["ADMIN"] },
          { name: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" />, roles: ["ADMIN"] },
        ];
      case "GUIDE":
        return [
          ...baseItems,
          { name: "Dashboard", href: "/dashboard/guide", icon: <Briefcase className="h-4 w-4" />, roles: ["GUIDE"] },
          { name: "My Tours", href: "/guide/my-tours", icon: <MapPin className="h-4 w-4" />, roles: ["GUIDE"] },
        ];
      case "TOURIST":
        return [
          ...baseItems,
          { name: "Dashboard", href: "/dashboard/tourist", icon: <User className="h-4 w-4" />, roles: ["TOURIST"] },
          { name: "Bookings", href: "/dashboard/tourist/bookings", icon: <Calendar className="h-4 w-4" />, roles: ["TOURIST"] },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  /* -------------------- Mega Menu Component -------------------- */
  const MegaMenu = () => {
    return (
      <AnimatePresence>
        {activeMegaMenu === "Tours" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute -left-[470px] right-0 w-screen max-w-7xl mx-auto  mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50"
            onMouseEnter={() => {
              if (megaMenuTimeout) clearTimeout(megaMenuTimeout);
              setActiveMegaMenu("Tours");
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => {
                setActiveMegaMenu(null);
              }, 150);
              setMegaMenuTimeout(timeout);
            }}
          >
            <div className="p-8">
              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Explore Categories & Experiences
                </h3>
                <p className="text-gray-600">
                  Discover authentic local tours curated by expert guides
                </p>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-12 gap-8">
                {/* Categories with Images - Left Column */}
                <div className="col-span-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Compass className="h-5 w-5" />
                    Popular Categories
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                   

                  
                    {tourCategories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="group relative overflow-hidden rounded-xl cursor-pointer"
                        onClick={() => {
                          router.push(`/tours?category=${category.slug}`);
                          setActiveMegaMenu(null);
                        }}
                      >
                        {/* Category Image with Next.js Image Component */}
                        <div className="relative h-40 overflow-hidden rounded-xl">
                          <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 z-10`} />
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white z-20">
                            <div className="mb-3 p-3 bg-white/20 backdrop-blur-sm rounded-full">
                              {category.icon}
                            </div>
                            <h5 className="font-bold text-lg text-center">{category.name}</h5>
                            <p className="text-sm text-white/90 text-center mt-1">{category.count} Tours</p>
                          </div>
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                            <span className="text-white font-semibold">Explore Tours</span>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-600 text-center">
                            {category.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Other Links */}
                <div className="col-span-4 space-y-8">
                  {/* Popular Destinations */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Top Destinations
                    </h4>
                    <div className="space-y-3">
                      {popularDestinations.map((dest) => (
                        <Link
                          key={dest.name}
                          href={dest.href}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 group transition-colors"
                          onClick={() => setActiveMegaMenu(null)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Globe className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800">{dest.name}</span>
                              <p className="text-xs text-gray-500">{dest.tours} tours available</p>
                            </div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-gray-400 -rotate-90 group-hover:text-blue-600" />
                        </Link>
                      ))}
                    </div>
                  </div>




                </div>
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Need Personalized Help?</h4>
                      <p className="text-sm text-gray-600">Our travel experts can create a custom itinerary</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setActiveMegaMenu(null);
                      router.push('/contact');
                    }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    Get Free Consultation
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  /* -------------------- Logout Handler -------------------- */
  const handleLogout = async () => {
    try {
      await logOut();
      setUser(null);
      setWishlistCount(0);
      toast.success("Successfully logged out");
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout failed:", error);
    }
  };

  /* -------------------- Handle Mega Menu Hover -------------------- */
  const handleMegaMenuEnter = (itemName: string) => {
    if (megaMenuTimeout) clearTimeout(megaMenuTimeout);
    setActiveMegaMenu(itemName);
  };

  const handleMegaMenuLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
    setMegaMenuTimeout(timeout);
  };

  /* -------------------- Render Desktop Nav Item -------------------- */
  const renderDesktopNavItem = (item: NavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    const hasMegaMenu = item.megaMenu;

    return (
      <div
        key={item.name}
        className="relative"
        onMouseEnter={() => hasMegaMenu && handleMegaMenuEnter(item.name)}
        onMouseLeave={handleMegaMenuLeave}
      >
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-1 px-4 py-3 text-sm font-medium transition-colors relative group/nav",
            isActive
              ? "text-blue-700"
              : "text-gray-700 hover:text-blue-600"
          )}
        >
          {item.name}
          {hasMegaMenu && (
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-300",
              activeMegaMenu === item.name ? "rotate-180" : ""
            )} />
          )}
          {isActive && !hasMegaMenu && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-blue-600 rounded-full" />
          )}
        </Link>

        {/* Mega Menu */}
        {hasMegaMenu && <MegaMenu />}
      </div>
    );
  };

  const renderMobileNavItem = (item: NavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
          isActive
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
        )}
      >
        {item.icon}
        {item.name}
      </Link>
    );
  };

  /* -------------------- Render Loading States -------------------- */
  const renderLoadingSkeleton = () => (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b p-3 shadow-sm supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl" />
              <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  LG
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">LocalGuide</span>
              <span className="text-xs text-gray-500 block">Explore Bangladesh Locally</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {navItems.map((item) => renderDesktopNavItem(item))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              renderLoadingSkeleton()
            ) : (
              <>
                {/* Wishlist for Tourists */}
                {user?.role === "TOURIST" && (
                  <Link
                    href="/dashboard/tourist/favorites"
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                    title="My Favorites"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-colors",
                        pathname.includes("/favorites")
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600 group-hover:text-red-500"
                      )}
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in fade-in zoom-in-50">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                    {wishlistLoading && (
                      <div className="absolute -top-1 -right-1">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      </div>
                    )}
                  </Link>
                )}

                {/* User Menu */}
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent group-hover:border-blue-500 transition-colors">
                        <AvatarImage src={user.profilePic} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="px-3 py-2 border-b">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <Badge className="mt-1 capitalize" variant="outline">
                            {user.role?.toLowerCase()}
                          </Badge>
                        </div>
                        <Link
                          href={
                            user.role === "ADMIN"
                              ? "/dashboard/admin"
                              : user.role === "GUIDE"
                                ? "/dashboard/guide"
                                : "/dashboard/tourist"
                          }
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            {user?.role === "TOURIST" && (
              <Link
                href="/dashboard/tourist/favorites"
                className="relative p-2"
              >
                <Heart
                  className={cn(
                    "h-5 w-5",
                    pathname.includes("/favorites")
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  )}
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:border-gray-400"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                  <SheetDescription className="text-left">
                    {user ? `Welcome back, ${user.name}` : "Explore LocalGuide"}
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile Navigation Items */}
                <div className="mt-6 space-y-1">
                  {navItems.map((item) => renderMobileNavItem(item))}
                </div>

                {/* User Section */}
                {user ? (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center gap-3 px-4 mb-4">
                      <Avatar>
                        <AvatarImage src={user.profilePic} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                          {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {user.role?.toLowerCase()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={
                          user.role === "ADMIN"
                            ? "/dashboard/admin"
                            : user.role === "GUIDE"
                              ? "/dashboard/guide"
                              : "/dashboard/tourist"
                        }
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium"
                      >
                        <User className="h-4 w-4" />
                        Go to Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}