import ScrollSequence from '@/components/ScrollSequence';

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-amber-600/30">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0a0a0a] to-[#0a0a0a]" />
        
        <div className="z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            3D Coffee
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto mb-10">
            Experience the perfect brew in three dimensions. 
            Scroll down to explore the craftsmanship.
          </p>
          <div className="animate-bounce">
            <svg className="w-6 h-6 mx-auto text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* 3D Scroll Sequence Section */}
      <ScrollSequence totalFrames={300} />

      {/* Features Section */}
      <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto relative z-10 bg-[#0a0a0a]">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
             <h3 className="text-2xl font-semibold">Premium Beans</h3>
             <p className="text-neutral-400 font-light leading-relaxed">Sourced from the finest high-altitude farms, our beans offer a complex and rich flavor profile unmatched in the industry.</p>
          </div>
          <div className="space-y-4">
             <h3 className="text-2xl font-semibold">Perfect Roast</h3>
             <p className="text-neutral-400 font-light leading-relaxed">Every batch is carefully monitored by master roasters to ensure the optimal balance of aroma and taste.</p>
          </div>
          <div className="space-y-4">
             <h3 className="text-2xl font-semibold">Expert Delivery</h3>
             <p className="text-neutral-400 font-light leading-relaxed">Shipped within 24 hours of roasting in specialized packaging to guarantee maximum freshness upon arrival.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-neutral-500 font-light">
        <p>&copy; {new Date().getFullYear()} 3D Coffee. All rights reserved.</p>
      </footer>
    </main>
  );
}
