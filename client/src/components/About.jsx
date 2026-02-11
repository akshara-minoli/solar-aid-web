
import './About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-image">
            <div className="about-decoration">
              <span className="about-icon">🌍</span>
            </div>
          </div>
          <div className="about-text">
            <h2>About Solar Aid</h2>
            <p className="about-intro">
              Solar Aid is a web-based platform developed as a university project to help rural
              households understand and adopt solar energy solutions.
            </p>
            <p>
              Our mission is simple: make solar energy easy to understand for everyone. We know that
              technical terms can be confusing, especially for people who have never used solar power before.
            </p>
            <p>
              That&apos;s why we created Solar Aid - to explain everything in simple words, help you estimate
              costs, and guide you step by step in choosing the right solar system for your home.
            </p>
            <div className="about-features">
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Simple language, no technical jargon</span>
              </div>
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Free cost estimation tools</span>
              </div>
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Clear guidance for rural communities</span>
              </div>
              <div className="about-feature-item">
                <span className="check-icon">✓</span>
                <span>Helping make clean energy accessible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
