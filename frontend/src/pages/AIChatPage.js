import React, { useState, useEffect, useRef } from 'react';
import { schemeService } from '../services/api';
import { Send, User, Bot, Loader, MessageSquare, Sparkles } from 'lucide-react';

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
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I'm having trouble connecting to my brain right now. Please make sure Ollama is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Show student schemes",
    "Show farmer schemes",
    "Show scholarship schemes",
    "How to apply for Ayushman Bharat?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Bot size={28} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Samarth AI Assistant</h1>
              <div className="flex items-center gap-2 text-xs text-green-600 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online & Ready to Help
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${m.role === 'user' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600 border border-primary-100'}`}>
                  {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-2xl shadow-sm border ${m.role === 'user' ? 'bg-primary-600 text-white border-primary-500 rounded-tr-none' : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'}`}>
                  <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-primary-400">
                  <Bot size={20} />
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader className="animate-spin text-primary-600" size={18} />
                  <span className="text-gray-400 text-sm font-medium">Samarth is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-6">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={(e) => handleSend(e, s)}
                className="px-4 py-2 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full border border-gray-200 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all shadow-sm"
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
              placeholder="Ask anything about Jharkhand schemes..."
              className="w-full p-5 pr-16 border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:ring-0 text-gray-900 placeholder-gray-400 text-lg transition-all shadow-sm group-hover:shadow-md"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-3 p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-100"
            >
              <Send size={24} />
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-gray-400 font-medium flex items-center justify-center gap-1 uppercase tracking-widest">
            <Sparkles size={12} className="text-primary-400" /> Powered by Local LLM (Llama3) • Fully Offline
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
