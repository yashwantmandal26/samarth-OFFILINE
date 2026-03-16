import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, List, ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary-700 uppercase bg-primary-100 rounded-full">
                Jharkhand E-Governance Portal
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
                Samarth: Empowering <span className="text-primary-600">Jharkhand</span> Through AI
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                The state-of-the-art multimodal multi-agent system designed to help you discover 
                and navigate government schemes with ease. Powered by local, private AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/finder"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <Search size={20} /> Find My Schemes
                </Link>
                <Link
                  to="/chat"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-primary-200 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} /> AI Assistant
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="py-8 border-y border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 font-black text-slate-400 text-sm uppercase tracking-widest">
              <ShieldCheck size={20} /> 100% Private
            </div>
            <div className="flex items-center gap-2 font-black text-slate-400 text-sm uppercase tracking-widest">
              <Globe size={20} /> Local AI
            </div>
            <div className="flex items-center gap-2 font-black text-slate-400 text-sm uppercase tracking-widest">
              <Zap size={20} /> Multimodal
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">Intelligent Capabilities</h2>
          <div className="w-16 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Policy Matching",
                desc: "Autonomous agents use RAG to evaluate your profile against 50+ complex scheme policies.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: MessageSquare,
                title: "Explainable AI",
                desc: "Get transparent, jargon-free explanations in your language, powered by local Llama3.",
                color: "bg-primary-50 text-primary-600"
              },
              {
                icon: List,
                title: "Document Vision",
                desc: "Simply upload your certificates, and our Vision Agent will automatically extract key details.",
                color: "bg-orange-50 text-orange-600"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-2xl hover:bg-white transition-all group"
              >
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/explorer" className="inline-flex items-center gap-2 font-black text-primary-600 uppercase tracking-widest text-sm hover:gap-4 transition-all">
              Browse All Schemes <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
