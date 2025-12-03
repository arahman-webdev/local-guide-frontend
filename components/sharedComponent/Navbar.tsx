

"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import logo from "@/app/images/logo.png";
import Link from "next/link";
import { PhoneCall, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { getMyProfile } from "@/app/utility/auth";



export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();

    const [user, setUser] = useState<{ name: string; role?: string } | null>(null);
    const [loading, setLoading] = useState(true);

  

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getMyProfile()
            setUser(response?.data || null)
        }
        fetchUser()
    }, [])

    if(loading){
        <div>Loadig.......</div>
    }

    console.log("user", user)


    // ✅ Handle logout
    const handleLogout = async () => {
        try {
            const res = await fetch(
                "https://abdurrahman-dev-portfolio-backend.vercel.app/api/v1/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (res.ok) {
                setUser(null);
                console.log("✅ Logged out successfully");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 py-5 px-3 bg-transparent">
            <div className="flex justify-between items-center container mx-auto">
                {/* Logo + Links */}
                <div className="flex items-center gap-10">
                    <Image src={logo} alt="logo" width={140} height={140} />

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex gap-6 font-medium uppercase tracking-wide">
                        {[
                            { name: "Home", href: "/" },
                            { name: "About", href: "/about" },
                            { name: "Blog", href: "/blog" },
                            { name: "Project", href: "/project" },
                            { name: "Products", href: "/products" },
                            { name: "Contact", href: "/contact" },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${pathName === item.href
                                        ? "text-blue-400 underline"
                                        : "text-white hover:text-indigo-400"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </ul>
                </div>

                {/* Right Section */}
                <div className="hidden lg:flex gap-10 items-center">
                    <div className="flex items-center gap-3 text-white">
                        <PhoneCall className="text-indigo-400" />
                        <div className="leading-tight">
                            <p className="text-gray-300 text-sm">Have any question? {user?.name}</p>
                            <p className="font-bold text-white">+880 1719617907</p>
                        </div>
                    </div>

                    {!loading && (
                        <>
                            {user ? (
                                // <ProfileOpen name={user.name} role={user.role} MyDashboard='' logout={handleLogout} />
                                <div>Logout</div>

                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-linear-to-r from-indigo-500 via-purple-500 to-blue-600 text-white text-sm rounded-md py-2 px-6 font-semibold uppercase shadow-lg hover:scale-105 transition-transform duration-300"
                                >
                                    Login
                                </Link>
                            )}
                        </>
                    )}
                </div>

                
            </div>

          
        </nav>
    );
}