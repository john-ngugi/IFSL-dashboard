import React from "react";

const StatsSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 py-16 md:py-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-900/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Project Impact
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Our data-driven approach is creating measurable change across Taveta
            Sub-County
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Stat 1 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="mb-3">
              <svg
                className="w-12 h-12 mx-auto text-white"
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
            <div className="text-4xl md:text-5xl font-black text-white mb-2">
              303
            </div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
              Farmers
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="mb-3">
              <svg
                className="w-12 h-12 mx-auto text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">
              5
            </div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
              Locations
            </p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="mb-3">
              <svg
                className="w-12 h-12 mx-auto text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="text-4xl md:text-5xl font-black text-white mb-2">
              15+
            </div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
              Villages
            </p>
          </div>

          {/* Stat 4 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <div className="mb-3">
              <svg
                className="w-12 h-12 mx-auto text-white"
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
            <div className="text-4xl md:text-5xl font-black text-white mb-2">
              100%
            </div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide">
              Mapped
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-bold text-lg mb-2">
              Comprehensive Data
            </h4>
            <p className="text-white/70 text-sm">
              Every farm location precisely mapped with soil analysis and crop
              production data
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-bold text-lg mb-2">
              Targeted Support
            </h4>
            <p className="text-white/70 text-sm">
              Resource allocation optimized based on accurate geospatial
              information
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-bold text-lg mb-2">
              Sustainable Impact
            </h4>
            <p className="text-white/70 text-sm">
              Building long-term food security through data-driven decision
              making
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
