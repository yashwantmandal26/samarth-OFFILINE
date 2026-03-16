import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Search, MessageSquare, BookOpen, Bot } from 'lucide-react';

// Pages
import LandingPage from './pages/LandingPage';
import SchemeFinderWizard from './pages/SchemeFinderWizard';
import ResultsPage from './pages/ResultsPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import SchemeExplorerPage from './pages/SchemeExplorerPage';
import AIChatPage from './pages/AIChatPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Bot size={24} />
                  </div>
                  <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Samarth</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {[
                  { to: "/", icon: Home, label: "Home" },
                  { to: "/finder", icon: Search, label: "Find Schemes" },
                  { to: "/explorer", icon: BookOpen, label: "Explorer" },
                  { to: "/chat", icon: MessageSquare, label: "AI Assistant" }
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-all uppercase tracking-widest"
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}
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
        <footer className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                  <Bot size={18} />
                </div>
                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">Samarth</span>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                © 2026 Government of Jharkhand • Local AI Powered
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary-600">Privacy Policy</a>
                <a href="#" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-primary-600">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
