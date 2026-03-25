import React, { useState } from 'react';

const FilterPanel: React.FC = () => {
  const [farmerCode, setFarmerCode] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [gender, setGender] = useState('all');
  const [healthRating, setHealthRating] = useState('all');

  const handleApplyFilters = () => {
    console.log({ farmerCode, farmerName, gender, healthRating });
    // Apply filters logic here
  };

  const handleReset = () => {
    setFarmerCode('');
    setFarmerName('');
    setGender('all');
    setHealthRating('all');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary-600">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h2 className="text-base font-bold text-neutral-900">Search & Filter</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        {/* Farmer Code Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by farmer code (e.g., BM01)"
            value={farmerCode}
            onChange={(e) => setFarmerCode(e.target.value)}
            className="w-full px-3 py-2 text-sm pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
          />
          <svg className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Farmer Name Search */}
        <div>
          <input
            type="text"
            placeholder="Search by farmer name"
            value={farmerName}
            onChange={(e) => setFarmerName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none"
          />
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Health Rating Filter */}
        <div>
          <select
            value={healthRating}
            onChange={(e) => setHealthRating(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Health Ratings</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleApplyFilters}
          className="px-4 py-1.5 text-sm bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-1.5 text-sm bg-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-300 transition-colors"
        >
          Reset
        </button>
        <button className="px-4 py-1.5 text-sm bg-accent-hope text-white font-semibold rounded-lg hover:bg-accent-hope/90 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Filtered Data
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;