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

  return (
    <LanguageContext.Provider value={{ userLanguage, changeLanguage, isFirstVisit, setIsFirstVisit }}>
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
