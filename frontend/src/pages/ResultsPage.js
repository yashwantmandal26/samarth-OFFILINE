import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Sparkles, Brain, ArrowLeft, IndianRupee, Users, FileText, ExternalLink, ShieldCheck, Target, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  const formatAIExplanation = (text) => {
    if (!text) return null;
    // Split by common delimiters if it's not already bulleted
    const lines = text.split(/[•\n]|\d+\./).filter(line => line.trim().length > 0);
    return (
      <ul className="space-y-2">
        {lines.map((line, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-blue-500 mt-1 text-[10px]">✦</span>
            <span className="text-slate-700 font-medium leading-relaxed">{line.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
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
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
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
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">Analysis Verified</span>
          </div>
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-8">
          {recommendations.map((scheme, index) => (
            <motion.div 
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Section A: Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">
                    {scheme.scheme_name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {scheme.department}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                      {scheme.category}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium text-sm border border-emerald-200">
                  {scheme.matchScore}% Match
                </div>
              </div>

              {/* Section B: Core Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-slate-100">
                {/* Column 1: Scheme Data */}
                <div className="flex flex-col">
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {scheme.description}
                  </p>
                  
                  <div className="bg-slate-50 rounded-lg p-5 mt-auto border border-slate-100 space-y-4">
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <Wallet size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Benefit</span>
                        <span className="text-sm">{scheme.benefits}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <Target size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Group</span>
                        <span className="text-sm">{scheme.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Income Eligibility</span>
                        <span className="text-sm">
                          {scheme.eligibility.income_limit ? `Up to ₹${scheme.eligibility.income_limit.toLocaleString()}` : "Variable/No Limit"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: AI Agent Analysis */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={14} className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-800 tracking-wider uppercase">✦ AI Reasoning Engine</span>
                  </div>
                  <div className="text-xs flex-1">
                    {formatAIExplanation(scheme.aiExplanation) || (
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1 text-[10px]">✦</span>
                          <span className="text-slate-700 font-medium leading-relaxed">Profile matches deterministic eligibility rules.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1 text-[10px]">✦</span>
                          <span className="text-slate-700 font-medium leading-relaxed">Policy reasoning verified by backend agent protocol.</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Section C: Footer */}
              <div className="px-8 py-4 bg-white flex justify-end items-center gap-6">
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  View Full Details
                </button>
                <a 
                  href={scheme.official_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
                >
                  Apply Now <ExternalLink size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 py-10 border-t border-slate-200 text-center">
          <div className="flex justify-center gap-8 mb-6 opacity-30 grayscale">
            <ShieldCheck size={32} className="text-slate-400" />
            <Brain size={32} className="text-slate-400" />
            <Sparkles size={32} className="text-slate-400" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Enterprise E-Governance Engine</p>
          <p className="text-xs text-slate-400 font-medium italic">Verified Hybrid Symbolic-Generative Multi-Agent Architecture</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
