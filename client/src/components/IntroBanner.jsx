
import './IntroBanner.css';

const IntroBanner = () => {
  return (
    <section className="intro-banner" id="home">
      <div className="banner-content">
        <div className="banner-text">
          <h1 className="banner-title">
            Welcome to <span className="highlight">Solar Aid</span>
          </h1>
          <p className="banner-subtitle">
            Helping rural households adopt clean, affordable solar energy
          </p>
          <p className="banner-description">
            Learn about solar power, estimate costs, and take your first step towards sustainable energy for your home.
          </p>
          <div className="banner-buttons">
            <a href="#features" className="btn btn-primary">Learn Solar</a>
            <a href="#contact" className="btn btn-secondary">Get Cost Estimation</a>
          </div>
        </div>
        <div className="banner-image">
          <div className="circle-decoration">
            <span className="sun-icon">☀️</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroBanner;
