import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaCalendar, FaUserCircle } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [category, setCategory] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (slug) {
      fetchCategory();
    }
  }, [slug]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/categories/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }
      const data = await response.json();
      setCategory(data.category);
      setBlogs(data.blogs);
    } catch (error) {
      console.error('Error fetching category:', error.message);
      setError(error.message);
    }
  };

  if (!category) {
    return <div className="flex justify-center items-center h-screen">
    <ClipLoader size={50} color={"#123abc"} loading={loading} />
  </div>
  }

  return (
    <div className="container mx-auto p-5">
   
      <h1 className="text-xl font-semibold mb-3">Blogs/{category.name}</h1>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="border rounded-lg overflow-hidden shadow-lg">
              <Image
                src={blog.translations.en.image || '/default-image.jpg'} // Provide a fallback image URL
                alt={blog.translations.en.title || 'Blog Image'}
                width={500}
                height={300}
              />
              <div className="border-t ps-4 pt-2 pe-4 d-flex">
                <p className="text-sm text-gray-500"><FaUserCircle className='text-center fs-3 text-red-400 inline' /> {blog.author}</p>
                <p className="text-sm text-gray-500 ms-auto"><FaCalendar className='text-center fs-4 text-red-400 inline' /> {new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg">{blog.translations.en.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{blog.translations.en.description}</p>
                <Link target='_blank' href={`/blog/${blog.translations.en.slug}`} className="text-blue-500 mt-4 block">Read More →</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-700">This category has no blogs.</p>
      )}
      {error && <div className="text-red-500 mt-4">Error: {error}</div>}
    </div>
  );
};

export default CategoryPage;
