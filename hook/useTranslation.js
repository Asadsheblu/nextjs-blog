// hooks/useTranslation.js
import { useState } from 'react';

const translations = {
  en: {
    youtubeTool: "YouTube Tool",
    description: "Enhance your YouTube experience with our comprehensive suite of tools designed for creators and viewers alike. Extract video summaries, titles, descriptions, and more. Boost your channel's performance with advanced features and insights",
    welcome: "Welcome"
  },
  fr: {
    youtubeTool: "Outil YouTube",
    description: "Améliorez votre expérience YouTube avec notre suite complète d'outils conçus pour les créateurs et les spectateurs. Extrayez des résumés de vidéos, des titres, des descriptions, et plus encore. Boostez les performances de votre chaîne avec des fonctionnalités et des informations avancées",
    welcome: "Bienvenue"
  },
  // Add more languages as needed
};

const useTranslation = () => {
  const [locale, setLocale] = useState('en'); // Default to English

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return { t, setLocale };
};

export default useTranslation;
