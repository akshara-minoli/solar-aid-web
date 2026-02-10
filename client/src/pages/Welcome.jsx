import React from 'react';
import Navbar from '../components/Navbar';
import IntroBanner from '../components/IntroBanner';
import Features from '../components/Features';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Welcome = () => {
  return (
    <div className="welcome-page">
      <Navbar />
      <IntroBanner />
      <Features />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Welcome;
