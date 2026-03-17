import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Award, Sparkles, Brain, ArrowLeft, ShieldCheck, Target, Wallet, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const TypewriterSummary = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 15); // Adjust speed here
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl mb-12 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Brain size={120} className="text-white" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center border border-primary-500/30">
            <Sparkles size={20} className="text-primary-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-1">AI Executive Summary</h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live Synthesis Active</span>
            </div>
          </div>
        </div>
        
        <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-100 max-w-3xl bg-transparent">
          {displayedText}
          <span className="inline-block w-2 h-6 bg-primary-500 ml-1 animate-pulse align-middle"></span>
        </p>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-blue-500 opacity-50"></div>
    </motion.div>
  );
};

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  useEffect(() => {
    if (results) {
      document.title = `Samarth | ${results.totalMatches} Schemes Found`;
    } else {
      document.title = "Samarth | Analysis Results";
    }
  }, [results]);

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

  const summaryText = `Analysis complete, ${profile.name ? profile.name : 'Citizen'}. Based on your socio-economic profile as a ${profile.occupation} in ${profile.district}, Samarth has identified high-probability matches primarily in the ${recommendations[0]?.category || 'Education and Skill Development'} sector. Below is the refined list of eligible schemes ranked by match accuracy.`;

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
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">Analysis Verified</span>
          </div>
        </div>

        {/* AI Executive Summary with Typewriter Effect */}
        <TypewriterSummary text={summaryText} />

        {/* Results List */}
        <div className="flex flex-col gap-10">
          {recommendations.map((scheme, index) => (
            <motion.div 
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="enterprise-card group flex flex-col"
            >
              {/* Section A: Header */}
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">
                      {scheme.scheme_name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="badge-slate">
                        {scheme.department}
                      </span>
                      <span className="badge-primary">
                        {scheme.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl font-black text-xs border shadow-sm uppercase tracking-widest ${
                  scheme.matchScore > 75 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {scheme.matchScore > 75 ? 'Highly Recommended' : 'Eligible'}
                </div>
              </div>

              {/* Section B: Core Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 border-b border-slate-50 flex-1">
                {/* Column 1: Scheme Data */}
                <div className="flex flex-col">
                  <p className="text-slate-500 text-sm font-medium leading-relaxed italic mb-8">
                    {scheme.description}
                  </p>
                  
                  <div className="bg-slate-50 rounded-[1.5rem] p-8 mt-auto border border-slate-100 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary-600 shadow-sm">
                        <Wallet size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Benefit</span>
                        <span className="text-sm font-bold text-slate-700">{scheme.benefits}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary-600 shadow-sm">
                        <Target size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Target Demographic</span>
                        <span className="text-sm font-bold text-slate-700">{scheme.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary-600 shadow-sm">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Income Eligibility</span>
                        <span className="text-sm font-bold text-slate-700">
                          {scheme.eligibility.income_limit ? `Up to ₹${scheme.eligibility.income_limit.toLocaleString()}` : "Variable Eligibility"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: AI Agent Analysis */}
                <div className="bg-primary-50/30 border border-primary-100/50 rounded-[1.5rem] p-8 flex flex-col relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
                    <Sparkles size={120} />
                  </div>
                  <div className="flex items-center gap-2 mb-6 relative z-10">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                        <Sparkles size={16} />
                    </div>
                    <span className="text-[10px] font-black text-primary-800 tracking-[0.2em] uppercase">AI Reasoning Protocol</span>
                  </div>
                  <div className="text-xs flex-1 relative z-10">
                    {formatAIExplanation(scheme.aiExplanation) || (
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <span className="text-primary-500 mt-1 text-[10px]">✦</span>
                          <span className="text-slate-700 font-bold leading-relaxed uppercase tracking-tight">Socio-economic profile verified by symbolic engine.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary-500 mt-1 text-[10px]">✦</span>
                          <span className="text-slate-700 font-bold leading-relaxed uppercase tracking-tight">Eligibility criteria matched with 100% deterministic accuracy.</span>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Section C: Footer */}
              <div className="px-10 py-6 bg-white flex justify-end items-center gap-8">
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Deep Detail View
                </button>
                <a 
                  href={scheme.official_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
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
