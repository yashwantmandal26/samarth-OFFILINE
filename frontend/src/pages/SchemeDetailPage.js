import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemeService } from '../services/api';
import { 
  ChevronLeft, ExternalLink, FileText, CheckCircle, 
  Clock, CreditCard, Info, MapPin, Sparkles, AlertCircle, Award, ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await schemeService.getSchemeById(id);
        setScheme(response.data);
      } catch (error) {
        console.error('Error fetching scheme:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader className="animate-spin text-primary-600" size={32} />
    </div>
  );
  
  if (!scheme) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-[2rem] shadow-xl border border-slate-100">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">Scheme not found</h2>
        <Link to="/explorer" className="inline-flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Back to Explorer
        </Link>
      </div>
    </div>
  );

  const DetailSection = ({ title, icon: Icon, children, colorClass = "text-primary-600" }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-10 mb-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h3>
      </div>
      <div className="text-slate-600 leading-relaxed font-medium">
        {children}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link to="/results" className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all mb-10">
          <ArrowLeft size={14} /> Back to Recommendations
        </Link>

        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden mb-8 border border-slate-100"
        >
          <div className="p-12 border-b border-slate-50 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary-100 text-primary-700">
                {scheme.category}
              </span>
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500">
                {scheme.department}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              {scheme.scheme_name}
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
              {scheme.description}
            </p>
          </div>
          <div className="bg-slate-900 p-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-center md:text-left">Direct Application</p>
              <h4 className="text-2xl font-black text-white uppercase tracking-tight">Official Government Portal</h4>
            </div>
            <a 
              href={scheme.official_portal} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/20 active:scale-95"
            >
              Apply Now <ExternalLink size={20} />
            </a>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-2">
          <DetailSection title="Key Benefits" icon={Award}>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Array.isArray(scheme.benefits) ? scheme.benefits : [scheme.benefits]).map((b, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={12} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 leading-tight">{b}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="Eligibility" icon={CheckCircle} colorClass="text-emerald-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(scheme.eligibility).map(([key, value]) => (
                <div key={key} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{key.replace('_', ' ')}</h4>
                  <p className="text-sm font-black text-slate-700 uppercase tracking-tight">{Array.isArray(value) ? value.join(', ') : value.toString()}</p>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Documentation" icon={FileText} colorClass="text-blue-600">
            <div className="space-y-3">
              {scheme.documents_required.map((doc, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{doc}</span>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Application Guide" icon={MapPin} colorClass="text-orange-600">
            <div className="p-8 bg-orange-50/50 rounded-[2rem] border border-orange-100 text-slate-700 font-bold text-sm leading-relaxed">
              {scheme.application_process}
            </div>
          </DetailSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex items-center gap-6">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Processing Fees</h4>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{scheme.fees}</p>
              </div>
            </div>
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Estimate</h4>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{scheme.processing_time}</p>
              </div>
            </div>
          </div>

          <DetailSection title="Important Notes" icon={Info} colorClass="text-amber-600">
            <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <AlertCircle className="text-amber-600 shrink-0" size={20} />
              <p className="text-xs font-bold text-amber-900 leading-relaxed uppercase tracking-wide">
                Always ensure your Aadhar is linked with your bank account for DBT (Direct Benefit Transfer) schemes. 
                Visit your nearest Pragya Kendra (CSC) for offline assistance.
              </p>
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

const Loader = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default SchemeDetailPage;
