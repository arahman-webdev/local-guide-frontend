import { SheetDemo } from "@/components/CheckSheet";
import FeaturedSection from "@/components/Layout/Home/FeaturedSection";
import Hero from "@/components/Layout/Home/Hero";
import HowItWork from "@/components/Layout/Home/HowItWork";
import PopularCategories from "@/components/Layout/Home/PopularCategories";
import Testimonial from "@/components/Layout/Home/Testimonial";
import TopRatedGuide from "@/components/Layout/Home/TopRatedGuide";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSection />
      <HowItWork />
      <PopularCategories />
      <TopRatedGuide />
      <Testimonial />
      <SheetDemo />
    </>
  );
}
