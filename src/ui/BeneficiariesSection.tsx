import React, { useState, useEffect } from "react";

const BeneficiariesSection: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [_, setScrollY] = useState(0);
  const [offset] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    const counterElement = document.getElementById("counter-section");
    if (counterElement) {
      observer.observe(counterElement);
    }

    return () => {
      if (counterElement) {
        observer.unobserve(counterElement);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && count < 303) {
      const timer = setTimeout(() => {
        setCount(count + 1);
      }, 5);
      return () => clearTimeout(timer);
    }
  }, [count, isVisible]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="counter-section"
      className="relative w-full flex items-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <div
        className="absolute inset-0 w-full h-[120%]"
        style={{
          backgroundImage: "url(/data/images/paralax.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          transform: `translate3d(0, ${offset * -0.3}px, 0)`,
          willChange: "transform",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/90 via-neutral-900/85 to-neutral-800/90" />

      {/* Content */}
      <div className="relative z-10 w-full py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Our Impact
            </h2>
          </div>

          {/* Total Counter with Animation */}
          <div className="bg-primary-600/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-8 text-center border border-primary-500/50 shadow-2xl">
            <p className="text-white/90 text-sm md:text-base uppercase tracking-wider mb-2 font-semibold">
              Total Farmers Supported
            </p>
            <p className="text-5xl md:text-5xl font-black text-white mb-2">
              {count}
            </p>
            <p className="text-white/90 text-base md:text-lg">
              Beneficiaries across Taveta Sub-County
            </p>
          </div>

          {/* Village Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bomeni */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  Bomeni
                </h4>
                <span className="text-3xl md:text-4xl font-black text-primary-400">
                  37
                </span>
              </div>
              <p className="text-white/80 text-sm">Single village</p>
            </div>

            {/* Mata */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  Mata
                </h4>
                <span className="text-3xl md:text-4xl font-black text-primary-400">
                  143
                </span>
              </div>
              <p className="text-white/80 text-sm">5 villages</p>
            </div>

            {/* Chala */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  Chala
                </h4>
                <span className="text-3xl md:text-4xl font-black text-primary-400">
                  47
                </span>
              </div>
              <p className="text-white/80 text-sm">4 villages</p>
            </div>

            {/* Mahoo */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  Mahoo
                </h4>
                <span className="text-3xl md:text-4xl font-black text-primary-400">
                  64
                </span>
              </div>
              <p className="text-white/80 text-sm">3 villages</p>
            </div>

            {/* Mboghonyi */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl md:text-2xl font-bold text-white">
                  Mboghonyi
                </h4>
                <span className="text-3xl md:text-4xl font-black text-primary-400">
                  12
                </span>
              </div>
              <p className="text-white/80 text-sm">3 villages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeneficiariesSection;
