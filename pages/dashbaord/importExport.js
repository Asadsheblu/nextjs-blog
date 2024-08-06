import { useState } from 'react';
import Layout from './layout';

export default function Home() {
  const [collectionName, setCollectionName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('collectionName', collectionName);
    formData.append('file', file);
    formData.append('language', language);

    try {
      const response = await fetch('/api/upload-content', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      } else {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleExport = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collectionName }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${collectionName}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Upload and Export Content</h1>
          <form onSubmit={handleImport} className="mb-4">
            <div className="mb-4">
              <label htmlFor="collectionName" className="block text-gray-700 font-bold mb-2">Collection Name</label>
              <select
                id="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a collection</option>
                <option value="about">About</option>
                <option value="blogs">Blogs</option>
                <option value="notice">Notice</option>
                <option value="content">Content</option>
                <option value="terms">Terms</option>
                <option value="privacy">Privacy</option>
                <option value="reviews">Reviews</option>
                <option value="comments">Comments</option>
                <option value="user">User</option>
                <option value="ytApi">Youtube Api</option>
                <option value="openaiKey">Openai Key</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="language" className="block text-gray-700 font-bold mb-2">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a language</option>
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
            <div className="mb-4">
              <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Upload JSON File</label>
              <input
                type="file"
                id="file"
                accept=".json"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Upload Content</button>
          </form>
          <form onSubmit={handleExport}>
            <div className="mb-4">
              <label htmlFor="collectionNameExport" className="block text-gray-700 font-bold mb-2">Collection Name</label>
              <select
                id="collectionNameExport"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a collection</option>
                <option value="about">About</option>
                <option value="blogs">Blogs</option>
                <option value="notice">Notice</option>
                <option value="content">Content</option>
                <option value="terms">Terms</option>
                <option value="privacy">Privacy</option>
                <option value="reviews">Reviews</option>
                <option value="comments">Comments</option>
                <option value="user">User</option>
                <option value="ytApi">Youtube Api</option>
                <option value="openaiKey">Openai Key</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">Export Content</button>
          </form>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    </Layout>
  );
}
