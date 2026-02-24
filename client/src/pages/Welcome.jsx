
import Navbar from '../components/Navbar';
import IntroBanner from '../components/IntroBanner';
import Features from '../components/Features';
import About from '../components/About';
import EducationPreview from '../components/EducationPreview';
import DetailedGuide from '../components/DetailedGuide';
import SolarVideoSection from '../components/SolarVideoSection';
import SuccessStories from '../components/SuccessStories';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Welcome = () => {
  return (
    <div className="w-full">
      <Navbar />
      <IntroBanner />
      <Features />
      <About />
      <EducationPreview />
      <DetailedGuide />
      <SolarVideoSection />
      <SuccessStories />
      <Contact />
      <Footer />
    </div>
  );
};

export default Welcome;
