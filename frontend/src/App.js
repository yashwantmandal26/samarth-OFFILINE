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

// Logo Component with Devanagari 'Sa'
const Logo = ({ size = "12", iconSize = 24 }) => (
  <div className={`w-${size} h-${size} bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg`}>
    <span className="text-2xl font-black">स</span>
  </div>
);

// Nav Link Component for active state
const NavLink = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive 
        ? "text-emerald-700" 
        : "text-slate-600 hover:text-emerald-600"
      }`}
    >
      {label}
    </Link>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        {/* Navigation Bar */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-3 group">
                  <Logo size="10" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-black text-slate-900 tracking-tight leading-none">Samarth</span>
                      <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-black uppercase rounded">Beta</span>
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Jharkhand Citizen Assistant</span>
                  </div>
                </Link>
              </div>
              <div className="hidden lg:flex items-center gap-4">
                <NavLink to="/" label="Home" />
                <NavLink to="/explorer" label="Services" />
                <NavLink to="/explorer" label="Schemes" />
                <NavLink to="/chat" label="About" />
                <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-emerald-600 text-sm font-medium border border-slate-200 rounded-full ml-2">
                   <Globe size={16} /> English
                </button>
                <Link to="/chat" className="ml-4 px-6 py-2 bg-emerald-600 text-white rounded-full text-sm font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100">
                  Start Chat
                </Link>
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
        <footer className="bg-slate-50 border-t border-slate-100 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <Logo size="8" />
                <span className="text-xl font-black text-slate-900 tracking-tighter">Samarth</span>
              </div>
              
              <div className="flex gap-8">
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Privacy</Link>
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Terms</Link>
                <Link to="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Contact</Link>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-xs font-medium text-slate-400">
                  © 2026 Samarth. Built for Jharkhand citizens.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
