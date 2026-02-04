import React, { useState } from "react";

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-lg border-b-4 border-primary-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex-shrink-0 bg-white rounded-lg p-2 transition-transform hover:scale-105 duration-300">
              <img
                src="data/logos/image5.jpg"
                alt="Kenya Red Cross Logo"
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <a
                href="/"
                className="px-6 py-2 text-neutral-700 font-medium hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#about"
                className="px-6 py-2 text-neutral-700 font-medium hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 relative group"
              >
                About IFSL
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </a>

              <a
                href="/dashboard"
                className="px-6 py-2 text-neutral-700 font-medium hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="/contact"
                className="px-6 py-2 text-neutral-700 font-medium hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-neutral-50 border-t border-neutral-200">
            <a
              href="/"
              className="block px-4 py-3 text-neutral-700 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors duration-300"
            >
              Home
            </a>
            <a
              href="#about"
              className="block px-4 py-3 text-neutral-700 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors duration-300"
            >
              About IFSL
            </a>

            <a
              href="/dashboard"
              className="block px-4 py-3 text-neutral-700 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors duration-300"
            >
              Dashboard
            </a>
            <a
              href="/contact"
              className="block px-4 py-3 text-neutral-700 font-medium hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors duration-300"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
