import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schemeService } from '../services/api';
import { Send, User, Bot, Sparkles, ArrowLeft, Trash2, Mic, Volume2, VolumeX, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I am Samarth, your Jharkhand Government Scheme assistant. How can I help you today?" }
  ]);
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
      recognitionRef.current.lang = 'en-IN'; // Default to Indian English, can be 'hi-IN'

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
  }, []);

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

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Voice selection logic
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang === 'hi-IN') || 
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
  }, []);

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
      const response = await schemeService.chat(messageToSend, {}, []);
      const assistantMessage = { role: 'assistant', content: response.data.response };
      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      
      // Auto-play TTS for the new response
      setTimeout(() => speak(assistantMessage.content, updatedMessages.length - 1), 500);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { role: 'assistant', content: "Offline Error. Please ensure Ollama is running Llama3." };
      setMessages([...newMessages, errorMessage]);
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
                  <div className="flex flex-col gap-2">
                    <div className={`p-4 rounded-2xl shadow-sm border text-sm font-medium leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' : 'bg-white text-slate-700 border-slate-50 rounded-tl-none italic'}`}>
                      {m.content}
                    </div>
                    {m.role === 'assistant' && (
                      <button 
                        onClick={() => activeSpeechIndex === i ? stopSpeaking() : speak(m.content, i)}
                        className={`self-start p-1.5 rounded-full transition-all ${activeSpeechIndex === i ? 'bg-primary-50 text-primary-600 animate-pulse' : 'text-slate-300 hover:text-primary-500 hover:bg-slate-50'}`}
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
              <Sparkles size={10} className="text-primary-400" /> Powered by Local Llama3 • Private Analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
