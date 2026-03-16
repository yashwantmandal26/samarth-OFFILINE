import React, { useState, useEffect, useRef, useCallback } from 'react';
import { schemeService } from '../services/api';
import { Send, User, Bot, Sparkles, ArrowLeft, Trash2, Mic, Volume2, VolumeX, MicOff, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "🙏 **Namaskar! I'm Samarth** — your Jharkhand Government Schemes Assistant.\n\nI'll ask you a few simple questions, and then recommend the **best government schemes** for you — housing, health, education, pension, farming, and much more!\n\n**Let's get started** — What is your name?" 
    }
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

    // Remove markdown symbols for cleaner TTS
    const cleanText = text.replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
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
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      setMessages([{ 
        role: 'assistant', 
        content: "🙏 **Namaskar! I'm Samarth** — your Jharkhand Government Schemes Assistant.\n\nI'll ask you a few simple questions, and then recommend the **best government schemes** for you — housing, health, education, pension, farming, and much more!\n\n**Let's get started** — What is your name?" 
      }]);
      stopSpeaking();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Chat Header */}
      <div className="bg-white border-b border-slate-100 py-4 px-6 sticky top-20 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <span className="text-xl font-black">स</span>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">Samarth AI</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Find schemes you're eligible for</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-3 py-1.5 text-emerald-700 bg-emerald-50 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                <Globe size={12} /> English
             </button>
             <button 
               onClick={clearChat}
               className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
               title="Clear Chat"
             >
               <Trash2 size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
        <div className="max-w-5xl mx-auto space-y-10 pb-40 pt-10">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-4 max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!m.role.includes('user') && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot size={16} />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className={`p-6 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                      m.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                      <ReactMarkdown 
                        components={{
                          strong: ({node, ...props}) => <span className="font-black text-slate-900" {...props} />,
                          b: ({node, ...props}) => <span className="font-black text-slate-900" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                    {m.role === 'assistant' && (
                      <button 
                        onClick={() => activeSpeechIndex === i ? stopSpeaking() : speak(m.content, i)}
                        className="self-start flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-all text-slate-400 hover:text-emerald-600"
                      >
                        {activeSpeechIndex === i ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        {activeSpeechIndex === i ? "Stop" : "Listen"}
                      </button>
                    )}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <User size={16} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
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
      <div className="bg-white border-t border-slate-100 p-6 fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              "Help me find schemes I'm eligible for", 
              "I'm a farmer, what schemes can I get?", 
              "I'm a student looking for scholarships", 
              "Show me pension schemes"
            ].map(q => (
              <button
                key={q}
                onClick={() => handleSend(null, q)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-[11px] font-bold text-slate-600 rounded-full hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="w-full flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-2 shadow-xl focus-within:border-emerald-500 transition-all">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition-all ${isListening ? 'bg-rose-50 text-rose-600 animate-pulse' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type your answer here..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && !isListening)}
              className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
          
          <div className="mt-4 flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             <span className="flex items-center gap-1.5"><Mic size={10} /> Tap mic to speak</span>
             <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
             <span>Click scheme names for details</span>
             <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
             <span>Your data is private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;
