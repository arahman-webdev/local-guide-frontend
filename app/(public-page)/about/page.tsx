import About from "@/components/Layout/About";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Our Mission to Connect Travelers with Local Experts | About LocalGuide",
  description: "Learn about LocalGuide's mission to empower local communities and provide authentic travel experiences. Our story, values, and commitment to sustainable tourism.",
};

export default function AboutPage() {
  return (
    <About />
  )
}
