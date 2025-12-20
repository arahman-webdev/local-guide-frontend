import TourDetail from '@/components/Public/TourDetail'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Authentic Local Experiences | Tour Details | LocalGuide",
  description: "Discover tour details, itinerary, guide information, pricing, and booking options for authentic local experiences worldwide.",
};



export default function TourDetailPage() {
    return (
        <div className=''>
            <TourDetail />
        </div>
    )
}
