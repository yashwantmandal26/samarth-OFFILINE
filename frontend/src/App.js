import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, BookOpen, Bot, Github, ExternalLink, Globe, ChevronDown, Check } from 'lucide-react';
import logo from './assets/logo.png';
import { useLanguage, languages } from './context/LanguageContext';
import LanguageModal from './components/LanguageModal';

// Pages
import LandingPage from './pages/LandingPage';
import SchemeFinderWizard from './pages/SchemeFinderWizard';
import ResultsPage from './pages/ResultsPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import SchemeExplorerPage from './pages/SchemeExplorerPage';
import AIChatPage from './pages/AIChatPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Nav Link Component for active state
const NavLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all uppercase tracking-widest ${
        isActive 
        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
};

// Language Toggle Component
const LanguageToggle = () => {
  const { userLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all uppercase tracking-widest border border-slate-100 bg-white"
      >
        <Globe size={18} />
        {languages[userLanguage].nativeLabel}
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 p-2 z-50 overflow-hidden">
            {Object.values(languages).map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  userLanguage === lang.code 
                  ? "bg-primary-50 text-primary-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {lang.nativeLabel}
                {userLanguage === lang.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function AppContent() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-slate-800 shadow-xl shadow-indigo-100">
                  <span className="text-white font-black text-2xl">S</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Samarth</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Scheme Identification</span>
                </div>
              </Link>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              <NavLink to="/" icon={Home} label={t('nav_home')} />
              <NavLink to="/finder" icon={Search} label={t('nav_finder')} />
              <NavLink to="/explorer" icon={BookOpen} label={t('nav_explorer')} />
              <NavLink to="/chat" icon={MessageSquare} label={t('nav_chat')} />
              <div className="w-px h-8 bg-slate-100 mx-2" />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/finder" element={<SchemeFinderWizard />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/scheme/:id" element={<SchemeDetailPage />} />
          <Route path="/explorer" element={<SchemeExplorerPage />} />
          <Route path="/chat" element={<AIChatPage />} />
        </Routes>
      </main>

      {/* Footer */}
      {location.pathname !== '/chat' && (
        <footer className="bg-white border-t border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-lg">
                    <span className="text-white font-black text-xl">S</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Samarth</span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm mb-8 italic">
                  A research-grade Hybrid Symbolic-Generative Multi-Agent System for Jharkhand's digital e-governance transformation.
                </p>
                <div className="flex gap-4">
                  <a href="https://github.com/yashwantmandal26/samarth-OFFILINE.git" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                    <Github size={20} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6">Platform</h4>
                <ul className="space-y-4">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/finder", label: "Scheme Finder" },
                    { to: "/explorer", label: "Policy Explorer" },
                    { to: "/chat", label: "AI Chat" }
                  ].map(link => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-6">Resources</h4>
                <ul className="space-y-4">
                  <li><a href="https://www.jharkhand.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center gap-2">Govt Portal <ExternalLink size={12}/></a></li>
                  <li><a href="https://www.jharkhand.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Privacy Policy</a></li>
                  <li><a href="https://www.jharkhand.gov.in/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms of Service</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                MCA Dissertation Project
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Samarth System Active
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LanguageModal />
      <AppContent />
    </Router>
  );
}

export default App;
