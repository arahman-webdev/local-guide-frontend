// components/layout/ModernFooter.tsx
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Sparkles,
  Compass,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background linear */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-cyan-600/10 to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16 lg:py-20">
        {/* Logo & Tagline */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg--to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              LocalExplorer
            </h2>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Discover authentic experiences with passionate local guides worldwide
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-300" />
              About Us
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              We're on a mission to connect travelers with authentic local experiences. 
              Our platform empowers local guides to share their culture and knowledge.
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-cyan-500 rounded-lg font-medium hover:shadow-lg transition-all">
                Start Exploring
              </button>
              <button className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg font-medium hover:bg-white/20 transition-all">
                Meet Our Guides
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">For Travelers</h3>
            <ul className="space-y-3">
              {['Browse Tours', 'Destinations', 'Travel Tips', 'Gift Cards', 'Group Travel'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Guides */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">For Guides</h3>
            <ul className="space-y-3">
              {['Become a Guide', 'Guide Resources', 'Success Stories', 'Safety Guide', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-300 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500/20 to-cyan-400/20 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-medium">hello@localexplorer.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500/20 to-cyan-400/20 rounded-xl flex items-center justify-center">
                  <Phone className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Support</p>
                  <p className="text-white font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-gray-700 to-transparent my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-gray-400">
            © {currentYear} LocalExplorer. Made with <Heart className="inline h-4 w-4 text-pink-400" /> for travelers.
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { icon: <Facebook className="h-5 w-5" />, label: 'Facebook' },
              { icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
              { icon: <Instagram className="h-5 w-5" />, label: 'Instagram' },
              { icon: <Youtube className="h-5 w-5" />, label: 'YouTube' },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <span className="text-gray-300 hover:text-white transition-colors">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-cyan-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cyan-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-cyan-300 transition-colors">
              Cookies
            </Link>
            <Link href="/accessibility" className="hover:text-cyan-300 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}