import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Info, Sparkles } from 'lucide-react';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <Link to="/finder" className="text-primary-600 font-semibold hover:underline">Go back to finder</Link>
        </div>
      </div>
    );
  }

  const { recommendations, profile, totalMatches } = results;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Recommended Schemes for {profile.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We found {totalMatches} schemes you might be eligible for based on your profile.
          </p>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((scheme, index) => (
            <div 
              key={scheme.id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col hover:shadow-lg transition-shadow duration-300"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {scheme.category}
                  </span>
                  <div className="flex items-center text-primary-600 font-bold">
                    <Award size={18} className="mr-1" /> {scheme.matchScore}% Match
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                  {scheme.scheme_name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 h-15">
                  {scheme.description}
                </p>
              </div>

              {/* AI Explanation Section (Top 3) */}
              {scheme.aiExplanation && (
                <div className="px-6 py-4 bg-primary-50 border-t border-b border-primary-100">
                  <div className="flex items-center text-primary-800 font-semibold text-sm mb-2">
                    <Sparkles size={16} className="mr-2 text-primary-600" /> AI Insights
                  </div>
                  <p className="text-primary-900 text-xs italic">
                    "{scheme.aiExplanation}"
                  </p>
                </div>
              )}

              {/* Card Footer */}
              <div className="p-6 pt-4 mt-auto">
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Policy Reasoning</h4>
                  <div className="text-xs text-gray-600 line-clamp-3">
                    {scheme.reasoningChain || "Matched based on profile eligibility rules."}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-primary-600 text-primary-600 rounded-md font-semibold hover:bg-primary-600 hover:text-white transition-colors duration-200"
                >
                  View Full Details <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
