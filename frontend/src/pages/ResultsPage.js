import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Award, Sparkles, Brain, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: null };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100">
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
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-widest text-primary-700 uppercase bg-primary-100 rounded-full">
              Analysis Complete
            </span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
              Tailored for {profile.name}
            </h1>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
              Our agents identified {totalMatches} eligible schemes.
            </p>
          </div>
          <Link to="/finder" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2 mb-1">
            <ArrowLeft size={14} /> Refine Profile
          </Link>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((scheme, index) => (
            <motion.div 
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col group"
            >
              {/* Card Header */}
              <div className="p-8 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {scheme.category}
                  </span>
                  <div className="flex items-center text-primary-600 text-sm font-black uppercase tracking-tighter">
                    <Award size={16} className="mr-1" /> {scheme.matchScore}%
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3rem]">
                  {scheme.scheme_name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                  {scheme.description}
                </p>
              </div>

              {/* AI Insight (Simplified by Translation Agent) */}
              {scheme.aiExplanation && (
                <div className="px-8 py-5 bg-slate-50 border-y border-slate-100 group-hover:bg-primary-50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={12} className="text-primary-600" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Insight</span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-bold leading-relaxed italic">
                    "{scheme.aiExplanation}"
                  </p>
                </div>
              )}

              {/* Policy Reasoning (Technical Agent Output) */}
              <div className="p-8 pt-6 mt-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain size={12} className="text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Policy Reasoning</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2 italic">
                    {scheme.reasoningChain || "Matched based on profile eligibility rules."}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-lg shadow-slate-50 active:scale-95"
                >
                  Details <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
