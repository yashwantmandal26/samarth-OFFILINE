import React from 'react';
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
import logoImg from '../assets/logo.png';

const LandingPage = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-12 border border-emerald-100 shadow-sm">
                <Sparkles size={12} className="text-emerald-500" />
                AI-Powered Scheme Discovery
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                Don't search for schemes. <br />
                <span className="relative inline-block">
                  Let schemes find you.
                  <div className="absolute bottom-4 left-0 w-full h-3 bg-orange-200/60 -z-10 rounded-full"></div>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                Answer a few simple questions and Samarth AI will find every Jharkhand & Central government scheme, scholarship, and pension you're eligible for.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-6">
                <Link
                  to="/chat"
                  className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95"
                >
                  <MessageSquare size={20} /> Find My Schemes — Start Chat
                </Link>
                <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2 text-slate-600"><Bot size={14} className="text-purple-600" /> Supports Hindi, English & Santhali</span>
                  <span className="flex items-center gap-2 text-slate-600"><CheckCircle size={14} className="text-emerald-500" /> 100% Free</span>
                  <span className="flex items-center gap-2 text-slate-600"><ShieldCheck size={14} className="text-orange-500" /> Private</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-slate-50/50 rounded-3xl border border-slate-100 p-10 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">How it works</h4>
             <div className="space-y-6">
               {[
                 { step: 1, text: "Samarth asks you simple questions about yourself" },
                 { step: 2, text: "AI matches your profile with 50+ govt schemes" },
                 { step: 3, text: "Get eligibility, documents & apply links instantly" }
               ].map((item) => (
                 <div key={item.step} className="flex items-center gap-4">
                   <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                     {item.step}
                   </div>
                   <p className="text-slate-700 font-medium text-sm">{item.text}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* Why Citizens Love Samarth */}
      <section className="py-32 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Why Citizens Love Samarth</h2>
            <p className="text-slate-500 font-medium">Built to make government schemes accessible to every Jharkhand citizen</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-20 gap-x-12">
            {[
              {
                icon: MessageSquare,
                title: "Conversational Discovery",
                desc: "No long forms. Samarth asks you simple questions one-by-one and builds your profile to find matching schemes.",
                color: "text-emerald-600"
              },
              {
                icon: Target,
                title: "Personalised Matching",
                desc: "AI matches your age, income, caste, occupation, and location against 50+ state and central schemes.",
                color: "text-emerald-600"
              },
              {
                icon: Mic,
                title: "Multilingual Support",
                desc: "Chat in Hindi, English, Santhali, or any language you're comfortable with. Samarth understands them all.",
                color: "text-emerald-600"
              },
              {
                icon: FileText,
                title: "Documents & Steps",
                desc: "Get the exact documents needed and step-by-step apply process with official portal links.",
                color: "text-emerald-600"
              },
              {
                icon: IndianRupee,
                title: "100% Free",
                desc: "Samarth is completely free for all citizens of Jharkhand. No hidden costs, no subscriptions.",
                color: "text-emerald-600"
              },
              {
                icon: Globe,
                title: "State + Central Schemes",
                desc: "Covers both Jharkhand state schemes and all central government schemes available to Jharkhand citizens.",
                color: "text-emerald-600"
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110`}>
                  <f.icon size={32} className={f.color} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="container mx-auto px-6 text-center">
           <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white overflow-hidden shadow-xl shadow-emerald-100"> 
                <img src={logoImg} alt="Samarth Logo" className="h-12 w-12 object-contain" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">© 2026 Samarth. Built for Jharkhand citizens.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
