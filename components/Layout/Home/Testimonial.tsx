import React from 'react';
import { Star } from 'lucide-react'; // Using lucide-react for the star icon
import { Card, CardContent } from '@/components/ui/card'; // shadcn/ui Card component

// --- Demo Data ---
const testimonials = [
  {
    id: 1,
    name: 'Sarah Williams',
    title: 'Product Manager',
    company: 'TechFlow Inc.',
    rating: 5,
    quote:
      "The platform's intuitive design has streamlined our workflow and boosted team productivity by 40%. The automation features are game-changing.",
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29329?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHdvbWFufGVufDB8fDB8fHww', // Placeholder image
    isTopReview: false,
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'CEO & Founder',
    company: 'DataDrive Solutions',
    rating: 5,
    quote:
      'Outstanding customer support and feature-rich platform. The analytics dashboard provides incredible insights that have transformed our decision-making process completely.',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGUlMjBtYW58ZW58MHx8MHx8fDA%3D', // Placeholder image
    isTopReview: true, // This one will get the badge
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    title: 'Operations Director',
    company: 'CloudSync Corp',
    rating: 5,
    quote:
      'Seamless integration with our existing tools made the transition effortless. The real-time collaboration features have enhanced our remote work capabilities.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHByb2ZpbGUlMjBtYW58ZW58MHx8MHx8fDA%3D', // Placeholder image
    isTopReview: false,
  },
];

const RatingStars = ({ rating }:any) => {
  return (
    <div className="flex space-x-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
          fill={i < rating ? '#FACC15' : 'none'}
          strokeWidth={0} // Ensure the stroke is hidden when filled
        />
      ))}
    </div>
  );
};

export default function Testimonial() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        {/* --- Header Section (Mimicking the text above the cards) --- */}
        <h2 className="text-sm font-semibold tracking-widest text-blue-600 uppercase">
          TESTIMONIALS
        </h2>
        <p className="mt-2 text-xl text-gray-500 max-w-2xl mx-auto">
          Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`relative p-0.5 rounded-xl transition duration-300 ${
                testimonial.isTopReview
                  ? 'bg-blue-500 shadow-xl' // Blue border effect for top review
                  : 'bg-white shadow-lg border border-gray-100' // Standard card styling
              }`}
            >
              {/* --- Card Container --- */}
              <Card
                className={`w-full h-full rounded-xl ${
                  testimonial.isTopReview
                    ? 'p-8 pt-10 border-none' // Adjusted padding for the blue border/shadow
                    : 'p-8 border-none'
                }`}
                style={{ borderRadius: '0.75rem' }} // Ensuring rounded corners are consistent
              >
                {/* --- Top Review Badge --- */}
                {testimonial.isTopReview && (
                  <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 ">
                    <div className="flex items-center space-x-1 py-3 px-6 bg-blue-600 rounded-full text-white text-xs font-semibold shadow-lg shadow-blue-600">
                      <Star className="w-4 h-4 fill-white text-white" />
                      <span>Top Review</span>
                    </div>
                  </div>
                )}

                <CardContent className="p-0 flex flex-col h-full justify-between">
                  <div className="space-y-4">
                    <RatingStars rating={testimonial.rating} />
                    {/* --- Quote --- */}
                    <p className="text-gray-700 text-lg italic leading-relaxed">
                      <span className="text-4xl leading-none text-blue-600 pr-1">"</span>
                      {testimonial.quote}
                      <span className="text-4xl leading-none text-blue-600 pl-1">"</span>
                    </p>
                  </div>

                  {/* --- Reviewer Info --- */}
                  <div className="mt-6 flex items-center pt-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 ring-4 ring-[#141AE9]"
                    />
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-blue-600 font-semibold">
                        {testimonial.title}
                      </p>
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}