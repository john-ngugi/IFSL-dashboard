import React, { useState, useEffect } from "react";

const AboutSection: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      id="about"
      className="relative bg-white overflow-hidden py-20 md:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
            About the Project
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Our Mission & Impact
          </h2>
          <p className="text-lg text-neutral-600">
            Building resilient farming communities through data-driven
            agricultural support
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl shadow-xl p-8 text-white hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
            </div>
            <p className="text-white/95 leading-relaxed mt-16 mb-4 text-lg">
              The IFSL project strengthens food security and improves
              livelihoods through comprehensive farm mapping, crop production
              support, and sustainable agricultural practices.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl mt-10 p-4 border border-white/20">
              <p className="text-white/90 text-sm leading-relaxed">
                By accurately mapping every farmer and their crops, we ensure
                targeted support reaches those who need it most, enhancing
                resource allocation and measuring real impact.
              </p>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-neutral-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="aspect-[4/3] bg-neutral-100 rounded-2xl overflow-hidden mb-4">
              <img
                src="data/images/10.jpg"
                alt="Kenya Red Cross"
                className="w-full h-full object-contain p-8"
              />
            </div>
            <p className="text-neutral-700 leading-relaxed text-sm text-center">
              <i>
                Yellow bean seed distribution in Lumia village, Taveta
                Sub-County
              </i>
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-3xl p-8 md:p-10 mb-16 border border-neutral-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                What We Do
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-4 text-lg">
                The Integrated Food Security and Livelihoods project combines
                modern geospatial mapping with community-based agricultural
                support. We create detailed databases of farm locations and crop
                production to track support distribution, monitor intervention
                effectiveness, and plan future initiatives.
              </p>
              <p className="text-neutral-700 leading-relaxed text-lg">
                Our comprehensive approach ensures every farmer benefits from
                targeted assistance, whether through improved seeds, training
                programs, or access to markets. This data-driven methodology
                helps us build resilient farming communities capable of
                sustaining themselves long-term.
              </p>
            </div>
          </div>
        </div>

        {/* Who We Serve Section */}
        <div
          id="counter-section"
          className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl shadow-2xl p-8 md:p-10 text-white"
        >
          <div className="flex items-center gap-3 mb-8">
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
            <h3 className="text-3xl font-bold">Who We Serve</h3>
          </div>

          {/* Total Counter with Animation */}
          <div className="bg-primary-600 rounded-2xl p-6 mb-8 text-center">
            <p className="text-white/80 text-sm uppercase tracking-wider mb-2">
              Total Farmers Supported
            </p>
            <p className="text-6xl md:text-7xl font-black text-white">
              {count}
            </p>
            <p className="text-white/90 text-sm mt-2">
              Beneficiaries across Taveta Sub-County
            </p>
          </div>

          {/* Village Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bomeni */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-white">Bomeni</h4>
                <span className="text-3xl font-black text-primary-400">37</span>
              </div>
              <p className="text-white/70 text-sm">Single village</p>
            </div>

            {/* Mata */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-white">Mata</h4>
                <span className="text-3xl font-black text-primary-400">
                  143
                </span>
              </div>
              <p className="text-white/70 text-sm">5 villages</p>
            </div>

            {/* Chala */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-white">Chala</h4>
                <span className="text-3xl font-black text-primary-400">47</span>
              </div>
              <p className="text-white/70 text-sm">4 villages</p>
            </div>

            {/* Mahoo */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-white">Mahoo</h4>
                <span className="text-3xl font-black text-primary-400">64</span>
              </div>
              <p className="text-white/70 text-sm">3 villages</p>
            </div>

            {/* Mboghonyi */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xl font-bold text-white">Mboghonyi</h4>
                <span className="text-3xl font-black text-primary-400">12</span>
              </div>
              <p className="text-white/70 text-sm">3 villages</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
