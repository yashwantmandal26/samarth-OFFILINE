import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { schemeService } from '../services/api';
import { 
  ChevronLeft, ExternalLink, FileText, CheckCircle, 
  Clock, CreditCard, Info, MapPin, Sparkles, BookOpen, AlertCircle, Award
} from 'lucide-react';

const SchemeDetailPage = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const response = await schemeService.getSchemeById(id);
        setScheme(response.data);
      } catch (error) {
        console.error('Error fetching scheme:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!scheme) return <div className="min-h-screen flex items-center justify-center">Scheme not found</div>;

  const DetailSection = ({ title, icon: Icon, children, colorClass = "text-primary-600" }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-gray-50 ${colorClass}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link to="/results" className="inline-flex items-center text-primary-600 font-semibold mb-8 hover:underline">
          <ChevronLeft size={20} className="mr-1" /> Back to Recommendations
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-100">
          <div className="p-10 border-b border-gray-100">
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-primary-100 text-primary-800 uppercase tracking-wide">
                {scheme.category}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
                {scheme.department}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              {scheme.scheme_name}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed italic">
              {scheme.description}
            </p>
          </div>
          <div className="bg-primary-600 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-white">
              <p className="text-primary-100 font-medium mb-1">Ready to apply?</p>
              <h4 className="text-2xl font-bold">Apply on Official Portal</h4>
            </div>
            <a 
              href={scheme.official_portal} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-white text-primary-600 rounded-xl font-extrabold text-lg hover:bg-primary-50 transition-colors shadow-lg"
            >
              Go to Portal <ExternalLink size={24} className="ml-3" />
            </a>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 gap-0">
          <DetailSection title="Key Benefits" icon={Award}>
            <ul className="list-disc pl-5 space-y-3">
              {Array.isArray(scheme.benefits) ? scheme.benefits.map((b, i) => <li key={i}>{b}</li>) : <li>{scheme.benefits}</li>}
            </ul>
          </DetailSection>

          <DetailSection title="Eligibility Criteria" icon={CheckCircle}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
              {Object.entries(scheme.eligibility).map(([key, value]) => (
                <div key={key}>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{key.replace('_', ' ')}</h4>
                  <p className="text-gray-900 font-semibold">{Array.isArray(value) ? value.join(', ') : value.toString()}</p>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Documents Required" icon={FileText}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scheme.documents_required.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <span className="font-medium text-gray-800">{doc}</span>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="How to Apply" icon={MapPin}>
            <div className="p-6 bg-orange-50 rounded-xl border border-orange-100 text-orange-900 font-medium">
              {scheme.application_process}
            </div>
          </DetailSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="text-primary-600" size={24} />
                <h3 className="font-bold text-lg">Fees</h3>
              </div>
              <p className="text-gray-700 font-semibold text-xl">{scheme.fees}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-primary-600" size={24} />
                <h3 className="font-bold text-lg">Processing Time</h3>
              </div>
              <p className="text-gray-700 font-semibold text-xl">{scheme.processing_time}</p>
            </div>
          </div>

          <DetailSection title="Important Notes" icon={Info}>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <AlertCircle className="text-yellow-600 shrink-0" size={24} />
                <p className="text-yellow-800 text-sm">Always ensure your Aadhar is linked with your bank account for DBT (Direct Benefit Transfer) schemes.</p>
              </div>
              <p className="text-gray-600 text-sm">For further assistance, visit your nearest Pragya Kendra (CSC) or Block Office.</p>
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailPage;
