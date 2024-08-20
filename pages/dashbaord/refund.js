import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from './layout';

// Dynamically import the QuillWrapper component with SSR disabled
const QuillWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

function Refund() {
  const [quillContent, setQuillContent] = useState('');
  const [existingContent, setExistingContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/Refund');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        console.log("Fetched Data:", data); // Add debugging
        setQuillContent(data?.content || ''); // Ensure content is not undefined
        setExistingContent(data?.content || ''); // Ensure existing content is not undefined
      } catch (error) {
        console.error('Error fetching content:', error.message);
        setError(error.message);
      }
    };

    fetchContent();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      console.log("Submitting Data:", quillContent); // Add debugging
      const response = await fetch('/api/Refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: quillContent }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to post content: ${errorMessage}`);
      }

      // Handle success
      console.log('Content posted successfully');
      setError(null);
      setExistingContent(quillContent); // Update the displayed existing content
    } catch (error) {
      console.error('Error posting content:', error.message);
      setError(error.message);
    }
  }, [quillContent]);

  const handleQuillChange = useCallback((newContent) => {
    setQuillContent(newContent);
  }, []);

  return (
    <Layout>
      <div className='container p-5'>
        <h2>Content Add For Refund & Policy</h2>
        {error && <div className="text-red-500">Error: {error}</div>}
        <QuillWrapper initialContent={quillContent} onChange={handleQuillChange} />
        <button className='btn btn-primary p-2 mt-3' onClick={handleSubmit}>Submit Content</button>
        
        <div className='mt-10'>
          <h2>Refund & Policy</h2>
          <div dangerouslySetInnerHTML={{ __html: existingContent }}></div>
        </div>
      </div>
    </Layout>
  );
}

export default Refund;