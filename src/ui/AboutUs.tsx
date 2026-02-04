import React from "react";

const AboutSection: React.FC = () => {
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
                className="w-full h-full object-cover"
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
        <div className="bg-gradient-to-br from-neutral-50 to-primary-50 rounded-3xl p-8 md:p-10 border border-neutral-200">
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
      </div>
    </section>
  );
};

export default AboutSection;
