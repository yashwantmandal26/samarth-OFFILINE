import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Sparkles, Brain, ArrowLeft, IndianRupee, Users, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-[2rem] shadow-sm border border-gray-200">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">No results found</h2>
          <Link to="/finder" className="inline-flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Go back to finder
          </Link>
        </div>
      </div>
    );
  }

  const { recommendations, profile, totalMatches } = results;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/finder" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 mb-4 transition-all">
              <ArrowLeft size={14} /> Back to Finder
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
              Recommended Schemes
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Showing {totalMatches} matches tailored for <span className="text-slate-900 font-bold">{profile.name}</span>
            </p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Status</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">Analysis Verified</span>
          </div>
        </div>

        {/* Results List (Single Column) */}
        <div className="flex flex-col gap-6">
          {recommendations.map((scheme, index) => (
            <motion.div 
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Card Header Section */}
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
                      {scheme.scheme_name}
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded">
                      {scheme.department}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest flex items-center gap-1">
                    <FileText size={12} /> {scheme.category}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                    <span className="text-2xl font-black text-emerald-500 tracking-tighter">{scheme.matchScore}%</span>
                  </div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${scheme.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Body Section (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-10 border-b border-gray-50">
                {/* Left Column: Description & Facts (60%) */}
                <div className="md:col-span-6 p-8 border-r border-gray-50">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 mb-6 italic">
                    {scheme.description}
                  </p>
                  
                  {/* Quick Facts Row */}
                  <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2 text-slate-500">
                      <IndianRupee size={14} className="text-slate-400" />
                      <div className="flex flex-col leading-none">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Benefit</span>
                        <span className="text-[10px] font-bold text-slate-700 truncate max-w-[100px]">{scheme.benefits}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={14} className="text-slate-400" />
                      <div className="flex flex-col leading-none">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Target</span>
                        <span className="text-[10px] font-bold text-slate-700">{scheme.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <FileText size={14} className="text-slate-400" />
                      <div className="flex flex-col leading-none">
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Income Limit</span>
                        <span className="text-[10px] font-bold text-slate-700 italic">
                          {scheme.eligibility.income_limit ? `₹${scheme.eligibility.income_limit}` : "Variable"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: AI Insight (40%) */}
                <div className="md:col-span-4 p-8 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-primary-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Agent Analysis</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-bold leading-relaxed whitespace-pre-line">
                    {scheme.aiExplanation ? scheme.aiExplanation : "• Profile matches eligibility rules.\n• Policy reasoning verified by agent."}
                  </div>
                </div>
              </div>

              {/* Card Footer Section */}
              <div className="px-8 py-4 bg-white flex justify-end items-center gap-4">
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
                >
                  View Full Details
                </button>
                <a 
                  href={scheme.official_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-100"
                >
                  Apply Now <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Support */}
        <div className="mt-12 py-8 border-t border-gray-100 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-6">
            <Brain size={24} className="text-slate-400" />
            <Sparkles size={24} className="text-slate-400" />
            <Award size={24} className="text-slate-400" />
          </div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Hybrid Symbolic-Generative MAS</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
