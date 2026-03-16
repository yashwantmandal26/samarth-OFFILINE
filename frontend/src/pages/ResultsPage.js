import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Award, Sparkles, Brain, ArrowLeft, ShieldCheck, Target, Wallet, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.png';

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
      className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-2xl mb-12 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <img src={logoImg} alt="" className="w-32 h-32 object-contain grayscale brightness-200" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 text-white">
            <Sparkles size={20} className="text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">AI Executive Summary</h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Live Synthesis Active</span>
            </div>
          </div>
        </div>
        
        <p className="text-lg md:text-xl font-medium leading-relaxed text-emerald-50 max-w-3xl">
          {displayedText}
          <span className="inline-block w-2 h-6 bg-emerald-500 ml-1 animate-pulse align-middle"></span>
        </p>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 opacity-50"></div>
    </motion.div>
  );
};

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

  const summaryText = `Analysis complete. Based on your socio-economic profile as a ${profile.occupation} in ${profile.district}, our Multi-Agent System has identified high-probability matches primarily in ${recommendations[0]?.category || 'Education and Skill Development'} sectors. Below is the refined list of eligible schemes ranked by match accuracy.`;

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

        {/* AI Executive Summary with Typewriter Effect */}
        <TypewriterSummary text={summaryText} />

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
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
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
                        <span className="text-sm font-bold text-slate-700">{scheme.benefits}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <Target size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Group</span>
                        <span className="text-sm font-bold text-slate-700">{scheme.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Income Eligibility</span>
                        <span className="text-sm font-bold text-slate-700">
                          {scheme.eligibility.income_limit ? `Up to ₹${scheme.eligibility.income_limit.toLocaleString()}` : "Variable/No Limit"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: AI Agent Analysis */}
                <div className="bg-emerald-50/30 border border-emerald-100 rounded-lg p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={14} className="text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">✦ AI Reasoning Engine</span>
                  </div>
                  <div className="text-xs flex-1">
                    {formatAIExplanation(scheme.aiExplanation) || (
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1 text-[10px]">✦</span>
                          <span className="text-slate-700 font-bold leading-relaxed">Profile matches deterministic eligibility rules.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1 text-[10px]">✦</span>
                          <span className="text-slate-700 font-bold leading-relaxed">Policy reasoning verified by backend agent protocol.</span>
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
                  className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest"
                >
                  View Full Details
                </button>
                <a 
                  href={scheme.official_portal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-emerald-50 active:scale-95 flex items-center gap-2"
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
