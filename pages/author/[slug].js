import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const AuthorPosts = () => {
  const router = useRouter();
  const { slug, role } = router.query; // 'slug' and 'role' come from the dynamic route

  // Convert slug to name
  const name = slug ? convertSlugToName(slug) : '';
  const [posts, setPosts] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostsAndAuthorInfo = async () => {
    try {
      const capitalizedRole = capitalizeFirstLetter(role); // Capitalize role
  
      console.log(`Fetching author with name: ${name} and role: ${capitalizedRole}`);
      
      const authorResponse = await axios.get(`/api/authors`, {
        params: {
          name: name,
          role: capitalizedRole,
        },
      });
  
      // Check if the response is as expected
      console.log('Author API Response:', authorResponse.data);
  
      if (authorResponse.status === 200 && authorResponse.data.length > 0) {
        setAuthorInfo(authorResponse.data[0]);
  console.log(authorInfo);
  
        if (capitalizedRole === 'author') {
          const postsResponse = await axios.get(`/api/blogs`, {
            params: {
              role: capitalizedRole,
              name: name,
            },
          });
  console.log(postsResponse);
  
          if (postsResponse.status === 200) {
            setPosts(postsResponse.data);
          } else {
            setError('Failed to fetch posts');
          }
        }
      } else {
        setError('Author not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (name && role) {
      fetchPostsAndAuthorInfo();
    }
  }, [name, role]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-5">
      {authorInfo && (
        <div className="mb-8 flex items-center space-x-4">
          {authorInfo.image && (
            <img
              src={authorInfo.image}
              alt={authorInfo.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{authorInfo.name}</h2>
            <p className="text-gray-600">{authorInfo.bio}</p>
            <div className="flex space-x-4 mt-2">
              {authorInfo.socialLinks?.facebook && (
                <a href={authorInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={24} />
                </a>
              )}
              {authorInfo.socialLinks?.twitter && (
                <a href={authorInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter size={24} />
                </a>
              )}
              {authorInfo.socialLinks?.linkedin && (
                <a href={authorInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={24} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {role === 'Author' && posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post._id} className="mb-6">
              <h2 className="text-xl font-semibold">{post.translations?.en?.title || post.title}</h2>
              <p>{post.translations?.en?.description || post.description}</p>
              <a href={`/posts/${post.translations?.en?.slug || post.slug}`} className="text-blue-500 hover:underline">
                Read more
              </a>
            </li>
          ))}
        </ul>
      ) : role === 'Author' ? (
        <p>No posts found for this author.</p>
      ) : null}
    </div>
  );
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const convertSlugToName = (slug) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default AuthorPosts;
