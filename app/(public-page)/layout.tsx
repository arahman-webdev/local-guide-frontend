// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/sharedComponent/Navbar";
import Footer from "@/components/sharedComponent/Footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discover Authentic Local Experiences & Guided Tours | LocalGuide",
  description: "Book unique local tours and authentic travel experiences with expert local guides. Discover hidden gems, cultural adventures, and personalized trips worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
       
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}