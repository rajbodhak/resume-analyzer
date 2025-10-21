import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <HowItWorks />
      <Features />
    </div>
  );
}