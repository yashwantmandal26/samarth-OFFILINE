import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage, languages } from '../context/LanguageContext';

const LanguageModal = () => {
  const { userLanguage, changeLanguage, isFirstVisit, setIsFirstVisit } = useLanguage();

  if (!isFirstVisit) return null;

  const handleLanguageSelect = (langCode) => {
    changeLanguage(langCode);
    setIsFirstVisit(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="p-12">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 shadow-sm">
                <Globe size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Choose Your Language</h2>
              <p className="text-slate-500 font-medium leading-relaxed italic">
                Aapki suvidha ke liye bhasha chunein. Choose your preferred language for a better experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Object.values(languages).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`group relative flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                    userLanguage === lang.code 
                    ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-100" 
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-xs font-black uppercase tracking-[0.2em] mb-1 ${
                      userLanguage === lang.code ? "text-primary-600" : "text-slate-400"
                    }`}>
                      {lang.label}
                    </span>
                    <span className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      {lang.nativeLabel}
                    </span>
                  </div>
                  
                  {userLanguage === lang.code ? (
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                      <CheckCircle2 size={24} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all">
                      <div className="w-2 h-2 bg-slate-300 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                You can change this anytime from the navigation bar
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LanguageModal;
