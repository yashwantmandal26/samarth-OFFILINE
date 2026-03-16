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
  FileText,
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
    { title: 'Documents', icon: Upload, color: 'bg-indigo-500' },
    { title: 'Location', icon: MapPin, color: 'bg-emerald-500' },
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
      case 2:
        return true; // Document is optional
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
        { agent: 'Vision Agent', status: document ? 'Scanning document...' : 'Skipped (no document)' },
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
      
      // Delay slightly for UX to show completion
      setTimeout(() => {
        navigate('/results', { state: { results: response.data } });
      }, 1500);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Something went wrong. Ensure Ollama is running LLaVA and Llama3 models.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    const variants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {step === 1 && (
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 transition-all text-lg font-medium"
                  placeholder="e.g. Rahul Kumar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary-500 focus:bg-white focus:ring-0 transition-all text-lg font-medium"
                  placeholder="How old are you?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Male', 'Female', 'Transgender'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, gender: g }))}
                      className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                        formData.gender === g 
                        ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-primary-200'
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
            <div className="space-y-6">
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center justify-center gap-4 hover:border-indigo-400 transition-all">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-gray-900">Upload Aadhaar or Certificate</h4>
                  <p className="text-sm text-gray-500">AI will automatically extract your details</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="doc-upload"
                />
                <label
                  htmlFor="doc-upload"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer hover:bg-indigo-700 transition-all"
                >
                  Choose Image
                </label>
              </div>
              {documentPreview && (
                <div className="mt-4 p-4 bg-white border-2 border-indigo-100 rounded-2xl flex items-center gap-4">
                  <img src={documentPreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{document.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Ready for AI Vision</p>
                  </div>
                  <button onClick={() => {setDocument(null); setDocumentPreview(null);}} className="text-rose-500 font-bold text-sm">Remove</button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">District</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all text-lg font-medium"
                >
                  <option value="">Select your district</option>
                  {['Ranchi', 'Dhanbad', 'Jamshedpur', 'Bokaro', 'Deoghar', 'Hazaribagh'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Residence Area</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Rural', 'Urban'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, residence: r }))}
                      className={`p-5 rounded-2xl border-2 font-bold flex flex-col items-center gap-2 transition-all ${
                        formData.residence === r 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-200'
                      }`}
                    >
                      <span className="text-2xl">{r === 'Rural' ? '🏡' : '🏢'}</span>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Social Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {['General', 'SC', 'ST', 'OBC', 'Minority'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, socialCategory: c }))}
                      className={`p-4 rounded-2xl border-2 font-bold transition-all ${
                        formData.socialCategory === c 
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-purple-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div 
                onClick={() => setFormData(p => ({ ...p, isBPL: !p.isBPL }))}
                className={`mt-6 p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  formData.isBPL 
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div>
                  <h4 className={`font-bold ${formData.isBPL ? 'text-purple-700' : 'text-gray-700'}`}>BPL Status</h4>
                  <p className="text-sm text-gray-500 font-medium">Do you have a BPL card?</p>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isBPL ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isBPL ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Annual Family Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-rose-500 focus:bg-white focus:ring-0 transition-all text-lg font-medium"
                  placeholder="e.g. 75000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Current Occupation</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Farmer', 'Student', 'Laborer', 'Unemployed', 'Entrepreneur'].map(o => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, occupation: o }))}
                      className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                        formData.occupation === o 
                        ? 'border-rose-600 bg-rose-50 text-rose-700 shadow-sm' 
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-rose-200'
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Brain size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tighter">MAS in Action</h2>
          
          <div className="space-y-4 text-left">
            {agentWorkflow.map((agent, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-primary-600">
                  {agent.agent === 'Vision Agent' ? <Eye size={18} /> : 
                   agent.agent === 'Reasoning Agent' ? <Brain size={18} /> : <Languages size={18} />}
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{agent.agent}</p>
                  <p className="text-sm font-bold text-gray-700">{agent.status}</p>
                </div>
                {agent.status.includes('...') && <Loader className="animate-spin ml-auto text-primary-400" size={16} />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-72 bg-gray-900 p-8 text-white hidden md:block">
              <h2 className="text-2xl font-black mb-10 tracking-tighter uppercase text-primary-400">Samarth</h2>
              <div className="space-y-8">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step === idx + 1;
                  const isCompleted = step > idx + 1;
                  return (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isActive ? `${s.color} scale-110 shadow-lg` : isCompleted ? 'bg-primary-600' : 'bg-gray-800'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary-400' : 'text-gray-500'}`}>
                          Step {idx + 1}
                        </span>
                        <span className={`font-bold tracking-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {s.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 md:p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{steps[step-1].title} Details</h2>
                <p className="text-gray-500 font-medium">Multimodal AI is ready to help you.</p>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 font-bold text-sm">
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {renderStep()}

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={step === 1 || loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft size={20} /> Back
                  </button>
                  
                  {step < steps.length ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-xl"
                    >
                      Continue <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-12 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 transition-all active:scale-95 shadow-xl shadow-primary-100"
                    >
                      Start Analysis <Brain size={20} />
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
