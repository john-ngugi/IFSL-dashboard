import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden py-20 md:py-32 lg:py-30">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-900/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-12 animate-pulse-slow"></div>
      <div
        className="absolute bottom-32 right-20 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg> */}
              <span>Empowering Communities</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black leading-tight mb-6">
              Integrated Food Security and Livelihoods
              <span className="block text-primary-200 mt-2">Project</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">
              Strengthening agricultural resilience and improving livelihoods
              across Taveta Sub-County
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-neutral-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <span>Learn More</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <span>View Dashboard</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>

            {/* Partnership Badge */}
            {/* <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-2xl w-full md:w-auto">
              <div className="flex items-center gap-2 flex-row ">
                <div className="w-2 h-2 bg-primary-300 rounded-full animate-pulse "></div>
                <span className="text-sm font-semibold text-white/80 w-auto">
                  Partnership:
                </span>
              </div>
              <div>
                {" "}
                <span className="text-base font-bold text-white flex flex-wrap items-center gap-4 justify-start md:justify-center">
                  <img
                    src="data/logos/image1.png"
                    alt="Kenya Red Cross Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="data/logos/image2.jpg"
                    alt="Kenya Red Cross Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="data/logos/image3.png"
                    alt="Kenya Red Cross Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="data/logos/image5.jpg"
                    alt="Kenya Red Cross Logo"
                    className="h-16 w-auto object-contain"
                  />
                  <img
                    src="data/logos/image4.jpg"
                    alt="Esri Logo"
                    className="h-16 w-auto object-contain"
                  />
                </span>
              </div>
            </div> */}
          </div>

          {/* Right Content - Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Stat 1 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2">
                499
              </div>
              <p className="text-white/80 text-sm md:text-base font-medium">
                Farmers Mapped
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2">
                5
              </div>
              <p className="text-white/80 text-sm md:text-base font-medium">
                Locations Mapped
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2">
                15+
              </div>
              <p className="text-white/80 text-sm md:text-base font-medium">
                Villages Reached
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2">
                100%
              </div>
              <p className="text-white/80 text-sm md:text-base font-medium">
                Geo-mapped
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-16 md:h-24"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,100 480,120 720,120 C960,120 1200,100 1440,64 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
