import React, { useState } from "react";
import Navigation from "../ui/Navigation";

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Navigation />
      <section id="contact" className="relative bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6  md:px-12 lg:px-20">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-primary-600 font-semibold text-sm uppercase tracking-wide mb-3">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-neutral-600">
              Have questions about the project? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                  Project Information
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-8">
                  The Integrated Food Security and Livelihoods project is a
                  collaborative initiative working to improve agricultural
                  resilience across Taveta Sub-County. Reach out to learn more
                  about our work or partnership opportunities.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Location */}
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">
                        Location
                      </h4>
                      <p className="text-neutral-700 text-sm">
                        Taveta Sub-County
                        <br />
                        Taita Taveta County, Kenya
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neutral-700 rounded-xl flex items-center justify-center flex-shrink-0">
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
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Email</h4>
                      <p className="text-neutral-700 text-sm">
                        info@ifsl-taveta.org
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neutral-700 rounded-xl flex items-center justify-center flex-shrink-0">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-neutral-900 mb-1">Phone</h4>
                      <p className="text-neutral-700 text-sm">
                        +254 700 000 000
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partners */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                <h4 className="font-bold mb-4">Partnership</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-1">
                      Taita Taveta University
                    </p>
                    <p className="text-xs text-white/60">Academic Partner</p>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div className="flex-1">
                    <p className="text-sm text-white/80 mb-1">
                      Kenya Red Cross
                    </p>
                    <p className="text-xs text-white/60">
                      Humanitarian Partner
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-neutral-50 to-white rounded-3xl p-8 border border-neutral-200 shadow-xl">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Send us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-neutral-700 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-neutral-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-neutral-700 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                    placeholder="Partnership Inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-neutral-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
