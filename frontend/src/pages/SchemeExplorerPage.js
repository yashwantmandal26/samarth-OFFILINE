import React, { useState, useEffect } from 'react';
import { schemeService } from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight, BookOpen, Layers } from 'lucide-react';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Explore Jharkhand Schemes</h1>
            <p className="mt-4 text-lg text-gray-600 font-medium">Browse through all {schemes.length} schemes currently available.</p>
          </div>
          <div className="relative group flex-1 max-w-lg">
            <Search className="absolute left-4 top-4 text-gray-400 group-focus-within:text-primary-600 transition-colors" size={24} />
            <input
              type="text"
              placeholder="Search by name or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:ring-0 text-gray-900 placeholder-gray-400 text-lg shadow-sm transition-all group-hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest border-2 transition-all duration-300 shadow-sm ${
                activeCategory === cat 
                ? 'bg-primary-600 text-white border-primary-600 shadow-primary-100 scale-105' 
                : 'bg-white text-gray-600 border-gray-100 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-widest text-gray-400">
          <Layers size={16} className="text-primary-400" /> Showing {filteredSchemes.length} Results
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchemes.map(scheme => (
            <div key={scheme.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-50 overflow-hidden flex flex-col group">
              <div className="p-8 flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-primary-100 text-primary-800 uppercase tracking-widest">
                    {scheme.category}
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                  {scheme.scheme_name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 font-medium">
                  {scheme.description}
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</span>
                  <span className="text-xs font-bold text-gray-600 truncate max-w-[150px]">{scheme.department}</span>
                </div>
                <Link
                  to={`/scheme/${scheme.id}`}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary-600 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                >
                  View <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchemeExplorerPage;
