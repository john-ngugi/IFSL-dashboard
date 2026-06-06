import React, { useState, useEffect } from "react";

interface WardData {
  ward: string;
  subcounty: string | null;
  county: string | null;
  total_points: number;
}

interface WardStats {
  total_wards: number;
  total_points: number;
  total_beneficiaries: number;
  wards: WardData[];
}
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const BeneficiariesSection: React.FC = () => {
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [wardStats, setWardStats] = useState<WardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset] = useState<number>(0);

  // Fetch ward data from API
  useEffect(() => {
    const fetchWardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrl}/api/points-per-ward/`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data: WardStats = await response.json();
        setWardStats(data);
        setTargetCount(data.total_beneficiaries ?? data.total_points);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchWardData();
  }, []);

  // Intersection observer — start counter animation when section visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );

    const counterElement = document.getElementById("counter-section");
    if (counterElement) observer.observe(counterElement);
    return () => {
      if (counterElement) observer.unobserve(counterElement);
    };
  }, []);

  // Animated counter — triggers once data is loaded and section is visible
  useEffect(() => {
    if (isVisible && targetCount > 0 && count < targetCount) {
      const increment = Math.max(1, Math.ceil(targetCount / 150));
      const timer = setTimeout(() => {
        setCount((prev) => Math.min(prev + increment, targetCount));
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [count, isVisible, targetCount]);

  // Also start counter if already visible when data arrives
  useEffect(() => {
    if (isVisible && targetCount > 0 && count === 0) {
      setCount(1);
    }
  }, [isVisible, targetCount]);

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

          {/* Total Counter */}
          <div className="bg-primary-600/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-8 text-center border border-primary-500/50 shadow-2xl">
            <p className="text-white/90 text-sm md:text-base uppercase tracking-wider mb-2 font-semibold">
              Total Farmers Supported
            </p>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-white/70 text-lg">Loading...</span>
              </div>
            ) : error ? (
              <p className="text-red-300 text-lg py-3">{error}</p>
            ) : (
              <p className="text-5xl md:text-6xl font-black text-white mb-2">
                {count.toLocaleString()}
              </p>
            )}

            <p className="text-white/90 text-base md:text-lg">
              Beneficiaries across {wardStats?.wards[0]?.subcounty ?? "Taveta"}{" "}
              Sub-County
            </p>

            {/* Summary pills */}
            {wardStats && (
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {wardStats.total_wards} Ward
                  {wardStats.total_wards !== 1 ? "s" : ""}
                </span>
                <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {wardStats.total_points.toLocaleString()} Total Records
                </span>
              </div>
            )}
          </div>

          {/* Ward Breakdown Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-pulse"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-6 w-24 bg-white/20 rounded" />
                    <div className="h-8 w-12 bg-white/20 rounded" />
                  </div>
                  <div className="h-4 w-32 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-white/60 text-sm">
                Ward breakdown unavailable
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-primary-400 text-sm underline hover:text-primary-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wardStats?.wards.map((ward) => (
                <div
                  key={ward.ward}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xl md:text-2xl font-bold text-white capitalize">
                      {ward.ward}
                    </h4>
                    <span className="text-3xl md:text-4xl font-black text-primary-400">
                      {ward.total_points.toLocaleString()}
                    </span>
                  </div>
                  {/* <p className="text-white/70 text-sm">
                    {ward.subcounty
                      ? `${ward.subcounty} Sub-County`
                      : "Sub-County not assigned"}
                  </p> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BeneficiariesSection;
