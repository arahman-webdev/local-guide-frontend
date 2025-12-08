"use client";

import { MapPin, Star, Users, Calendar, ChevronRight, Sparkles, CheckCircle, MessageCircle, CreditCard, Globe } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function HowItWork() {
  const [activeStep, setActiveStep] = useState(0);
  const controls = useAnimation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: <MapPin size={32} />,
      title: "Discover Authentic Experiences",
      desc: "Browse unique, locally curated tours designed by passionate guides. Narrow down your search based on destination, interests, and categories that fit your travel plans.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-linear-to-br from-blue-50 to-cyan-50",
      details: [
        "Search by location or category",
        "Filter by price, duration & rating",
        "Read authentic traveler reviews",
        "View guide profiles & expertise"
      ]
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Connect & Chat with Guides",
      desc: "Ask questions, discuss trip expectations, and understand what your guide offers. Clear communication helps you build a personalized experience.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-linear-to-br from-purple-50 to-pink-50",
      details: [
        "Real-time messaging with guides",
        "Discuss customization options",
        "Ask about local insights",
        "Confirm availability & details"
      ]
    },
    {
      icon: <CreditCard size={32} />,
      title: "Book Effortlessly",
      desc: "Securely book your chosen experience with our seamless booking system. Select dates, confirm your details, and you're all set for an unforgettable adventure.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-linear-to-br from-green-50 to-emerald-50",
      details: [
        "Secure payment processing",
        "Flexible date selection",
        "Instant booking confirmation",
        "24/7 customer support"
      ]
    },
    {
      icon: <Star size={32} />,
      title: "Enjoy & Leave a Review",
      desc: "Explore your destination like a true local. After the tour, share your feedback to help future travelers discover trusted guides.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-linear-to-br from-amber-50 to-orange-50",
      details: [
        "Experience local culture",
        "Share memorable moments",
        "Rate your guide & experience",
        "Help other travelers decide"
      ]
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const stepVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  // Auto rotate through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);

  // Animate active step
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
  }, [activeStep, controls]);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-linear-to-b from-white to-blue-50/20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Simple & Seamless
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience authentic local adventures in just four simple steps. 
            From discovery to unforgettable memories, we've made it easy for you.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Steps Timeline */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:w-1/2"
          >
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-200 via-cyan-200 to-purple-200 lg:hidden"></div>
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-linear-to-r from-blue-200 via-cyan-200 to-purple-200"></div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={stepVariants as {}}
                    whileHover="hover"
                    onClick={() => setActiveStep(index)}
                    className={`relative cursor-pointer ${
                      activeStep === index ? 'lg:transform lg:translate-y-5' : ''
                    }`}
                  >
                    {/* Step Number */}
                    <motion.div
                      animate={activeStep === index ? controls : {}}
                      className={`absolute -top-4 left-0 lg:left-1/2 lg:-translate-x-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        activeStep === index 
                          ? 'bg-linear-to-br from-blue-600 to-cyan-500 ring-4 ring-blue-200' 
                          : 'bg-linear-to-br from-gray-300 to-gray-400'
                      }`}
                    >
                      {index + 1}
                    </motion.div>

                    {/* Step Card */}
                    <div className={`relative rounded-2xl p-6 border-2 ${
                      activeStep === index 
                        ? 'border-blue-300 shadow-2xl' 
                        : 'border-gray-100 shadow-lg'
                    } transition-all duration-300 ${step.bgColor}`}>
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                        activeStep === index 
                          ? 'bg-white shadow-xl' 
                          : 'bg-white/80 shadow-lg'
                      }`}>
                        <div className={`bg-linear-to-br ${step.color} bg-clip-text text-transparent`}>
                          {step.icon}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-xl font-bold mb-3 ${
                        activeStep === index 
                          ? 'bg-linear-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent' 
                          : 'text-gray-800'
                      }`}>
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {step.desc}
                      </p>

                      {/* Details List */}
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Active Step Indicator */}
                      {activeStep === index && (
                        <motion.div
                          layoutId="activeStep"
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                        >
                          <div className="w-8 h-2 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        </motion.div>
                      )}
                    </div>

                    {/* Connection Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <ChevronRight className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Step Navigation Dots */}
            <div className="flex justify-center items-center gap-4 mt-12 lg:hidden">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`transition-all duration-300 ${
                    activeStep === index 
                      ? 'w-8 h-3 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full' 
                      : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Active Step Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              {/* Background Card */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-cyan-50 rounded-3xl transform rotate-3"></div>
              
              {/* Main Preview Card */}
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-100 text-blue-700 text-sm font-semibold">
                      <Sparkles className="w-4 h-4" />
                      Step {activeStep + 1} of {steps.length}
                    </span>
                  </div>
                  <div className="text-4xl text-gray-300 font-bold">
                    0{activeStep + 1}
                  </div>
                </div>

                {/* Active Step Icon */}
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl ${steps[activeStep].bgColor}`}>
                  <div className={`text-4xl bg-linear-to-br ${steps[activeStep].color} bg-clip-text text-transparent`}>
                    {steps[activeStep].icon}
                  </div>
                </div>

                {/* Active Step Title */}
                <h3 className="text-3xl font-bold text-center mb-6 bg-linear-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {steps[activeStep].title}
                </h3>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(((activeStep + 1) / steps.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-linear-to-r from-blue-600 to-cyan-500"
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">What You Get:</h4>
                  {steps[activeStep].details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{detail}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 px-6 py-3 rounded-xl text-lg font-semibold bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      Get Started
                    </button>
                    <button className="flex-1 px-6 py-3 rounded-xl text-lg font-semibold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-linear-to-br from-blue-400 to-cyan-400 rounded-3xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-linear-to-br from-purple-400 to-pink-400 rounded-3xl opacity-20 blur-xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-24"
        >
          <div className="bg-linear-to-r from-blue-600/10 via-cyan-500/10 to-blue-700/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Experiences Booked' },
                { value: '98%', label: 'Satisfaction Rate' },
                { value: '4.9/5', label: 'Average Rating' },
                { value: '24h', label: 'Average Response Time' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}