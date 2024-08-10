import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Layout from './layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const QuillWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const [slug, setSlug] = useState('');
  const [quillContent, setQuillContent] = useState('');
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isDraft, setIsDraft] = useState(false);
  const [language, setLanguage] = useState('en'); // Default language
  const [initialImage, setInitialImage] = useState(null);
  const [authors, setAuthors] = useState([]); // Authors list
  const [selectedAuthor, setSelectedAuthor] = useState(''); // Selected author
  const [isSlugEditable, setIsSlugEditable] = useState(false); // Track if slug is editable

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
    if (id) {
      fetchBlogData(id, language);
    }
  }, [id, language]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      if (!response.ok) {
        throw new Error('Failed to fetch authors');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error.message);
    }
  };

  const fetchBlogData = async (id, lang) => {
    try {
      const response = await fetch(`/api/blogs?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog data');
      }
      const data = await response.json();
      if (data.translations && data.translations[lang]) {
        const translation = data.translations[lang];
        setQuillContent(translation.content);
        setSelectedCategory(translation.category);
        setTitle(translation.title);
        setMetaTitle(translation.metaTitle);
        setSlug(translation?.slug);
        setMetaDescription(translation.metaDescription);
        setDescription(translation.description);
        setInitialImage(translation.image);
        setSelectedAuthor(data.author); // Set the selected author

        // Auto-select feature image logic
        if (!translation.image) {
          const firstImageMatch = translation.content.match(/<img[^>]+src="?([^"\s]+)"?\s*\/>/);
          if (firstImageMatch && firstImageMatch[1]) {
            setInitialImage(firstImageMatch[1]);
          }
        }
      } else {
        // Clear the form if the translation for the selected language does not exist
        setQuillContent('');
        setSelectedCategory('');
        setTitle('');
        setSlug('');
        setMetaTitle('');
        setMetaDescription('');
        setDescription('');
        setSelectedAuthor(''); // Clear the selected author
      }
      setIsDraft(data.isDraft);
    } catch (error) {
      console.error('Error fetching blog data:', error.message);
      setError(error.message);
    }
  };

  const handleSave = useCallback(async () => {
    try {
      const method = 'PUT';

      const formData = new FormData();
      formData.append('content', quillContent);
      formData.append('title', title);
      formData.append('slug', slug);  // Use the slug from state
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      } else if (initialImage) {
        formData.append('image', initialImage);
      }
      formData.append('category', selectedCategory);
      formData.append('author', selectedAuthor); // Set selected author
      formData.append('createdAt', new Date().toISOString());
      formData.append('isDraft', JSON.stringify(isDraft));
      formData.append('language', language); // Append language

      const response = await fetch(`/api/blogs?id=${id}`, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update content: ${errorMessage}`);
      }

      setError(null);
      toast.success('Content updated successfully!');
      router.push('/dashboard/all-blogs'); // Redirect to all blogs page
    } catch (error) {
      console.error('Error updating content:', error.message);
      setError(error.message);
    }
  }, [quillContent, selectedCategory, metaTitle, metaDescription, description, title, slug, image, initialImage, isDraft, id, router, language, selectedAuthor]);

  const handleQuillChange = useCallback((newContent) => {
    setQuillContent(newContent);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDraftChange = (e) => {
    setIsDraft(e.target.value === 'Draft');
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  };

  const toggleSlugEditable = () => {
    setIsSlugEditable(!isSlugEditable);
  };

  return (
    <Layout>
      <div className="container mx-auto p-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6">Edit Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-3">
            <label htmlFor="metaTitle" className="block mb-2 text-lg font-medium">Meta Title</label>
            <input
              id="metaTitle"
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="block mb-2 text-lg font-medium">Categories*</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="metaDescription" className="block mb-2 text-lg font-medium">Meta Description</label>
            <textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="block mb-2 text-lg font-medium">Status*</label>
            <select
              id="status"
              value={isDraft ? 'Draft' : 'Publish'}
              onChange={handleDraftChange}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            >
              <option value="Publish">Publish</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="title" className="block mb-2 text-lg font-medium">Title*</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="language" className="block mb-2 text-lg font-medium">Language*</label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
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
              {/* Add more languages as needed */}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="slug" className="block mb-2 text-lg font-medium">Slug</label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 shadow-sm"
              disabled={!isSlugEditable} // Disable editing unless the checkbox is checked
            />
            <div className="mt-2">
              <input
                type="checkbox"
                id="editSlug"
                checked={isSlugEditable}
                onChange={toggleSlugEditable}
              />
              <label htmlFor="editSlug" className="ml-2 cursor-pointer text-blue-600 hover:underline">Edit Slug</label>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="block mb-2 text-lg font-medium">Description*</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            />
            <p className="text-gray-600 text-sm mt-1">Description max 200 characters</p>
          </div>
          <div className="mb-3">
            <label htmlFor="author" className="block mb-2 text-lg font-medium">Author*</label>
            <select
              id="author"
              value={selectedAuthor}
              onChange={handleAuthorChange}
              className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
            >
              <option value="" disabled>Select an author</option>
              {authors.map((author) => (
                <option key={author._id} value={author.name}>{author.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="block mb-2 text-lg font-medium">Image</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="block w-full text-gray-700"
            />
            {initialImage && !image && (
              <div className="mt-4">
                <Image src={initialImage} alt="Preview" width={300} height={200} className="w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
            {image && (
              <div className="mt-4">
                <Image src={URL.createObjectURL(image)} alt="Preview" width={300} height={200} className="w-full h-auto rounded-lg shadow-md" />
              </div>
            )}
            <p className="text-gray-600 text-sm mt-1">Valid image size: 400 * 270 px </p>
          </div>
          <div className="mb-3 col-span-2">
            <label htmlFor="content" className="block mb-2 text-lg font-medium">Content*</label>
            <div className="border border-gray-300 rounded-lg shadow-sm p-3">
              <QuillWrapper initialContent={quillContent} onChange={handleQuillChange} />
            </div>
          </div>
          {error && <div className="text-red-500 mb-6 col-span-2">Error: {error}</div>}
          <div className="mb-3 col-span-2 flex space-x-4">
            <button className="bg-blue-500 text-white p-3 rounded-lg shadow-md flex-1" onClick={handleSave}>Save & Edit</button>
            <button className="bg-green-500 text-white p-3 rounded-lg shadow-md flex-1" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default EditBlog;
