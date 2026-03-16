import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ChevronRight, 
  ChevronLeft, 
  Loader, 
  User, 
  MapPin, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Upload,
  Eye,
  Brain,
  Languages,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SchemeFinderWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [visionLoading, setVisionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [agentWorkflow, setAgentWorkflow] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    income: '',
    socialCategory: '',
    district: '',
    residence: 'Rural',
    qualification: '',
    isBPL: false,
    housingStatus: 'Own',
    landHolding: 'None',
    preferredCategory: ''
  });

  const steps = [
    { title: 'Smart Start', icon: Sparkles, color: 'bg-primary-500' },
    { title: 'Personal', icon: User, color: 'bg-blue-500' },
    { title: 'Region', icon: MapPin, color: 'bg-emerald-500' },
    { title: 'Social', icon: Users, color: 'bg-purple-500' },
    { title: 'Status', icon: Briefcase, color: 'bg-orange-500' }
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocument(file);
      setDocumentPreview(URL.createObjectURL(file));
      
      // Auto-extract logic
      setVisionLoading(true);
      setError(null);
      
      try {
        const data = new FormData();
        data.append('document', file);
        data.append('userData', JSON.stringify(formData)); // Send current form data

        const response = await api.post('/recommendations', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.profile) {
          const extracted = response.data.profile;
          setFormData(prev => ({
            ...prev,
            name: extracted.name || prev.name,
            age: extracted.age || prev.age,
            gender: extracted.gender || prev.gender,
            income: extracted.income || prev.income,
            socialCategory: extracted.socialCategory || prev.socialCategory,
            isBPL: extracted.isBPL !== undefined ? extracted.isBPL : prev.isBPL
          }));
        }
      } catch (err) {
        console.error('Vision Extraction Error:', err);
        setError(err.response?.data?.error || err.message || 'Vision scanner failed. Please fill manually.');
      } finally {
        setVisionLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError(null);
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < steps.length) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 2: // Personal (Previously Step 1)
        if (!formData.name || !formData.age || !formData.gender) {
          setError('Please verify your personal details.');
          return false;
        }
        return true;
      case 3: // Region
        if (!formData.district) {
          setError('Please select your district.');
          return false;
        }
        return true;
      case 4: // Social
        if (!formData.socialCategory) {
          setError('Please select your social category.');
          return false;
        }
        return true;
      case 5: // Status
        if (!formData.income || !formData.occupation) {
          setError('Please fill in all status details.');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    // Initial state for the sequential animation
    setAgentWorkflow([
        { agent: 'Vision Agent', status: 'Pending', active: false },
        { agent: 'Reasoning Agent', status: 'Pending', active: false },
        { agent: 'Translation Agent', status: 'Pending', active: false }
    ]);

    try {
      const response = await api.post('/recommendations', formData);
      
      // Sequential animation logic (3 seconds total)
      // Step 1: Vision Agent (0s - 1s)
      setAgentWorkflow([
        { agent: 'Vision Agent', status: 'Scanning document...', active: true },
        { agent: 'Reasoning Agent', status: 'Pending', active: false },
        { agent: 'Translation Agent', status: 'Pending', active: false }
      ]);

      setTimeout(() => {
        // Step 2: Reasoning Agent (1s - 2s)
        setAgentWorkflow([
          { agent: 'Vision Agent', status: 'Analysis verified', active: false },
          { agent: 'Reasoning Agent', status: 'Matching policies...', active: true },
          { agent: 'Translation Agent', status: 'Pending', active: false }
        ]);
      }, 1000);

      setTimeout(() => {
        // Step 3: Translation Agent (2s - 3s)
        setAgentWorkflow([
          { agent: 'Vision Agent', status: 'Analysis verified', active: false },
          { agent: 'Reasoning Agent', status: 'Logic verified', active: false },
          { agent: 'Translation Agent', status: 'Simplifying output...', active: true }
        ]);
      }, 2000);

      setTimeout(() => {
        navigate('/results', { state: { results: response.data } });
      }, 3000);

    } catch (err) {
      console.error('Final Analysis Error:', err);
      setError(err.response?.data?.error || err.message || 'Analysis failed. Ensure Ollama is running.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    const variants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Smart Intake</h3>
                <p className="text-xs text-slate-500 font-medium">Upload a document to pre-fill your profile automatically.</p>
              </div>
              <div className={`p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all ${visionLoading ? 'bg-primary-50 border-primary-200' : 'bg-slate-50 border-slate-200 hover:border-primary-400'}`}>
                {visionLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-200 animate-pulse">
                      <Eye size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-primary-600 uppercase tracking-widest">Vision Agent Active</p>
                      <p className="text-[10px] text-primary-400 font-bold uppercase tracking-tighter">Reading document...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Aadhaar or Certificate</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">JPG, PNG supported</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="smart-upload" />
                    <label htmlFor="smart-upload" className="px-8 py-3 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-primary-700 transition-all shadow-lg shadow-primary-100">
                      Select Document
                    </label>
                  </>
                )}
              </div>
              
              {!visionLoading && (
                <div className="text-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Or</span>
                  <button onClick={() => setStep(2)} className="block w-full mt-4 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-800">
                    Skip and enter manually
                  </button>
                </div>
              )}

              {documentPreview && !visionLoading && (
                <div className="p-4 bg-white border border-emerald-100 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate">Extraction Complete</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Click continue to verify data</p>
                  </div>
                  <button onClick={() => {setDocument(null); setDocumentPreview(null);}} className="text-rose-500 font-black text-[10px] uppercase">Reset</button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-0 transition-all text-sm font-bold text-slate-700"
                  placeholder="Rahul Kumar"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:bg-white focus:ring-0 transition-all text-sm font-bold text-slate-700"
                  placeholder="24"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gender: g }))}
                      className={`py-2.5 rounded-xl border text-xs font-black uppercase tracking-tighter transition-all ${
                        formData.gender === g 
                        ? 'border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-100' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-primary-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-sm font-bold text-slate-700"
                >
                  <option value="">Select District</option>
                  {[
                    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 
                    'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 
                    'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 
                    'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 
                    'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
                  ].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Residence</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Rural', 'Urban'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, residence: r }))}
                      className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        formData.residence === r 
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200'
                      }`}
                    >
                      <span className="text-sm font-black uppercase tracking-widest">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {['General', 'SC', 'ST', 'OBC', 'Minority'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, socialCategory: c }))}
                    className={`py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.socialCategory === c 
                      ? 'border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-100' 
                      : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-purple-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div 
                onClick={() => setFormData(p => ({ ...p, isBPL: !p.isBPL }))}
                className={`mt-4 p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  formData.isBPL ? 'border-purple-600 bg-purple-50' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-tight ${formData.isBPL ? 'text-purple-700' : 'text-slate-700'}`}>BPL Holder</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Socio-economic status</p>
                </div>
                <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.isBPL ? 'bg-purple-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.isBPL ? 'left-6' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Annual Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-rose-500 focus:bg-white focus:ring-0 transition-all text-sm font-bold text-slate-700"
                  placeholder="e.g. 150000"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Occupation</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Farmer', 'Student', 'Laborer', 'Unemployed', 'Entrepreneur'].map(o => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, occupation: o }))}
                      className={`py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.occupation === o 
                        ? 'border-rose-600 bg-rose-600 text-white shadow-lg shadow-rose-100' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-rose-200'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Field of Interest Filter */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  Field of Interest <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Optional</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Women', 'Farmers', 'Students', 'Healthcare', 'Housing', 'Pension'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, preferredCategory: p.preferredCategory === cat ? '' : cat }))}
                      className={`py-2 rounded-lg border text-[9px] font-black uppercase tracking-tighter transition-all ${
                        formData.preferredCategory === cat 
                        ? 'border-primary-600 bg-primary-50 text-primary-700' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-primary-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="text-[8px] text-slate-400 font-medium mt-2 italic">* Narrow down schemes by specific sector</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100"
        >
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain size={32} className="animate-pulse" />
          </div>
          <h2 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-[0.2em]">MAS Analysis</h2>
          <div className="space-y-3">
            {agentWorkflow.map((agent, i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  scale: agent.active ? 1.05 : 1,
                  backgroundColor: agent.active ? 'rgba(79, 70, 229, 0.05)' : 'rgba(248, 250, 252, 1)',
                  borderColor: agent.active ? 'rgba(79, 70, 229, 0.2)' : 'rgba(241, 245, 249, 1)'
                }}
                className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-300"
              >
                <div className={`${agent.active ? 'text-primary-600' : 'text-slate-300'}`}>
                  {agent.agent === 'Vision Agent' ? <Eye size={16} /> : agent.agent === 'Reasoning Agent' ? <Brain size={16} /> : <Languages size={16} />}
                </div>
                <div className="text-left flex-1">
                  <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${agent.active ? 'text-primary-600' : 'text-slate-400'}`}>{agent.agent}</p>
                  <p className={`text-[10px] font-bold leading-tight ${agent.active ? 'text-slate-900' : 'text-slate-500'}`}>{agent.status}</p>
                </div>
                {agent.active && <Loader className="animate-spin text-primary-600" size={12} />}
                {!agent.active && agent.status !== 'Pending' && <CheckCircle2 size={12} className="text-emerald-500" />}
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="bg-primary-600 h-full"
                ></motion.div>
            </div>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2">Processing Protocols</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar */}
          <div className="md:w-80 bg-slate-900 p-10 text-white hidden md:flex flex-col">
            <div className="mb-12">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-primary-400">Samarth</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">E-Governance MAS</p>
            </div>
            
            <div className="flex-1 flex flex-col gap-8 justify-center">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = step === idx + 1;
                const isCompleted = step > idx + 1;
                return (
                  <div key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive ? `${s.color} scale-110 shadow-lg shadow-primary-900/50 ring-4 ring-white/10` : isCompleted ? 'bg-emerald-500 shadow-lg shadow-emerald-900/20' : 'bg-slate-800 opacity-40'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-primary-400' : 'text-slate-600'}`}>Step {idx + 1}</span>
                      <span className={`text-sm font-bold tracking-tight transition-colors ${isActive ? 'text-white' : 'text-slate-500'}`}>{s.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-slate-800">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Secure Local Environment
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="flex-1 bg-white p-12 md:p-14 flex flex-col">
            {/* Top Section */}
            <div className="mb-10 flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{steps[step-1].title}</h2>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-primary-600 rounded-full"></div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hybrid Symbolic-Generative MAS</p>
                </div>
              </div>
              {step > 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-4 py-2 bg-primary-50 text-primary-600 text-[9px] font-black uppercase tracking-widest rounded-xl border border-primary-100 flex items-center gap-2 shadow-sm"
                >
                  <Sparkles size={12} className="animate-pulse" /> Smart Autofill Active
                </motion.div>
              )}
            </div>

            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 text-rose-600 shadow-sm"
                >
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Validation Error</p>
                    <p className="text-sm font-bold leading-relaxed">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Middle Section: Form/Upload Area */}
            <div className="flex-grow flex flex-col items-center justify-center w-full py-8">
              <form onSubmit={handleSubmit} className="w-full flex flex-col h-full">
                <div className="flex-grow flex flex-col items-center justify-center max-w-md mx-auto w-full">
                  <div className="w-full">
                    {renderStep()}
                  </div>
                </div>

                {/* Bottom Section: Navigation */}
                <div className="mt-auto pt-10 flex justify-between items-center border-t border-slate-50">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1 || loading || visionLoading}
                    className="flex items-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all active:scale-95 group"
                  >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                  
                  {step < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={visionLoading}
                      className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-95 disabled:opacity-50 group"
                    >
                      {step === 1 && document ? 'Verify Profile' : 'Continue'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-3 px-12 py-5 bg-primary-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-2xl shadow-primary-100 active:scale-95 group"
                    >
                      Analyze Eligibility <Brain size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeFinderWizard;
