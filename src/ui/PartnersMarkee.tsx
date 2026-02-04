import React from "react";

const PartnersMarquee: React.FC = () => {
  const partners = [
    { src: "data/logos/image1.png", alt: "Partner 1" },
    { src: "data/logos/image2.jpg", alt: "Partner 2" },
    { src: "data/logos/image3.png", alt: "Partner 3" },
    { src: "data/logos/image5.jpg", alt: "Kenya Red Cross" },
    { src: "data/logos/image4.jpg", alt: "Esri" },
  ];

  return (
    <section className="relative bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
              Our Partners
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Working Together for Change
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

          {/* Marquee */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {/* First set of logos */}
              {partners.map((partner, index) => (
                <div
                  key={`first-${index}`}
                  className="mx-8 flex items-center justify-center"
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div
                  key={`second-${index}`}
                  className="mx-8 flex items-center justify-center"
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership Statement */}
        <div className="text-center mt-8">
          <p className="text-neutral-600 max-w-2xl mx-auto">
            In collaboration with leading organizations committed to food
            security and sustainable development
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnersMarquee;
