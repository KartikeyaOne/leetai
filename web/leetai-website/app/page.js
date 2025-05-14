// pages/index.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import PricingSection from '../components/PricingSection'; // Import the new component
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection /> {/* Add the pricing section here */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}