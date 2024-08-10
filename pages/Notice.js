import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

function Notice() {
  const [quillContent, setQuillContent] = useState('');
  const [existingContent, setExistingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/notice');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setQuillContent(data?.content || '');
        setExistingContent(data?.content || '');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h1 className="text-2xl font-bold text-center mb-4 text-orange-500">Notice</h1>
            <div dangerouslySetInnerHTML={{ __html: existingContent }} className="prose mb-4"></div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <button
              onClick={handleClose}
              className="w-full bg-black text-white py-2 rounded-md font-semibold"
            >
              Okay, I understand
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Notice;
