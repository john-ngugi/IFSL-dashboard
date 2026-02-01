import Navigation from "../ui/Navigation";
import HeroSection from "./Hero";
import AboutSection from "./AboutUs";
const HomePage: React.FC = () => {
  return (
    <div>
      <Navigation />
      <HeroSection />
      <AboutSection />
    </div>
  );
};

export default HomePage;
