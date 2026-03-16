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
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Upload,
  Eye,
  Brain,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SchemeFinderWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    { title: 'Personal', icon: User, color: 'bg-blue-500' },
    { title: 'Verify', icon: Upload, color: 'bg-indigo-500' },
    { title: 'Region', icon: MapPin, color: 'bg-emerald-500' },
    { title: 'Social', icon: Users, color: 'bg-purple-500' },
    { title: 'Status', icon: Briefcase, color: 'bg-orange-500' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocument(file);
      setDocumentPreview(URL.createObjectURL(file));
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
      case 1:
        if (!formData.name || !formData.age || !formData.gender) {
          setError('Please fill in all personal details.');
          return false;
        }
        return true;
      case 3:
        if (!formData.district) {
          setError('Please select your district.');
          return false;
        }
        return true;
      case 4:
        if (!formData.socialCategory) {
          setError('Please select your social category.');
          return false;
        }
        return true;
      case 5:
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
    setAgentWorkflow([
        { agent: 'Vision Agent', status: document ? 'Scanning document...' : 'Skipped' },
        { agent: 'Reasoning Agent', status: 'Pending...' },
        { agent: 'Translation Agent', status: 'Pending...' }
    ]);

    try {
      const data = new FormData();
      if (document) data.append('document', document);
      data.append('userData', JSON.stringify(formData));

      const response = await api.post('/recommendations', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setAgentWorkflow(response.data.agentWorkflow || []);
      
      setTimeout(() => {
        navigate('/results', { state: { results: response.data } });
      }, 1200);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('System Error. Check Ollama LLaVA/Llama3 models.');
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

          {step === 2 && (
            <div className="space-y-4">
              <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 transition-all">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">AI Vision Scanner</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Aadhaar / Caste / Income</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="doc-upload" />
                <label htmlFor="doc-upload" className="px-5 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg cursor-pointer hover:bg-indigo-700 transition-all">
                  Upload
                </label>
              </div>
              {documentPreview && (
                <div className="p-3 bg-white border border-indigo-100 rounded-xl flex items-center gap-3">
                  <img src={documentPreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate">{document.name}</p>
                    <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest">Document Staged</p>
                  </div>
                  <button onClick={() => {setDocument(null); setDocumentPreview(null);}} className="text-rose-500 font-black text-[10px] uppercase">Remove</button>
                </div>
              )}
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xs w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain size={32} className="animate-pulse" />
          </div>
          <h2 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Multi-Agent Workflow</h2>
          <div className="space-y-3">
            {agentWorkflow.map((agent, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-primary-600">{agent.agent === 'Vision Agent' ? <Eye size={16} /> : agent.agent === 'Reasoning Agent' ? <Brain size={16} /> : <Languages size={16} />}</div>
                <div className="text-left flex-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{agent.agent}</p>
                  <p className="text-[10px] font-bold text-slate-700 leading-tight">{agent.status}</p>
                </div>
                {agent.status.includes('...') && <Loader className="animate-spin text-slate-300" size={12} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-64 bg-slate-900 p-8 text-white hidden md:block">
            <h2 className="text-xl font-black mb-10 tracking-tighter uppercase text-primary-400">Samarth</h2>
            <div className="space-y-6">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = step === idx + 1;
                const isCompleted = step > idx + 1;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? `${s.color} scale-110 shadow-lg` : isCompleted ? 'bg-primary-600' : 'bg-slate-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                    </div>
                    <div className="flex flex-col leading-none">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-primary-400' : 'text-slate-500'}`}>Step {idx + 1}</span>
                      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{s.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1 p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-1">{steps[step-1].title}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Multimodal Agent Analysis System</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 font-bold text-[10px] uppercase tracking-wider">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="min-h-[220px]">{renderStep()}</div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1 || loading}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={16} className="inline mr-1" /> Back
                </button>
                
                {step < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
                  >
                    Continue <ChevronRight size={16} className="inline ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-10 py-4 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-xl shadow-primary-100"
                  >
                    Start Analysis <Brain size={16} className="inline ml-2" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeFinderWizard;
