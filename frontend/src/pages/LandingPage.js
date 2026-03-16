import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, List, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Samarth: Empowering Jharkhand Citizens
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Identify and apply for government schemes you are eligible for. 
              Our AI-powered system helps you navigate the benefits provided by the Government of Jharkhand.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/finder"
                className="rounded-md bg-primary-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 flex items-center gap-2"
              >
                <Search size={20} /> Find My Schemes
              </Link>
              <Link
                to="/chat"
                className="text-lg font-semibold leading-6 text-gray-900 flex items-center gap-2"
              >
                Ask AI Assistant <MessageSquare size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalized Matching</h3>
              <p className="text-gray-600">Answer a few questions and get schemes tailored to your profile.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Explanations</h3>
              <p className="text-gray-600">Get simple, easy-to-understand explanations for complex government rules.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                <List size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Comprehensive Explorer</h3>
              <p className="text-gray-600">Browse all 50+ Jharkhand government schemes by department and category.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link to="/explorer" className="inline-flex items-center text-primary-600 font-semibold hover:underline">
              Explore All Schemes <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
