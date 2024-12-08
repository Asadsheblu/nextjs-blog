import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorBio = ({ authorName }) => {
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    if (authorName) {
      fetchAuthorData(authorName);
    }
  }, [authorName]);

  const fetchAuthorData = async (name) => {
    try {
      const response = await axios.get(`/api/authors?name=${name}`);
      console.log(response);
      
      setAuthor(response.data);
    } catch (error) {
      console.error('Error fetching author data:', error.message);
    }
  };

  if (!author) return null;

  return (
    <div className="flex items-center w-100 p-4 border rounded-lg shadow-md bg-white">
      <div className="flex-shrink-0 mr-4">
        <img src={author.image} alt={author.name} className="w-40 h-40 rounded-full" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">
          Article by <span className="text-green-500">{author.name}</span>
        </h3>
        <p className="text-gray-600">{author.bio}</p>
        <div className="flex space-x-2 mt-2">
          {author.socialLinks.facebook && (
            <a href={author.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook.png" alt="Facebook" className="w-6 h-6" />
            </a>
          )}
          {author.socialLinks.twitter && (
            <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              <img src="/icons/twitter.png" alt="Twitter" className="w-6 h-6" />
            </a>
          )}
          {author.socialLinks.linkedin && (
            <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
              <img src="/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
