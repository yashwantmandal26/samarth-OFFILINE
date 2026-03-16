import React, { useState, useEffect, useRef } from 'react';
import { schemeService } from '../services/api';
import { Send, User, Bot, Loader, Sparkles, ArrowLeft, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am Samarth, your Jharkhand Government Scheme assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e, customMessage = null) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await schemeService.chat(messageToSend, {}, []);
      setMessages([...newMessages, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'assistant', content: "Offline Error. Please ensure Ollama is running Llama3." }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared. How can I assist you further?" }]);
  };

  const suggestions = [
    "Student schemes",
    "Farmer loans",
    "Scholarships",
    "Ayushman Bharat?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary-400 shadow-lg">
                <Bot size={20} />
              </div>
              <div>
                <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">Samarth AI</h1>
                <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Local Intelligence
                </div>
              </div>
            </div>
          </div>
          <button onClick={clearChat} className="p-2 text-slate-300 hover:text-rose-500 transition-colors" title="Clear Chat">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-100'}`}>
                    {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-4 rounded-2xl shadow-sm border text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' : 'bg-white text-slate-700 border-slate-50 rounded-tl-none italic'}`}>
                    {m.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                  <Bot size={14} />
                </div>
                <div className="p-4 bg-white border border-slate-50 rounded-2xl rounded-tl-none flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Processing</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={(e) => handleSend(e, s)}
                className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100 hover:border-primary-400 hover:text-primary-600 hover:bg-white transition-all shadow-sm"
              >
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Jharkhand policies..."
              className="w-full p-4 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 text-sm font-bold text-slate-900 placeholder-slate-300 transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2.5 bg-slate-900 text-white rounded-xl hover:bg-primary-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="inline-flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
              <Sparkles size={10} className="text-primary-400" /> Powered by Local Llama3 • Private Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
