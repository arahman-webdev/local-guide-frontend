"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Loader2
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
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  /* -------------------- Fetch User -------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res?.data) {
          setUser(res.data);
          
          // Fetch wishlist if user is tourist
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

  // Listen for wishlist updates from other components
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
        { name: "Tours", href: "/tours", icon: <Compass className="h-4 w-4" />, roles: ["ALL"] },
        { name: "About", href: "/about", icon: <Info className="h-4 w-4" />, roles: ["ALL"] },
        { name: "Contact", href: "/contact", icon: <MapPin className="h-4 w-4" />, roles: ["ALL"] },
      ];
    }

    const baseItems: NavItem[] = [
      { name: "Home", href: "/", icon: <Home className="h-4 w-4" />, roles: ["ALL"] },
      { name: "Tours", href: "/tours", icon: <Compass className="h-4 w-4" />, roles: ["ALL"] },
    ];

    switch (user.role) {
      case "ADMIN":
        return [
          ...baseItems,
          { 
            name: "Admin Dashboard", 
            href: "/dashboard/admin", 
            icon: <Shield className="h-4 w-4" />, 
            roles: ["ADMIN"] 
          },
          { name: "Users", href: "/admin/users", icon: <User className="h-4 w-4" />, roles: ["ADMIN"] },
        ];
      case "GUIDE":
        return [
          ...baseItems,
          { 
            name: "Guide Dashboard", 
            href: "/dashboard/guide", 
            icon: <Briefcase className="h-4 w-4" />, 
            roles: ["GUIDE"] 
          },
          { name: "My Tours", href: "/guide/tours", icon: <MapPin className="h-4 w-4" />, roles: ["GUIDE"] },
        ];
      case "TOURIST":
        return [
          ...baseItems,
          { 
            name: "Dashboard", 
            href: "/dashboard/tourist", 
            icon: <User className="h-4 w-4" />, 
            roles: ["TOURIST"] 
          },
          { 
            name: "Bookings", 
            href: "/bookings", 
            icon: <Calendar className="h-4 w-4" />, 
            roles: ["TOURIST"] 
          },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

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

  /* -------------------- Render Navigation Items -------------------- */
  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    
    const linkClass = isMobile
      ? cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
          isActive
            ? "bg-blue-50 text-blue-700 font-semibold"
            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
        )
      : cn(
          "relative px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "text-blue-700"
            : "text-gray-700 hover:text-blue-600"
        );

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => isMobile && setIsOpen(false)}
        className={linkClass}
      >
        {isMobile && item.icon}
        {item.name}
        {isActive && !isMobile && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full" />
        )}
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
              <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-cyan-500 rounded-xl" />
              <div className="absolute inset-1 bg-white rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  LG
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">LocalGuide</span>
              <span className="text-xs text-gray-500 block">Explore Locally</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => renderNavItem(item, false))}
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
                    <Link
                      href={
                        user.role === "ADMIN"
                          ? "/dashboard/admin"
                          : user.role === "GUIDE"
                          ? "/dashboard/guide"
                          : "/dashboard/tourist"
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <User className="h-4 w-4" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    
                    <div className="relative group">
                      <Avatar className="h-9 w-9 cursor-pointer border-2 border-transparent group-hover:border-blue-500 transition-colors">
                        <AvatarImage src={user.profilePic} alt={user.name} />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-cyan-500 text-white">
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
                      className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5"
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
                  {navItems.map((item) => renderNavItem(item, true))}
                </div>

                {/* User Section */}
                {user ? (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex items-center gap-3 px-4 mb-4">
                      <Avatar>
                        <AvatarImage src={user.profilePic} />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-cyan-500 text-white">
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
                      className="block px-4 py-3 text-center bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg"
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