import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Globe, 
  MessageSquare, 
  Bot, 
  Cpu, 
  Database,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = "Samarth | Jharkhand AI E-Governance";
  }, []);

  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-primary-100 shadow-sm">
                <Sparkles size={12} className="animate-pulse" />
                Next-Gen E-Governance Platform
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                {t('hero_title').split(' ').map((word, i) => (
                  <React.Fragment key={i}>
                    {word === 'Jharkhand' || word === 'झारखंड' ? <span className="text-primary-600">{word}</span> : word}{' '}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-12 italic">
                {t('hero_subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/finder"
                  className="btn-primary px-10 py-5 text-lg"
                >
                  {t('find_btn')} <Search size={20} />
                </Link>
                <Link
                  to="/chat"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-primary-200 hover:text-primary-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                >
                  <MessageSquare size={20} /> {t('nav_chat')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-400 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="py-12 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-40 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-3 font-black text-slate-900 text-xs uppercase tracking-[0.2em]">
              <ShieldCheck size={24} className="text-primary-600" /> 100% Private
            </div>
            <div className="flex items-center gap-3 font-black text-slate-900 text-xs uppercase tracking-[0.2em]">
              <Globe size={24} className="text-blue-600" /> Local Intelligence
            </div>
            <div className="flex items-center gap-3 font-black text-slate-900 text-xs uppercase tracking-[0.2em]">
              <Cpu size={24} className="text-purple-600" /> Multi-Agent System
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Search,
                title: "Policy Matching",
                desc: "Our Symbolic-AI engine cross-references your profile against 90+ Jharkhand schemes with 100% deterministic accuracy.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: MessageSquare,
                title: "Natural Language",
                desc: "Interact with Samarth in plain English or Hindi. No bureaucratic jargon, just simple conversations.",
                color: "bg-purple-50 text-purple-600"
              },
              {
                icon: Database,
                title: "Secure & Local",
                desc: "Everything runs on your machine. Your personal documents and data never leave your computer.",
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] border border-slate-50 hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 group"
              >
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed italic">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none">
          <Bot size={400} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-none">Ready to discover your benefits?</h2>
              <p className="text-slate-400 font-medium text-lg italic max-w-lg">Join thousands of Jharkhand citizens who have already found their perfect policy match.</p>
            </div>
            <Link
              to="/finder"
              className="btn-primary px-12 py-6 text-sm bg-primary-600 shadow-primary-900/20"
            >
              Get Started Now <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
