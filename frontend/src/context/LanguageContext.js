import React, { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const languages = {
  en: {
    label: 'English',
    nativeLabel: 'English',
    code: 'en'
  },
  hi: {
    label: 'Hindi',
    nativeLabel: 'हिंदी',
    code: 'hi'
  },
  hinglish: {
    label: 'Hinglish',
    nativeLabel: 'Hinglish',
    code: 'hinglish'
  }
};

const translations = {
  en: {
    nav_home: 'Home',
    nav_finder: 'Find Schemes',
    nav_explorer: 'Explorer',
    nav_chat: 'AI Assistant',
    hero_title: 'Empowering Jharkhand',
    hero_subtitle: 'Smart e-governance for every citizen.',
    find_btn: 'Find My Schemes',
    explore_btn: 'Explore All',
    footer_tagline: 'Hybrid Symbolic-Generative Multi-Agent System for Jharkhand.',
    chat_initial: 'Hello! I am **Samarth**, your Jharkhand Government Scheme assistant. How can I help you today?',
    chat_clear_confirm: 'Are you sure you want to clear the conversation?',
    wizard_step_1: 'Smart Start',
    wizard_step_2: 'Personal',
    wizard_step_3: 'Region',
    wizard_step_4: 'Social',
    wizard_step_5: 'Status',
    explorer_title: 'Policy Explorer',
    explorer_subtitle: 'Discover Jharkhand Initiatives',
    explorer_search_placeholder: 'Search by keyword...',
    back_to_home: 'Back to Home',
    details: 'Details',
    cat_all: 'All',
    cat_students: 'Students',
    cat_farmers: 'Farmers',
    cat_women: 'Women',
    cat_entrepreneurs: 'Entrepreneurs',
    cat_housing: 'Housing',
    cat_healthcare: 'Healthcare',
    cat_pension: 'Pension',
    cat_employment: 'Employment'
  },
  hi: {
    nav_home: 'होम',
    nav_finder: 'योजनाएं खोजें',
    nav_explorer: 'एक्सप्लोरर',
    nav_chat: 'AI सहायक',
    hero_title: 'झारखंड को सशक्त बनाना',
    hero_subtitle: 'हर नागरिक के लिए स्मार्ट ई-गवर्नेंस।',
    find_btn: 'मेरी योजनाएं खोजें',
    explore_btn: 'सभी देखें',
    footer_tagline: 'झारखंड के लिए हाइब्रिड सिम्बोलिक-जेनरेटिव मल्टी-एजेंट सिस्टम।',
    chat_initial: 'नमस्ते! मैं **समर्थ** हूँ, आपका झारखंड सरकारी योजना सहायक। मैं आज आपकी क्या मदद कर सकता हूँ?',
    chat_clear_confirm: 'क्या आप बातचीत मिटाना चाहते हैं?',
    wizard_step_1: 'स्मार्ट स्टार्ट',
    wizard_step_2: 'व्यक्तिगत',
    wizard_step_3: 'क्षेत्र',
    wizard_step_4: 'सामाजिक',
    wizard_step_5: 'स्थिति',
    explorer_title: 'योजना एक्सप्लोरर',
    explorer_subtitle: 'झारखंड की पहल देखें',
    explorer_search_placeholder: 'कीवर्ड द्वारा खोजें...',
    back_to_home: 'होम पर वापस जाएं',
    details: 'विवरण',
    cat_all: 'सभी',
    cat_students: 'छात्र',
    cat_farmers: 'किसान',
    cat_women: 'महिलाएं',
    cat_entrepreneurs: 'उद्यमी',
    cat_housing: 'आवास',
    cat_healthcare: 'स्वास्थ्य सेवा',
    cat_pension: 'पेंशन',
    cat_employment: 'रोजगार'
  },
  hinglish: {
    nav_home: 'Home',
    nav_finder: 'Schemes Dhundhein',
    nav_explorer: 'Explorer',
    nav_chat: 'AI Assistant',
    hero_title: 'Jharkhand ko Empower karna',
    hero_subtitle: 'Har citizen ke liye smart e-governance.',
    find_btn: 'Meri Schemes Dhundhein',
    explore_btn: 'Sab Dekhein',
    footer_tagline: 'Jharkhand ke liye Hybrid Symbolic-Generative Multi-Agent System.',
    chat_initial: 'Namaste! Main **Samarth** hoon, aapka Jharkhand Government Scheme assistant. Main aaj aapki kya madad kar sakta hoon?',
    chat_clear_confirm: 'Kya aap conversation clear karna chahte hain?',
    wizard_step_1: 'Smart Start',
    wizard_step_2: 'Personal',
    wizard_step_3: 'Region',
    wizard_step_4: 'Social',
    wizard_step_5: 'Status',
    explorer_title: 'Policy Explorer',
    explorer_subtitle: 'Jharkhand ki Initiatives Dekhein',
    explorer_search_placeholder: 'Keyword se search karein...',
    back_to_home: 'Home par wapas',
    details: 'Details',
    cat_all: 'Sabhi',
    cat_students: 'Students',
    cat_farmers: 'Farmers',
    cat_women: 'Women',
    cat_entrepreneurs: 'Entrepreneurs',
    cat_housing: 'Housing',
    cat_healthcare: 'Healthcare',
    cat_pension: 'Pension',
    cat_employment: 'Employment'
  }
};

export const LanguageProvider = ({ children }) => {
  const [userLanguage, setUserLanguage] = useState(() => {
    return localStorage.getItem('userLanguage') || 'en';
  });

  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('userLanguage');
  });

  useEffect(() => {
    localStorage.setItem('userLanguage', userLanguage);
  }, [userLanguage]);

  const changeLanguage = (langCode) => {
    setUserLanguage(langCode);
    setIsFirstVisit(false);
  };

  const t = (key) => {
    return translations[userLanguage][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ userLanguage, changeLanguage, isFirstVisit, setIsFirstVisit, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
