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
  ArrowLeft,
  IndianRupee,
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
    landHolding: 'None'
  });

  const steps = [
    { title: 'Smart Start', icon: Sparkles, color: 'bg-indigo-500' },
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
              <div className={`p-8 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all ${visionLoading ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200 hover:border-indigo-400'}`}>
                {visionLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 animate-pulse">
                      <Eye size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Vision Agent Active</p>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Reading document...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Aadhaar or Certificate</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">JPG, PNG supported</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="smart-upload" />
                    <label htmlFor="smart-upload" className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      Select Document
                    </label>
                  </>
                )}
              </div>
              
              {!visionLoading && (
                <div className="text-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Or</span>
                  <button onClick={() => setStep(2)} className="block w-full mt-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800">
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
                  {['Ranchi', 'Dhanbad', 'Jamshedpur', 'Bokaro', 'Deoghar'].map(d => <option key={d} value={d}>{d}</option>)}
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xs w-full bg-white rounded-[2rem] shadow-2xl p-8 text-center border border-slate-100"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <span className="text-3xl font-black">स</span>
          </div>
          <h2 className="text-xs font-black text-slate-900 mb-6 uppercase tracking-[0.3em]">MAS Analysis</h2>
          <div className="space-y-3">
            {agentWorkflow.map((agent, i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  scale: agent.active ? 1.05 : 1,
                  backgroundColor: agent.active ? 'rgba(16, 185, 129, 0.05)' : 'rgba(248, 250, 252, 1)',
                  borderColor: agent.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(241, 245, 249, 1)'
                }}
                className="flex items-center gap-3 p-4 rounded-xl border transition-all duration-300"
              >
                <div className={`${agent.active ? 'text-emerald-600' : 'text-slate-300'}`}>
                  {agent.agent === 'Vision Agent' ? <Eye size={16} /> : agent.agent === 'Reasoning Agent' ? <Brain size={16} /> : <Languages size={16} />}
                </div>
                <div className="text-left flex-1">
                  <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1 ${agent.active ? 'text-emerald-600' : 'text-slate-400'}`}>{agent.agent}</p>
                  <p className={`text-[10px] font-bold leading-tight ${agent.active ? 'text-slate-900' : 'text-slate-500'}`}>{agent.status}</p>
                </div>
                {agent.active && <Loader className="animate-spin text-emerald-600" size={12} />}
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
                    className="bg-emerald-600 h-full"
                ></motion.div>
            </div>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-2">Processing Protocols</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-80 bg-emerald-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 opacity-10 rotate-12">
               <span className="text-[200px] font-black">स</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                  <span className="text-xl font-black">स</span>
                </div>
                <span className="text-xl font-black tracking-tight">Samarth</span>
              </div>
              <div className="space-y-8">
                {[
                  { step: 1, label: 'Smart Start', icon: Sparkles },
                  { step: 2, label: 'Verify Profile', icon: User },
                  { step: 3, label: 'Location & Region', icon: MapPin },
                  { step: 4, label: 'Economic Status', icon: IndianRupee },
                  { step: 5, label: 'MAS Finalize', icon: CheckCircle2 }
                ].map((s) => (
                  <div key={s.step} className={`flex items-center gap-4 transition-all ${step === s.step ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${step === s.step ? 'bg-white text-emerald-600 border-white' : 'border-white/30'}`}>
                      {s.step}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 pt-12 border-t border-white/10">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                Your data is processed locally using Jharkhand's Hybrid Symbolic-AI engine.
              </p>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1 p-10 md:p-16">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                {step === 1 ? 'Namaskar!' : 'Tell us more'}
              </h2>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Step {step} of 5</p>
            </div>

            <form onSubmit={step === 5 ? handleSubmit : (e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="min-h-[300px]"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                ) : <div></div>}
                
                <button
                  type="button"
                  onClick={step === 5 ? handleSubmit : () => validateStep() && setStep(step + 1)}
                  className="flex items-center gap-3 px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
                >
                  {step === 5 ? 'Begin MAS Analysis' : 'Next Step'} <ChevronRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeFinderWizard;
