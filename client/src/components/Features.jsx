
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: '📚',
      title: 'Learn Solar Basics',
      description: 'Understand how solar energy works in simple language. Perfect for beginners with no technical knowledge.'
    },
    {
      icon: '💰',
      title: 'Estimate Your Cost',
      description: 'Get a rough idea of how much a solar system would cost for your home based on your needs.'
    },
    {
      icon: '🏠',
      title: 'Register Your Home',
      description: 'Create your profile and save your information for personalized solar recommendations.'
    },
    {
      icon: '🤝',
      title: 'Get Guidance',
      description: 'Receive step-by-step guidance on choosing and installing the right solar system for your family.'
    }
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="section-header">
          <h2>What Solar Energy Can Do For You</h2>
          <p className="section-subtitle">Simple explanations for everyone</p>
        </div>

        <div className="solar-education">
          <h3>Understanding Solar Energy</h3>
          <div className="education-grid">
            <div className="education-card">
              <h4>🔆 What is a Solar System?</h4>
              <p>
                A solar system is a set of special panels that you put on your roof. These panels catch sunlight
                and turn it into electricity for your home - just like magic! No fuel needed, just the sun.
              </p>
            </div>
            <div className="education-card">
              <h4>✨ Benefits of Solar Energy</h4>
              <ul>
                <li>Save money on electricity bills</li>
                <li>Clean energy - no smoke or pollution</li>
                <li>Works even in remote villages</li>
                <li>Reliable power for your family</li>
                <li>One-time investment, long-term savings</li>
              </ul>
            </div>
            <div className="education-card">
              <h4>🌾 Why Rural Homes Should Use It</h4>
              <p>
                Many villages don&apos;t have regular electricity or it comes and goes. Solar panels give you
                your own power that works every day. You can charge phones, run lights, fans, and even TV -
                all from the sun!
              </p>
            </div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
