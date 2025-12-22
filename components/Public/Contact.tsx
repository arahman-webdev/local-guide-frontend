// app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  MessageSquare,
  Globe,
  Shield,
  Headphones,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    { id: 'booking', label: 'Booking Assistance', icon: '📅' },
    { id: 'payment', label: 'Payment Issues', icon: '💳' },
    { id: 'refund', label: 'Refund Request', icon: '↩️' },
    { id: 'tour', label: 'Tour Information', icon: '🗺️' },
    { id: 'guide', label: 'Guide Support', icon: '👨‍🏫' },
    { id: 'technical', label: 'Technical Support', icon: '💻' },
    { id: 'partnership', label: 'Partnership', icon: '🤝' },
    { id: 'feedback', label: 'Feedback', icon: '💬' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message Sent Successfully!', {
        description: 'We\'ll get back to you within 24 hours.',
        duration: 5000,
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSelectedTopic('');
      
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Get In Touch With Us
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions about tours, bookings, or partnerships? We're here to help you plan your perfect adventure.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full translate-y-24 -translate-x-24" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                  <p className="text-gray-600">We typically respond within 2-4 hours</p>
                </div>
              </div>

              {/* Topic Selection */}
              <div className="mb-8">
                <Label className="block text-sm font-medium text-gray-700 mb-4">
                  What can we help you with?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${selectedTopic === topic.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <div className="text-2xl mb-2">{topic.icon}</div>
                      <span className="text-sm font-medium">{topic.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-700">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700">
                    Your Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your inquiry in detail..."
                    rows={6}
                    required
                    className="mt-2 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure & Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No Spam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-4 w-4 text-blue-500" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {[
                  {
                    q: 'How long does it take to get a response?',
                    a: 'We typically respond within 2-4 hours during business days. For urgent matters, please call our support line.'
                  },
                  {
                    q: 'Can I modify or cancel my booking?',
                    a: 'Yes, you can modify or cancel your booking up to 24 hours before the tour starts. Please contact us with your booking ID.'
                  },
                  {
                    q: 'What payment methods do you accept?',
                    a: 'We accept all major credit cards, mobile banking, and bank transfers through our secure payment gateway.'
                  },
                  {
                    q: 'Are tour guides verified?',
                    a: 'Yes, all our guides go through a rigorous verification process including background checks and training.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6">
                    <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Call Us</h4>
                    <p className="text-blue-100">+880 1234 567890</p>
                    <p className="text-sm text-blue-200 mt-1">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email Us</h4>
                    <p className="text-blue-100">support@tourhobe.com</p>
                    <p className="text-sm text-blue-200 mt-1">For general inquiries</p>
                    <p className="text-blue-100 mt-2">bookings@tourhobe.com</p>
                    <p className="text-sm text-blue-200 mt-1">For booking assistance</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Visit Us</h4>
                    <p className="text-blue-100">123 Travel Street</p>
                    <p className="text-blue-100">Dhaka 1212, Bangladesh</p>
                    <p className="text-sm text-blue-200 mt-1">Headquarters</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Business Hours</h4>
                    <p className="text-blue-100">Mon-Fri: 9:00 AM - 7:00 PM</p>
                    <p className="text-blue-100">Sat-Sun: 10:00 AM - 6:00 PM</p>
                    <p className="text-sm text-blue-200 mt-1">GMT+6</p>
                  </div>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-8 border-white text-white bg-white/30 hover:bg-white/20"
                onClick={() => window.open('https://maps.google.com', '_blank')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </div>

            {/* Live Chat Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat Support</h3>
                <p className="text-gray-600 mb-6">Get instant answers from our support team</p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  onClick={() => toast.info('Live chat coming soon!')}
                >
                  Start Live Chat
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-sm text-gray-500 mt-4">Average response time: 2 minutes</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Follow Us</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { platform: 'Facebook', color: 'bg-blue-500', icon: 'fb' },
                  { platform: 'Instagram', color: 'bg-pink-500', icon: 'ig' },
                  { platform: 'Twitter', color: 'bg-sky-500', icon: 'tw' },
                  { platform: 'LinkedIn', color: 'bg-blue-700', icon: 'in' },
                  { platform: 'YouTube', color: 'bg-red-600', icon: 'yt' },
                  { platform: 'TripAdvisor', color: 'bg-green-600', icon: 'ta' }
                ].map((social) => (
                  <button
                    key={social.platform}
                    onClick={() => toast.info(`Opening ${social.platform}`)}
                    className={`${social.color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center`}
                  >
                    <span className="text-lg font-medium">{social.icon}</span>
                    <span className="text-xs mt-2">{social.platform}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Our Response Promise</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Response</span>
                  <span className="font-bold">Within 4 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phone Support</span>
                  <span className="font-bold">Immediate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Live Chat</span>
                  <span className="font-bold">2 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Refund Processing</span>
                  <span className="font-bold">3-5 business days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b">
            <h3 className="text-2xl font-bold text-gray-900">Find Our Office</h3>
            <p className="text-gray-600">Visit our headquarters for in-person assistance</p>
          </div>
          <div className="h-96 bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">TourHobe Headquarters</h4>
              <p className="text-gray-600">123 Travel Street, Dhaka 1212</p>
              <p className="text-gray-600">Bangladesh</p>
              <Button 
                variant="outline" 
                className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => toast.info('Interactive map coming soon!')}
              >
                View on Map
              </Button>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6">
              Subscribe to our newsletter for exclusive tour deals, travel tips, and destination guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-blue-200"
              />
              <Button 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => toast.success('Subscribed to newsletter!')}
              >
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-blue-200 mt-4">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
}