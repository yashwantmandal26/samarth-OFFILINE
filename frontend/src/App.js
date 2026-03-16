import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, BookOpen, Bot, Github, ExternalLink } from 'lucide-react';

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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900">
        {/* Navigation Bar */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <Bot size={28} />
                  </div>
                  <div>
                    <span className="block text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Samarth</span>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Jharkhand MAS</span>
                  </div>
                </Link>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <NavLink to="/" icon={Home} label="Home" />
                <NavLink to="/finder" icon={Search} label="Find Schemes" />
                <NavLink to="/explorer" icon={BookOpen} label="Explorer" />
                <NavLink to="/chat" icon={MessageSquare} label="AI Assistant" />
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
        <footer className="bg-white border-t border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary-400">
                    <Bot size={22} />
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
                © 2026 Government of Jharkhand • MCA Dissertation Project
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                MAS System Active
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
