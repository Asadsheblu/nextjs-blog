// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';
// import { FaFacebook, FaTwitter, FaLinkedin, FaUserCircle, FaCalendar } from 'react-icons/fa';
// import { format } from 'date-fns';
// import Link from 'next/link';
// import Image from 'next/image'; // Import Image from next/image

// const AuthorPosts = () => {
//   const router = useRouter();
//   const { slug, role } = router.query; // 'slug' and 'role' come from the dynamic route

//   // Convert slug to name
//   const name = slug ? convertSlugToName(slug) : '';
//   const [posts, setPosts] = useState([]);
//   const [authorInfo, setAuthorInfo] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchPostsAndAuthorInfo = async () => {
//     try {
//       const capitalizedRole = capitalizeFirstLetter(role); // Capitalize role
      
//       // Fetch author information
//       const authorResponse = await axios.get(`/api/authors`, {
//         params: {
//           name: name,
//           role: capitalizedRole,
//         },
//       });

//       if (authorResponse.status === 200 && authorResponse.data.length > 0) {
//         setAuthorInfo(authorResponse.data[0]);

//         const postsResponse = await axios.get(`/api/blogs`, {
//           params: {
//             author: name,
//           },
//         });

//         if (postsResponse.status === 200) {
//           // Filter posts by the current language
//           const filteredPosts = postsResponse.data.filter(post => {
//             const postTranslation = post.translations[currentLanguage];
//             return postTranslation && post.author === name;
//           });
          
//         } else {
//           setError('Failed to fetch posts');
//         }
//       } else {
//         setError('Author not found');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error.message);
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (name && role) {
//       fetchPostsAndAuthorInfo();
//     }
//   }, [name, role]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p className="text-red-500">{error}</p>;
//   }

//   return (
//     <div className="max-w-7xl container mx-auto mt-5 mb-5">
//       <div className="border shadow-sm bg-white mx-auto mt-5 mb-5 p-5">
//         {authorInfo && (
//           <div className="mb-8 flex items-center space-x-4">
//             {authorInfo.image && (
//               <img
//                 src={authorInfo.image}
//                 alt={authorInfo.name}
//                 className="w-24 h-24 rounded-full object-cover"
//               />
//             )}
//             <div>
//               <h2 className="text-2xl font-semibold">{authorInfo.name}</h2>
//               <p className="text-gray-600">{authorInfo.bio}</p>
//               <div className="flex space-x-4 mt-2">
//                 {authorInfo.socialLinks?.facebook && (
//                   <a href={authorInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
//                     <FaFacebook size={24} />
//                   </a>
//                 )}
//                 {authorInfo.socialLinks?.twitter && (
//                   <a href={authorInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
//                     <FaTwitter size={24} />
//                   </a>
//                 )}
//                 {authorInfo.socialLinks?.linkedin && (
//                   <a href={authorInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
//                     <FaLinkedin size={24} />
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {posts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
//           {posts.map((post) => (
//             <div key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
//               <div className="w-[400px] h-[270px]">
//                 {post.image && (
//                   <Image
//                     src={post.image}
//                     alt={post.title}
//                     width={400}
//                     height={270}
//                     className="blog-img"
//                     quality={50} // Image quality reduced
//                   />
//                 )}
//               </div>
//               <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
//                 <span className="mr-2">{post.category}</span>
//               </div>
//               <div className="border-t ps-4 pe-4 pt-2 d-flex">
//                 <p className="text-sm text-gray-500">
//                   <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {post.author}
//                 </p>
//                 <p className="text-sm text-gray-500 ms-auto">
//                   <FaCalendar className="text-center text-red-400 inline" />
//                   {format(new Date(post.createdAt), 'dd/MM/yyyy')}
//                 </p>
//               </div>
//               <div className="p-4">
//                 <h4 className="text-lg font-semibold">
//                   <Link href={`/blog/${post.slug}`} passHref>
//                     <span className="text-blue-500 text-xl font-bold hover:underline">{post.title}</span>
//                   </Link>
//                 </h4>
//                 <p className="text-gray-500 text-sm">{post.description}</p>
//                 <Link href={`/blog/${post.slug}`} passHref>
//                   <span className="text-red-500 mt-4 block">Read More →</span>
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No posts found for this author.</p>
//       )}
//     </div>
//   );
// };

// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// };

// const convertSlugToName = (slug) => {
//   return slug
//     .split('-')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// export default AuthorPosts;
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaFacebook, FaTwitter, FaLinkedin, FaUserCircle, FaCalendar } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image'; // Import Image from next/image
import { useTranslation } from 'react-i18next';

const AuthorPosts = () => {
  const router = useRouter();
  const { slug } = router.query; // 'slug' comes from the dynamic route
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';

  // Convert slug to name
  const name = slug ? convertSlugToName(slug) : '';
  const [posts, setPosts] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostsAndAuthorInfo = async () => {
    try {
      // Fetch author information
      const authorResponse = await axios.get(`/api/authors`, {
        params: {
          name: name,
        },
      });

      if (authorResponse.status === 200 && authorResponse.data.length > 0) {
        setAuthorInfo(authorResponse.data[0]);

        // Fetch posts associated with this author
        const postsResponse = await axios.get(`/api/blogs`, {
          params: {
            author: name,
          },
        });

        if (postsResponse.status === 200) {
          // Filter posts by the current language
          const filteredPosts = postsResponse.data.filter(post => {
            const postTranslation = post.translations[currentLanguage];
            return postTranslation && post.author === name;
          });

          setPosts(filteredPosts);
        } else {
          setError('Failed to fetch posts');
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
    if (name) {
      fetchPostsAndAuthorInfo();
    }
  }, [name, currentLanguage]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-7xl container mx-auto mt-5 mb-5">
      <div className="border shadow-sm bg-white mx-auto mt-5 mb-5 p-5">
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
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {posts.map((post) => (
            <div key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
              <div className="w-[400px] h-[270px]">
                {post.translations[currentLanguage].image && (
                  <Image
                    src={post.translations[currentLanguage].image}
                    alt={post.translations[currentLanguage].title}
                    width={400}
                    height={270}
                    className="blog-img"
                    quality={50} // Image quality reduced
                  />
                )}
              </div>
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                <span className="mr-2">{post.translations[currentLanguage].category}</span>
              </div>
              <div className="border-t ps-4 pe-4 pt-2 d-flex">
                <p className="text-sm text-gray-500">
                  <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {post.author}
                </p>
                <p className="text-sm text-gray-500 ms-auto">
                  <FaCalendar className="text-center text-red-400 inline" />
                  {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold">
                  <Link href={`/blog/${post.translations[currentLanguage].slug}`} passHref>
                    <span className="text-blue-500 text-xl font-bold hover:underline">{post.translations[currentLanguage].title}</span>
                  </Link>
                </h4>
                <p className="text-gray-500 text-sm">{post.translations[currentLanguage].description}</p>
                <Link href={`/blog/${post.translations[currentLanguage].slug}`} passHref>
                  <span className="text-red-500 mt-4 block">Read More →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found for this author.</p>
      )}
    </div>
  );
};

const convertSlugToName = (slug) => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default AuthorPosts;
