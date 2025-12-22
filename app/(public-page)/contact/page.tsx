import Contact from '@/components/Public/Contact';
import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
  title: "Get in Touch with Our Travel Experts | Contact LocalGuide",
  description: "Learn about LocalGuide's mission to empower local communities and provide authentic travel experiences. Our story, values, and commitment to sustainable tourism.",
};

export default function ContactPage() {
  return (
    <div>
      <Contact />
    </div>
  )
}
