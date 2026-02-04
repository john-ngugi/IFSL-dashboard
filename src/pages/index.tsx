import Navigation from "../ui/Navigation";
import HeroSection from "../ui/Hero";
import AboutSection from "../ui/AboutUs";
import FeaturesSection from "../ui/FeatureSection";
import StatsSection from "../ui/StatsData";
import Footer from "../ui/Footer";
import PartnersMarquee from "../ui/PartnersMarkee";
import BeneficiariesSection from "../ui/BeneficiariesSection";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <AboutSection />
      <BeneficiariesSection />
      <FeaturesSection />
      <StatsSection />
      <PartnersMarquee />
      <Footer />
    </div>
  );
};

export default HomePage;
