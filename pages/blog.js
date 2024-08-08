import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import { FaArrowRight, FaCalendar, FaUserCircle } from 'react-icons/fa';
import { i18n } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const createSlug = (title) => {
  return title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

const extractFirstImage = (content) => {
  const regex = /<img.*?src="(.*?)"/;
  const match = regex.exec(content);
  return match ? match[1] : null;
};

// Helper function to get the correct title and content
const getTitle = (translation) => translation.title || translation.Title || '';
const getContent = (translation) => translation.content || translation.Content || '';

const BlogSection = ({ initialBlogs = [] }) => {
  const [loading, setLoading] = useState(!initialBlogs.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [blogsData, setBlogsData] = useState(initialBlogs);
  const blogsPerPage = 9;
  const currentLanguage = i18n.language || 'en';

  const filteredBlogs = useMemo(() => {
    return blogsData.map(blog => {
      const lang = blog.defaultLanguage || 'en';
      let translation = blog.translations[lang] || blog.translations['en'] || {};

      // If the blog doesn't have a slug, generate it from the title
      const title = getTitle(translation);
      if (!translation.slug && title) {
        translation.slug = createSlug(title);
      }

      // If the blog doesn't have an image, use the first image from the content
      const content = getContent(translation);
      if (!translation.image && content) {
        translation.image = extractFirstImage(content);
      }

      return {
        ...blog,
        translations: {
          ...blog.translations,
          [lang]: translation,
          // Ensure there is a translation entry for the current language
          [currentLanguage]: blog.translations[currentLanguage] || translation,
        },
      };
    }).filter(blog => blog.translations[currentLanguage]);
  }, [blogsData, currentLanguage]);

  const currentBlogs = useMemo(() => {
    return filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  }, [filteredBlogs, currentPage, blogsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBlogs.length / blogsPerPage);
  }, [filteredBlogs.length, blogsPerPage]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blogs`);
      setBlogsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialBlogs.length) {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [fetchBlogs, initialBlogs]);

  const parseCategories = (category) => {
    return category ? category.split(',') : [];
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (filteredBlogs.length === 0) {
    return <p>No blogs available in this language.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
      <title>Ytubetools || Blog</title>
      <meta name="description" content="Blog Page" />
      <meta property="og:url" content="https://ytubetools.com/blog" />
      <meta
        property="og:description"
        content="Enhance your YouTube experience with our comprehensive suite of tools designed for creators and viewers alike. Extract video summaries, titles, descriptions, and more. Boost your channel's performance with advanced features and insights"
      />

      <div className="container mx-auto px-4 p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8">
          <div className="col-span-12 md:col-span-5">
            {currentBlogs.slice(0, 1).map((blog, index) => {
              const content = blog.translations[currentLanguage];
              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                  {content?.image && (
                    <div className="w-full relative">
                      <Image
                        src={content.image}
                        alt={getTitle(content)}
                        width={400}
                        height={300}
                        layout="responsive"
                        objectFit="cover"
                      />
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                        <span className="mr-2">{content?.category}</span>
                      </div>
                    </div>
                  )}
                  <div className="border-t ps-4 pe-4 pt-2 d-flex">
                    <p className="text-sm text-gray-500">
                      <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {blog.author}
                    </p>
                    <p className="text-sm text-gray-500 ms-auto">
                      <FaCalendar className="text-center text-red-400 inline" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-6">
                    <h6 className="text-3xl font-semibold">
                      <Link href={`/blog/${content.slug}`} passHref>
                        <span className="text-blue-500 hover:underline">{getTitle(content)}</span>
                      </Link>
                    </h6>
                    <p className="text-gray-600 mb-4">{content.description || content.Description}</p>
                    <Link href={`/blog/${content.slug}`} passHref>
                      <span className="text-red-500 mt-4 block">Read More →</span>
                    </Link>
                    <div className="mt-2">
                      {parseCategories(blog.category).map((category, i) => (
                        <span key={i} className="text-sm bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-span-12 md:col-span-7 space-y-4">
            {currentBlogs.slice(1, 4).map((blog, index) => {
              const content = blog.translations[currentLanguage];
              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row relative">
                  {content?.image && (
                    <div className="w-full md:mt-2 md:w-1/2" style={{ height: '140px', position: 'relative' }}>
                      <Image
                        src={content.image}
                        alt={getTitle(content)}
                        layout="fill"
                        objectFit="cover"
                        className='rounded'
                      />
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                        <span className="mr-2">{content?.category}</span>
                      </div>
                    </div>
                  )}
                  <div className="ps-2 pt-2 flex-1">
                    <h6 className="text-lg font-semibold">
                      <Link href={`/blog/${content.slug}`} passHref>
                        <span className="text-blue-500 hover:underline">{getTitle(content)}</span>
                      </Link>
                    </h6>
                    <Link href={`/blog/${content.slug}`} passHref>
                      <span className="text-red-500 mt-4 block">Read More →</span>
                    </Link>
                    <div className="border-t ps-2 pe-2 pt-2 d-flex">
                      <p className="text-sm text-gray-500">
                        <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {blog.author}
                      </p>
                      <p className="text-sm text-gray-500 ms-auto">
                        <FaCalendar className="text-center text-red-400 inline" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-red-500 text-white p-10 rounded-lg relative w-full text-center mt-5 mb-5">
          <div className="mt-10">
            <h2 className="text-2xl text-white font-bold mb-2">SUBSCRIBE TO OUR NEWSLETTER</h2>
            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti aliquid molestias voluptatem fugiat provident tenetur saepe hic
              consectet.
            </p>
            <form className="flex justify-center" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Email Address" className="w-full max-w-xs p-3 rounded-l-md focus:outline-none" />
              <button type="submit" className="bg-red-600 p-3 rounded-r-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {currentBlogs.slice(4).map((blog, index) => {
            const content = blog.translations[currentLanguage];
            return (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                {content.image && (
                  <Image
                    src={content.image}
                    alt={getTitle(content)}
                    width={300}
                    height={200}
                    layout="responsive"
                    className="object-cover rounded-lg"
                  />
                )}
                <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                  <span className="mr-2">{content?.category}</span>
                </div>
                <div className="border-t ps-4 pe-4 pt-2 d-flex">
                  <p className="text-sm text-gray-500">
                    <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {blog.author}
                  </p>
                  <p className="text-sm text-gray-500 ms-auto">
                    <FaCalendar className="text-center text-red-400 inline" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold">
                    <Link href={`/blog/${content.slug}`} passHref>
                      <span className="text-blue-500 hover:underline">{getTitle(content)}</span>
                    </Link>
                  </h4>
                  <p className="text-gray-500 text-sm">{content?.description}</p>
                  <div className="mt-2">
                    {parseCategories(blog.category).map((category, i) => (
                      <span key={i} className="text-sm bg-gray-200 text-gray-700 rounded-full px-2 py-1 mr-2">
                        {category}
                      </span>
                    ))}
                  </div>
                  <Link href={`/blog/${content.slug}`} passHref>
                    <span className="text-red-500 mt-4 block">Read More →</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8">
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className="page-item">
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`page-link ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ locale, req }) {
  try {
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;
    const apiUrl = `${protocol}://${host}/api/blogs`;
    const { data } = await axios.get(apiUrl);
    return {
      props: {
        initialBlogs: data,
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer'])),
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return {
      props: {
        initialBlogs: [],
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'footer'])),
      },
    };
  }
}

export default memo(BlogSection);
