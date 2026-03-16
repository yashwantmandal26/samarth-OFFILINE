import React, { useState, useEffect } from 'react';
import { schemeService } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const SchemeExplorerPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Students', 'Farmers', 'Women', 'Entrepreneurs', 'Housing', 'Healthcare', 'Pension', 'Employment'];

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await schemeService.getAllSchemes();
        setSchemes(response.data);
        setFilteredSchemes(response.data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  useEffect(() => {
    let result = schemes;
    if (activeCategory !== 'All') {
      result = result.filter(s => s.category === activeCategory);
    }
    if (searchTerm) {
      result = result.filter(s => 
        s.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredSchemes(result);
  }, [searchTerm, activeCategory, schemes]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 mb-6 transition-all">
                <ArrowLeft size={14} /> Back to Home
              </Link>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">Policy Explorer</h1>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Discover Jharkhand's digital transformation through {schemes.length} initiatives.</p>
            </div>
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by keyword..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:border-primary-500 focus:ring-0 text-sm font-bold text-slate-700 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  activeCategory === cat 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="flex items-center gap-2 mb-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">
            <Layers size={14} /> {filteredSchemes.length} Results Found
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme, i) => (
              <motion.div 
                key={scheme.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-50 overflow-hidden flex flex-col group"
              >
                <div className="p-8 flex-1">
                  <span className="inline-block px-3 py-1 rounded-lg text-[8px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-widest mb-6 group-hover:bg-emerald-100 transition-colors">
                    {scheme.category}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">
                    {scheme.scheme_name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {scheme.description}
                  </p>
                </div>
                <div className="px-8 py-6 bg-slate-50 border-t border-slate-50 flex items-center justify-between group-hover:bg-white transition-colors">
                  <div className="overflow-hidden">
                    <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Dept.</span>
                    <span className="block text-[10px] font-bold text-slate-500 truncate max-w-[140px] uppercase tracking-tighter">{scheme.department}</span>
                  </div>
                  <Link
                    to={`/scheme/${scheme.id}`}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95"
                  >
                    View <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeExplorerPage;
