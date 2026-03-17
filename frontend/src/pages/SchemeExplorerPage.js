import React, { useState, useEffect } from 'react';
import { schemeService } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const SchemeExplorerPage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = `Samarth | ${t('nav_explorer')}`;
  }, [t]);

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
      const mappedCategories = categoryMap[activeCategory] || [activeCategory];
      result = result.filter(s => mappedCategories.includes(s.category));
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
                <ArrowLeft size={14} /> {t('back_to_home')}
              </Link>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4 uppercase">{t('explorer_title')}</h1>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest flex items-center gap-2">
                <div className="h-1 w-8 bg-primary-600 rounded-full"></div>
                {t('explorer_subtitle')} ({schemes.length})
              </p>
            </div>
            <div className="relative group flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder={t('explorer_search_placeholder')}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:border-primary-500 focus:ring-0 text-sm font-bold text-slate-700 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
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

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchemes.map((scheme, i) => (
              <motion.div 
                key={scheme.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="enterprise-card group"
              >
                <div className="p-10 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <span className="badge-primary">
                      {t(`cat_${scheme.category.toLowerCase()}`)}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {scheme.id}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-primary-600 transition-colors uppercase tracking-tight">
                    {scheme.scheme_name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 italic">
                    {scheme.description}
                  </p>
                </div>
                <div className="px-10 py-8 bg-slate-50 border-t border-slate-50 flex items-center justify-between group-hover:bg-white transition-colors">
                  <div className="overflow-hidden">
                    <span className="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Department</span>
                    <span className="block text-[10px] font-bold text-slate-500 truncate max-w-[140px] uppercase tracking-tighter">{scheme.department}</span>
                  </div>
                  <Link
                    to={`/scheme/${scheme.id}`}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                  >
                    {t('details')} <ChevronRight size={14} />
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
