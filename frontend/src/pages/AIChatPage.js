import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { schemeService } from '../services/api';
import { Send, User, Bot, Sparkles, ArrowLeft, Trash2, Mic, Volume2, VolumeX, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

const AIChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLanguage, t } = useLanguage();
  
  useEffect(() => {
    document.title = "Samarth | AI Assistant";
    
    // Cleanup: Stop all speech and recognition when leaving the page
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('chat_initial') }
  ]);

  // Update initial message if language changes and no other messages exist
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'assistant') {
      setMessages([{ role: 'assistant', content: t('chat_initial') }]);
    }
  }, [userLanguage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Update language based on user selection
      recognitionRef.current.lang = userLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Auto-send after a short delay to allow user to see the text
        setTimeout(() => handleSend(null, transcript), 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [userLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (isSpeaking) stopSpeaking();
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speak = useCallback((text, index) => {
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    // Remove markdown symbols for cleaner TTS
    const cleanText = text.replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language for TTS
    if (userLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN'; // Natural for English and Hinglish
    }
    
    // Voice selection logic
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang === utterance.lang) || 
                          voices.find(v => v.lang === 'hi-IN') || 
                          voices.find(v => v.lang === 'en-IN') || 
                          voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeechIndex(index);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechIndex(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechIndex(null);
    };

    synthRef.current.speak(utterance);
  }, [userLanguage]);

  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
    setActiveSpeechIndex(null);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleSend(null, location.state.initialMessage);
      // Clear state to prevent re-sending on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSend = async (e, customMessage = null) => {
    if (e) e.preventDefault();
    const messageToSend = customMessage || input;
    if (!messageToSend.trim()) return;

    if (isSpeaking) stopSpeaking();

    const newMessages = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Optional: Get user profile from localStorage if available
      const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const response = await schemeService.chat(messageToSend, userProfile, [], userLanguage);
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.response,
        relatedSchemes: response.data.relatedSchemes || []
      };
      
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Auto-play TTS for the new response
      setTimeout(() => speak(assistantMessage.content, updatedMessages.length - 1), 500);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "### Connection Issue\nI apologize, but I am currently unable to reach my knowledge base. \n\n**Possible reasons:**\n1. Ollama is not running at `127.0.0.1:11434`.\n2. The `llama3` model is not installed.\n3. CORS origins are not set to `*`." 
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm(t('chat_clear_confirm'))) {
      setMessages([{ role: 'assistant', content: t('chat_initial') }]);
      stopSpeaking();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 py-4 px-6 shrink-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 overflow-hidden">
                <img src={logo} alt="Samarth Logo" className="w-full h-full object-contain p-1.5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Samarth AI</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Local Intelligence</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

    <div className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-4xl mx-auto">
      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1 ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-100 overflow-hidden'}`}>
                  {m.role === 'user' ? <User size={14} /> : <img src={logo} alt="Bot" className="w-full h-full object-contain p-1" />}
                </div>
                <div className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 rounded-2xl shadow-sm border text-sm font-sans leading-relaxed not-italic ${
                    m.role === 'user' 
                    ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-slate-50 rounded-tl-none'
                  }`}>
                    <ReactMarkdown 
                      components={{
                        strong: ({node, ...props}) => <span className="font-semibold text-slate-900" {...props} />,
                        b: ({node, ...props}) => <span className="font-semibold text-slate-900" {...props} />,
                        code: ({node, inline, ...props}) => (
                          <code className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />
                        ),
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>

                    {/* Interactive Scheme Buttons */}
                    {m.role === 'assistant' && m.relatedSchemes && m.relatedSchemes.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {m.relatedSchemes.map((scheme) => (
                          <button
                            key={scheme.id}
                            onClick={() => navigate(`/scheme/${scheme.id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 border border-primary-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 hover:text-white transition-all shadow-sm active:scale-95 group"
                          >
                            <Sparkles size={12} className="group-hover:animate-pulse" />
                            {scheme.scheme_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {m.role === 'assistant' && (
                    <button 
                      onClick={() => activeSpeechIndex === i ? stopSpeaking() : speak(m.content, i)}
                      className={`p-1.5 rounded-full transition-all ${activeSpeechIndex === i ? 'bg-primary-50 text-primary-600 animate-pulse' : 'text-slate-300 hover:text-primary-500 hover:bg-slate-50'}`}
                      title={activeSpeechIndex === i ? "Stop speaking" : "Read aloud"}
                    >
                      {activeSpeechIndex === i ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start w-full">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shrink-0 shadow-sm overflow-hidden mt-1">
                <img src={logo} alt="Bot" className="w-full h-full object-contain p-1" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-50 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>

    {/* Chat Input Area */}
    <div className="shrink-0 w-full bg-white border-t border-slate-200 p-4 md:p-6 pb-8 flex justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white/90 backdrop-blur-lg border border-slate-100 p-6 rounded-[2rem] shadow-2xl">
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {['Student Schemes', 'Farmer Loans', 'Scholarships', 'Ayushman Bharat?'].map(q => (
              <button
                key={q}
                onClick={() => handleSend(null, q)}
                className="px-4 py-1.5 bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400 rounded-full hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask anything about Jharkhand policies..."}
              className={`w-full p-4 pr-24 bg-slate-50 border ${isListening ? 'border-primary-500 ring-2 ring-primary-100' : 'border-slate-200'} rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 text-sm font-bold text-slate-900 placeholder-slate-300 transition-all`}
            />
            <div className="absolute right-2 top-2 flex gap-1.5">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-all shadow-lg ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-primary-600 border border-slate-100'}`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                disabled={loading || (!input.trim() && !isListening)}
                className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-primary-600 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="inline-flex items-center gap-1.5 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
              <Sparkles size={10} className="text-primary-400" /> Powered by Local Llama3:8b • Private Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AIChatPage;
