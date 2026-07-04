import ScrollSequence from '@/components/ScrollSequence';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" />
        
        <div className="hero-content">
          <h1 className="hero-title">
            3D Coffee
          </h1>
          <p className="hero-subtitle">
            Experience the perfect brew in three dimensions. 
            Scroll down to explore the craftsmanship.
          </p>
          <div className="scroll-indicator">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* 3D Scroll Sequence Section */}
      <ScrollSequence totalFrames={300} />

      {/* Features Section */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
             <h3>Premium Beans</h3>
             <p>Sourced from the finest high-altitude farms, our beans offer a complex and rich flavor profile unmatched in the industry.</p>
          </div>
          <div className="feature-card">
             <h3>Perfect Roast</h3>
             <p>Every batch is carefully monitored by master roasters to ensure the optimal balance of aroma and taste.</p>
          </div>
          <div className="feature-card">
             <h3>Expert Delivery</h3>
             <p>Shipped within 24 hours of roasting in specialized packaging to guarantee maximum freshness upon arrival.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} 3D Coffee. All rights reserved.</p>
      </footer>
    </main>
  );
}
