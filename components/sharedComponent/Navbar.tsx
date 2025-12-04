"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/app/images/logo.png";
import Link from "next/link";
import { Menu } from "lucide-react";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { getMyProfile, logOut } from "@/app/utility/auth";
import { ProfileOpen } from "../Layout/Auth/ProfileOpen";

export default function Navbar() {
    const pathName = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; role?: string,profilePic:string } | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getMyProfile();
            setUser(response?.data || null);
            setLoading(false)
        };
        fetchUser();
    }, [pathName]);

    // Logout
    const handleLogout = async () => {
        const response = await logOut();
        if (response.success) setUser(null);
    };

    // Navigation items by role
    const navItems = user
        ? user.role === "ADMIN"
            ? [
                { name: "Home", href: "/" },
                { name: "Admin Dashboard", href: "/admin" },
                { name: "Manage Users", href: "/admin/users" },
                { name: "Manage Listings", href: "/admin/listings" },
            ]
            : user.role === "GUIDE"
                ? [
                    { name: "Home", href: "/" },
                    { name: "Explore Tours", href: "/tours" },
                    { name: "Dashboard", href: "/dashboard" },
                    { name: "Profile", href: "/profile" },
                ]
                : [
                    { name: "Home", href: "/" },
                    { name: "Explore Tours", href: "/tours" },
                    { name: "My Bookings", href: "/bookings" },
                    { name: "Profile", href: "/profile" },
                ]
        : [
            { name: "Home", href: "/" },
            { name: "Explore Tours", href: "/tours" },
            { name: "Become a Guide", href: "/register?role=guide" },

        ];

        console.log(user)

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-md">
            
            <div className="w-full px-4 flex justify-between items-center h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image src={logo} alt="Logo" width={160} height={60} />
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex gap-6 font-semibold text-blue-700 uppercase tracking-wider">
                    {navItems.map((item) =>
                        item.name === "Logout" ? (
                            <button
                                key={item.name}
                                onClick={handleLogout}
                                className="hover:text-indigo-500 transition-colors"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`transition-colors ${pathName === item.href ? "text-indigo-500 underline" : "hover:text-indigo-500"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        )
                    )}
                </ul>

                {/* Desktop Profile */}
                <div>


                  {
                    !loading && (
                           user ? (
                        <div className="hidden lg:block">
                            <ProfileOpen name={user.name} role={user.role} profilePic={user.profilePic} logout={handleLogout} />
                        </div>
                    ) : (
                        <div className="flex gap-2.5">

                            <Link
                                href="/login"
                                className="w-full bg-linear-to-r from-indigo-500 via-blue-900 to-blue-600 text-center text-white font-semibold py-2 px-5 rounded-md shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="w-full bg-linear-to-r from-red-500 via-red-900 to-red-600 text-center text-white font-semibold py-2 px-5 rounded-md shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                                SignUp
                            </Link>
                        </div>

                    )
                    )
                  }
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden bg-blue-50">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline">
                                <Menu size={24} />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <ul className="flex flex-col gap-4 mt-4">
                                {navItems.map((item) =>
                                    item.name === "Logout" ? (
                                        <button
                                            key={item.name}
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            className="text-left font-semibold text-blue-700 hover:text-indigo-500"
                                        >
                                            Logout
                                        </button>
                                    ) : (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`font-semibold text-blue-700 hover:text-indigo-500`}
                                        >
                                            {item.name}
                                        </Link>
                                    )
                                )}
                            </ul>
                            {user && (
                                <div className="mt-6 border-8">
                                    <ProfileOpen name={user.name} role={user.role} profilePic={user.profilePic} logout={handleLogout}/>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
