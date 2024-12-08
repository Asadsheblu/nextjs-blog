import React, { useEffect, useState, useCallback, memo, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';
import { FaCalendar, FaSearch, FaUserCircle } from 'react-icons/fa';
import { i18n } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { format } from 'date-fns';
import PromoSection from '../components/BlogPromoSection';

// Utility functions
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

const getTitle = (translation) => translation.title || translation.Title || '';
const getContent = (translation) => translation.content || translation.Content || '';

const parseCategories = (category) => {
  return category ? category.split(',') : [];
};

const BlogSection = ({ initialBlogs = [] }) => {
  const router = useRouter();
  const { category: selectedCategory } = router.query;
  const [loading, setLoading] = useState(!initialBlogs.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [blogsData, setBlogsData] = useState(initialBlogs);
  const [categories, setCategories] = useState([]);
  const blogsPerPage = 9;
  const currentLanguage = i18n.language || 'en'; // Default to English if no language is set
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCategory, setCurrentCategory] = useState(selectedCategory || '');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/categories');
      const filteredCategories = response.data.map(category => {
        const translation = category.translations[currentLanguage];
        return {
          ...category,
          name: translation ? translation.name : category.name,
          slug: translation ? translation.slug : category.slug
        };
      });
      setCategories(filteredCategories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const processedBlogs = useMemo(() => {
    return blogsData.map(blog => {
      const lang = blog.defaultLanguage || 'en';
      let translation = blog.translations[lang] || blog.translations['en'] || {};

      const title = getTitle(translation);
      if (!translation.slug && title) {
        translation.slug = createSlug(title);
      }

      const content = getContent(translation);
      if (!translation.image && content) {
        translation.image = extractFirstImage(content);
      }

      // Ensure _id and other essential fields are preserved
      return {
        _id: blog._id,  // Preserve the _id
        createdAt: blog.createdAt,  // Preserve other essential fields
        author: blog.author,
        ...blog, // Spread the rest of the blog object to include all other fields
        translations: {
          ...blog.translations,
          [lang]: translation, // Merge the language-specific translations
          [currentLanguage]: blog.translations[currentLanguage] || translation, // Use current language or fallback
        },
      };
    }).filter(blog => blog.translations[currentLanguage]);
  }, [blogsData, currentLanguage]);

  const latestBlogs = processedBlogs.slice(0, 4);

  const categoryBlogs = useMemo(() => {
    let blogs = processedBlogs.slice(0); 
    if (currentCategory) {
      blogs = blogs.filter(blog =>
        blog.translations[currentLanguage].category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === currentCategory
      );
    }
    if (searchQuery) {
      blogs = blogs.filter(blog => getTitle(blog.translations[currentLanguage]).toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return blogs;
  }, [currentCategory, processedBlogs, currentLanguage, searchQuery]);

  const currentBlogs = useMemo(() => {
    return categoryBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  }, [categoryBlogs, currentPage, blogsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(categoryBlogs.length / blogsPerPage);
  }, [categoryBlogs.length, blogsPerPage]);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/blogs');
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

  const handleCategoryChange = (categorySlug) => {
    setCurrentCategory(categorySlug);
    setCurrentPage(1);
    router.push({
      pathname: router.pathname,
      query: { category: categorySlug },
    }, undefined, { shallow: true });
  };

  const createCategorySlug = (category) => {
    return category
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^\w-]+/g, ''); 
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

  if (processedBlogs.length === 0) {
    return <p className="text-center text-gray-600 text-xl mt-10">No blogs available in this language.</p>;
  }

  return (
    <div className=''>
      <title>Ytubetools || Blog</title>
      <meta name="description" content="Blog Page" />
      <meta property="og:url" content="https://ytubetools.com/blog" />
      <meta
        property="og:description"
        content="Enhance your YouTube experience with our comprehensive suite of tools designed for creators and viewers alike. Extract video summaries, titles, descriptions, and more. Boost your channel's performance with advanced features and insights"
      />

      <PromoSection />

      <div className="max-w-7xl container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8">
          <div className="col-span-12">
            <h2 className="text-2xl text-blue-900 font-bold mb-2">Latest Blog</h2>
          </div>
          <div className="col-span-12 md:col-span-5">
            {latestBlogs.slice(0, 1).map((blog, index) => {
              const content = blog.translations[currentLanguage];
              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                  {content?.image && (
                    <div className="w-full" style={{ height: '260px'}}>
                      <Image
                        src={content.image}
                        alt={content.title}
                        width={400}
                        height={260}
                        className='blog-img'
                        quality={50} // Image quality reduced
                      />
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                        <span className="mr-2">{content?.category || content._id}</span>
                      </div>
                    </div>
                  )}
                  <div className="border-t ps-3 pe-3 pt-3 d-flex">
                    <p className="text-sm text-gray-500">
                      <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {blog.author}
                    </p>
                    <p className="text-sm text-gray-500 ms-auto">
                      <FaCalendar className="text-center text-red-400 inline" />
                      {format(new Date(blog.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="pe-3 ps-3 pt-2">
                    <h6 className="text-lg font-semibold">
                      <Link href={`/blog/${content.slug}`} passHref>
                        <span className="text-blue-500 text-xl font-bold hover:underline">{content.title}</span>
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
            {latestBlogs.slice(1, 4).map((blog, index) => {
              const content = blog.translations[currentLanguage];
              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row relative">
                  {content?.image && (
                    <div className="w-full  md:w-5/12" style={{ height: '165px', position: 'relative' }}>
                      <Image
                        src={content.image}
                        alt={content.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                        quality={50} // Image quality reduced
                      />
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                        <span className="mr-2">{content?.category || content._id}</span>
                      </div>
                    </div>
                  )}
                  <div className="ps-2 pt-2 flex-1 md:w-7/12">
                    <h6 className="text-lg font-semibold">
                      <Link href={`/blog/${content.slug}`} passHref>
                        <span className="text-blue-500 text-xl font-bold hover:underline">{content.title}</span>
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
                        {format(new Date(blog.createdAt), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-[#f7f3ff] bg py-8 pt-5 pb-5 px-5 md:px-10 flex items-center justify-center rounded-lg shadow-md my-10">
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-5 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Subscribe to our newsletter.</h2>
              <p className="text-gray-600 mt-2">Join 80,000 others!</p>
            </div>
            <div className="col-span-12 md:col-span-7">
              <form className="flex flex-col items-center md:flex-row w-full">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full md:flex-1 p-3 rounded-l-md border border-gray-300 focus:outline-none"
                />
                <button type="submit" className="bg-purple-700 text-white p-3 rounded-r-md">
                  Sign Up
                </button>
              </form>
              <p className="text-gray-600 text-xs mt-3 md:mt-1 text-center md:text-left">
                By signing up, you agree to our <Link href="/privacy-policy"><span className="text-purple-600">Privacy Policy</span></Link>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search blogs by title..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
        </div>

        <div className="text-white rounded-lg relative w-full mt-5 mb-5">
        
          <div className="flex justify-center mb-4">
            <ul className="flex flex-wrap justify-center space-x-2">
              <li
                className={`px-4 py-2 list-none rounded-full text-sm font-medium border ${!currentCategory ? 'bg-purple-700 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => handleCategoryChange('')}
              >
                <span className="cursor-pointer">All Posts</span>
              </li>
              {categories.map((category) => {
                return (
                  <li
                    key={category.slug}
                    className={`px-4 py-2 list-none rounded-full text-sm font-medium border ${currentCategory === category.slug ? 'bg-purple-700 text-white' : 'bg-white text-gray-700'}`}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    <span className="cursor-pointer">{category.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div id='all-blog' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {currentBlogs.slice(0, 9).map((blog, index) => {
              const content = blog.translations[currentLanguage];
              return (
                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                  <div className='w-[400px] h-[270px]'>
                    {content.image && (
                      <Image
                        src={content.image}
                        alt={getTitle(content)}
                        width={400}
                        height={270}
                        className='blog-img'
                        quality={50} // Image quality reduced
                      />
                    )}
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-sm rounded-full px-2 py-1">
                    <span className="mr-2">{content?.category || content._id}</span>
                  </div>
                  <div className="border-t ps-4 pe-4 pt-2 d-flex">
                    <p className="text-sm text-gray-500">
                      <FaUserCircle className="text-center fs-6 text-red-400 inline" /> {blog.author}
                    </p>
                    <p className="text-sm text-gray-500 ms-auto">
                      <FaCalendar className="text-center text-red-400 inline" />
                      {format(new Date(blog.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold">
                      <Link href={`/blog/${content.slug}`} passHref>
                        <span className="text-blue-500 text-xl font-bold hover:underline">{getTitle(content)}</span>
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
        </div>

        <div className="flex justify-center mt-8">
          {totalPages > 1 && (
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
          )}
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
        ...(await serverSideTranslations(locale, ['blog', 'navbar', 'footer'])),
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return {
      props: {
        initialBlogs: [],
        ...(await serverSideTranslations(locale, ['blog', 'navbar', 'footer'])),
      },
    };
  }
}

export default memo(BlogSection);
