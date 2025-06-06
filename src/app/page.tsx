import Hero from "@/components/Hero";
import PatternGrid from "@/components/PatternGrid";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <Hero />
        <PatternGrid />
        <AboutSection />
      </div>
    </div>
  );
}
