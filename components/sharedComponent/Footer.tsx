"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Shield, 
  Users,
  Calendar,
  Heart
} from "lucide-react";

const Footer = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <footer className="bg-linear-to-b from-gray-900 to-black text-white">
      {/* Newsletter Section */}
      <div className="bg-linear-to-r from-blue-900 to-purple-900 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Subscribe to our newsletter for tour updates and travel tips</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <button className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-3 text-center md:text-left">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-linear-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  TourGuide Pro
                </h2>
                <p className="text-sm text-gray-400">Authentic Experiences</p>
              </div>
            </div>
            
            <p className="text-gray-400 leading-relaxed">
              Connecting passionate travelers with expert local guides for unforgettable adventures and authentic cultural experiences worldwide.
            </p>
            
            <div className="pt-4">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm">Verified Guides • Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-sm">24/7 Customer Support</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-gray-800 flex items-center gap-2">
              <span className="bg-linear-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Calendar className="h-4 w-4" />
              </span>
              Explore Tours
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/tours/adventure", label: "Adventure Tours" },
                { href: "/tours/cultural", label: "Cultural Experiences" },
                { href: "/tours/food", label: "Food & Culinary" },
                { href: "/tours/nature", label: "Nature & Wildlife" },
                { href: "/tours/historical", label: "Historical Sites" },
                { href: "/tours/custom", label: "Custom Tours" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 transition-all ${
                      isActive(link.href)
                        ? "text-cyan-300 font-medium"
                        : "text-gray-400 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Guides */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-gray-800 flex items-center gap-2">
              <span className="bg-linear-to-r from-purple-500 to-pink-600 p-2 rounded-lg">
                <Users className="h-4 w-4" />
              </span>
              For Guides
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/become-guide", label: "Become a Guide" },
                { href: "/guide/dashboard", label: "Guide Dashboard" },
                { href: "/guide/resources", label: "Resources" },
                { href: "/guide/community", label: "Guide Community" },
                { href: "/guide/pricing", label: "Pricing & Commission" },
                { href: "/guide/support", label: "Guide Support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 transition-all ${
                      isActive(link.href)
                        ? "text-purple-300 font-medium"
                        : "text-gray-400 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-3 border-b border-gray-800">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <a href="mailto:support@tourguide.com" className="text-gray-400 hover:text-cyan-300 transition-colors">
                    support@tourguide.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-linear-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <a href="tel:+8801234567890" className="text-gray-400 hover:text-cyan-300 transition-colors">
                    +880 1234 567890
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Office Location</p>
                  <p className="text-gray-400">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-gray-400 mb-4">Follow Us</p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Facebook, label: "Facebook", color: "hover:bg-blue-600" },
                  { icon: Instagram, label: "Instagram", color: "hover:bg-pink-600" },
                  { icon: Twitter, label: "Twitter", color: "hover:bg-sky-500" },
                  { icon: Youtube, label: "YouTube", color: "hover:bg-red-600" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className={`p-3 bg-gray-800 hover:scale-110 transition-all duration-300 rounded-lg ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TourGuide Pro. All rights reserved.
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              Made with
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              in Bangladesh
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-500 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
        aria-label="Back to top"
      >
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;