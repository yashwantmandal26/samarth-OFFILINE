import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Award, Sparkles, Brain, ArrowLeft, ShieldCheck, Target, Wallet, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const { results } = location.state || { results: null };
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', label: t('cat_all') },
    { id: 'Students', label: t('cat_students') },
    { id: 'Farmers', label: t('cat_farmers') },
    { id: 'Women', label: t('cat_women') },
    { id: 'Entrepreneurs', label: t('cat_entrepreneurs') },
    { id: 'Housing', label: t('cat_housing') },
    { id: 'Healthcare', label: t('cat_healthcare') },
    { id: 'Pension', label: t('cat_pension') },
    { id: 'Employment', label: t('cat_employment') }
  ];

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

  // Formatting Helpers for Demo
  const formattedName = profile.name ? profile.name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ') : 'Citizen';
  const occupationArticle = ['a', 'e', 'i', 'o', 'u'].includes(profile.occupation?.charAt(0).toLowerCase()) ? 'an' : 'a';
  
  const cleanReasoning = (text) => {
    if (!text) return '';
    // Remove technical tags like RULE_CATEGORY_MATCH
    let cleaned = text.replace(/RULE_[A-Z_]+/g, '');
    // Remove underscores and pipes
    cleaned = cleaned.replace(/_/g, ' ').replace(/\|/g, ', ');
    // Convert to sentence case
    cleaned = cleaned.trim().toLowerCase();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  // Robust filtering logic to handle inconsistent dataset categories
  const categoryMap = {
    'Students': ['Students', 'Education'],
    'Farmers': ['Farmers', 'Agriculture'],
    'Women': ['Women'],
    'Entrepreneurs': ['Entrepreneurs'],
    'Housing': ['Housing'],
    'Healthcare': ['Healthcare'],
    'Pension': ['Pension'],
    'Employment': ['Employment'],
    'Social Welfare': ['Social Welfare', 'Social Security']
  };

  const filteredRecommendations = (activeCategory === 'All' 
    ? recommendations 
    : recommendations.filter(r => {
        const mappedCategories = categoryMap[activeCategory] || [activeCategory];
        return mappedCategories.includes(r.category);
      })).slice(0, 10); // STRICT LIMIT: Top 10 highly relevant matches for Demo

  const summaryText = `Analysis complete, ${formattedName}. Based on your socio-economic profile as ${occupationArticle} ${profile.occupation} in ${profile.district}, Samarth has identified high-probability matches primarily in the ${recommendations[0]?.category || 'Education and Skill Development'} sector. Below is the refined list of the top ${filteredRecommendations.length} highly relevant schemes tailored for your profile.`;

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
              Showing Top {filteredRecommendations.length} highly relevant matches tailored for <span className="text-slate-900 font-bold">{formattedName}</span>
            </p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Status</span>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100">Analysis Verified</span>
          </div>
        </div>

        {/* AI Executive Summary with Typewriter Effect */}
        <TypewriterSummary text={summaryText} />

        {/* Categories Filter (Same as Explorer) */}
        <div className="flex flex-wrap gap-2 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600 active:scale-95'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex flex-col gap-10">
          {filteredRecommendations.map((scheme, index) => (
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
                          {scheme.eligibility.income_limit 
                            ? `Up to ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(scheme.eligibility.income_limit)}` 
                            : "No Limit"}
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
                    {scheme.aiExplanation ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown 
                          components={{
                            ul: ({node, ...props}) => <ul className="space-y-3" {...props} />,
                            li: ({node, ...props}) => (
                              <li className="flex items-start gap-3">
                                <span className="text-primary-500 mt-1 text-[10px]">✦</span>
                                <span className="text-slate-700 font-bold leading-relaxed tracking-tight">{props.children}</span>
                              </li>
                            ),
                            p: ({node, ...props}) => <span className="text-slate-700 font-bold leading-relaxed tracking-tight">{props.children}</span>
                          }}
                        >
                          {cleanReasoning(scheme.reasoningPath)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-4 gap-3 opacity-70">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest animate-pulse">Synthesizing logical proof...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section C: Footer */}
              <div className="px-10 py-6 bg-white flex justify-end items-center gap-4">
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mr-4"
                >
                  Deep Detail View
                </button>
                
                <button
                  onClick={() => navigate('/chat', { 
                    state: { 
                      initialMessage: `I want to know more about ${scheme.scheme_name}. What are the required documents and benefits?` 
                    } 
                  })}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-primary-200 text-primary-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-50 hover:border-primary-300 transition-all shadow-sm active:scale-95"
                >
                  <Sparkles size={14} /> Ask AI
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
