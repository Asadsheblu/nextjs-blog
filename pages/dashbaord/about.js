import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from './layout';

// Dynamically import the QuillWrapper component with SSR disabled
const QuillWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

function About() {
  const [quillContent, setQuillContent] = useState('');
  const [existingContent, setExistingContent] = useState('');
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en'); // Default language

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/about?lang=${language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setQuillContent(data?.content || '');
        setExistingContent(data?.content || '');
      } catch (error) {
        console.error('Error fetching content:', error.message);
        setError(error.message);
      }
    };

    fetchContent();
  }, [language]); // Refetch content when language changes

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: quillContent, language }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to post content: ${errorMessage}`);
      }

      // Handle success
      setError(null);
      setExistingContent(quillContent);
    } catch (error) {
      console.error('Error posting content:', error.message);
      setError(error.message);
    }
  }, [quillContent, language]);

  const handleQuillChange = useCallback((newContent) => {
    setQuillContent(newContent);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">Content Add For About Us Page</h2>
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Select Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block w-28 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="zh-HANT">中国传统的</option>
            <option value="zh-HANS">简体中文</option>
            <option value="nl">Nederlands</option>
            <option value="gu">ગુજરાતી</option>
            <option value="hi">हिंदी</option>
            <option value="it">Italiano</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="pl">Polski</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <QuillWrapper initialContent={quillContent} onChange={handleQuillChange} />
        <button
          className="btn btn-primary p-2 mt-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit Content
        </button>
        
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">About Us Content</h2>
          <div dangerouslySetInnerHTML={{ __html: existingContent }} className="prose"></div>
        </div>
      </div>
    </Layout>
  );
}

export default About;
