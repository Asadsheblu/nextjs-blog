import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from './layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import QuillWrapper from '../../components/EditorWrapper';

function Blogs() {
  const [quillContent, setQuillContent] = useState('');
  const [existingContents, setExistingContents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [slug, setSlug] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedEditor, setSelectedEditor] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchAuthors();
    const savedState = JSON.parse(localStorage.getItem('blogFormState'));
    if (savedState) {
      setQuillContent(savedState.quillContent || '');
      setSelectedCategory(savedState.selectedCategory || '');
      setSelectedLanguage(savedState.selectedLanguage || 'en');
      setSlug(savedState.slug || '');
      setTitle(savedState.title || '');
      setMetaTitle(savedState.metaTitle || '');
      setDescription(savedState.description || '');
      setMetaDescription(savedState.metaDescription || '');
      setImage(savedState.image || null);
      setSelectedAuthor(savedState.selectedAuthor || '');
      setSelectedEditor(savedState.selectedEditor || '');
      setSelectedDeveloper(savedState.selectedDeveloper || '');
    }
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedLanguage) {
      fetchContent();
    }
  }, [selectedCategory, selectedLanguage]);

  useEffect(() => {
    const formState = {
      quillContent,
      selectedCategory,
      selectedLanguage,
      slug,
      title,
      metaTitle,
      description,
      metaDescription,
      image,
      selectedAuthor,
      selectedEditor,
      selectedDeveloper
    };
    localStorage.setItem('blogFormState', JSON.stringify(formState));
  }, [quillContent, selectedCategory, selectedLanguage, slug, title, metaTitle, description, metaDescription, image, selectedAuthor, selectedEditor, selectedDeveloper]);

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

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/blogs?category=${selectedCategory}&language=${selectedLanguage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();
      setExistingContents(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error fetching content:', error.message);
      setError(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!title || !quillContent || !metaDescription || !metaTitle || !description || !selectedCategory || !selectedLanguage || !selectedAuthor || !selectedEditor || !selectedDeveloper) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';

      const formData = new FormData();
      formData.append('content', quillContent);
      formData.append('title', title);
      formData.append('metaTitle', metaTitle);
      formData.append('description', description);
      formData.append('metaDescription', metaDescription);
      formData.append('language', selectedLanguage);
      formData.append('category', selectedCategory);
      if (imageFile) {
        formData.append('image', imageFile); // Use the image file
      }
      formData.append('author', selectedAuthor); // Use the selected author
      formData.append('editor', selectedEditor); // Use the selected editor
      formData.append('developer', selectedDeveloper); // Use the selected developer
      formData.append('slug', slug);
      formData.append('createdAt', new Date().toISOString());
      formData.append('isDraft', JSON.stringify(false));

      const response = await fetch('/api/blogs', {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to post content: ${errorMessage}`);
      }

      setError(null);
      fetchContent();
      toast.success('Blog uploaded successfully!');
      localStorage.removeItem('blogFormState');
    } catch (error) {
      console.error('Error posting content:', error.message);
      setError(error.message);
    }
  };

  const handleQuillChange = useCallback((newContent) => {
    setQuillContent(newContent);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    setSelectedCategory(''); // Reset selected category when language changes
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file); // Save the file for form submission
    }
  };

  useEffect(() => {
    if (!isSlugEditable) {
      const generateSlug = (str) => {
        const cleanedTitle = str.replace(/[^\w\s]/gi, '');
        return cleanedTitle.toLowerCase().split(' ').join('-');
      };

      setSlug(generateSlug(title));
    }
  }, [title, isSlugEditable]);

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
  };

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-3xl font-semibold mb-6">Add Post - {selectedCategory ? selectedCategory : 'Select a category'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
          <div className="mb-6">
              <label htmlFor="language" className="block mb-2 text-lg font-medium">Language*</label>
              <select
                id="language"
                value={selectedLanguage}
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
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="metaTitle" className="block mb-2 text-lg font-medium">Meta Title</label>
              <input
                id="metaTitle"
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="metaDescription" className="block mb-2 text-lg font-medium">Meta Description</label>
              <textarea
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="title" className="block mb-2 text-lg font-medium">Title*</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="slug" className="block mb-2 text-lg font-medium">Slug</label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={handleSlugChange}
                readOnly={!isSlugEditable}
                className={`w-full border border-gray-300 rounded-lg p-3 ${!isSlugEditable ? 'bg-gray-100' : 'bg-white'} shadow-sm`}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="editSlug"
                  checked={isSlugEditable}
                  onChange={(e) => setIsSlugEditable(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="editSlug" className="text-gray-700">Edit Slug</label>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 text-lg font-medium">Description*</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              />
              <p className="text-gray-600 text-sm mt-1">Description max 200 characters</p>
            </div>
            <div className="mb-6">
              <label htmlFor="content" className="block mb-2 text-lg font-medium">Content*</label>
              <div className="border border-gray-300 rounded-lg shadow-sm p-3">
                <QuillWrapper initialContent={quillContent} onChange={handleQuillChange} />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-6">
              <label htmlFor="category" className="block mb-2 text-lg font-medium">Categories*</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              >
                <option value="" disabled>Select a category</option>
                {categories
                  .filter((category) => category.translations && category.translations[selectedLanguage])
                  .map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.translations[selectedLanguage].name}
                    </option>
                  ))}
              </select>
            </div>
           
            <div className="mb-6">
              <label htmlFor="author" className="block mb-2 text-lg font-medium">Author*</label>
              <select
                id="author"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              >
                <option value="" disabled>Select an author</option>
                {authors
                  .filter((author) => author.role === 'Author')
                  .map((author) => (
                    <option key={author._id} value={author.name}>{author.name}</option>
                  ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="editor" className="block mb-2 text-lg font-medium">Editor*</label>
              <select
                id="editor"
                value={selectedEditor}
                onChange={(e) => setSelectedEditor(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              >
                <option value="" disabled>Select an editor</option>
                {authors
                  .filter((author) => author.role === 'Editor')
                  .map((author) => (
                    <option key={author._id} value={author.name}>{author.name}</option>
                  ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="developer" className="block mb-2 text-lg font-medium">Developer*</label>
              <select
                id="developer"
                value={selectedDeveloper}
                onChange={(e) => setSelectedDeveloper(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
              >
                <option value="" disabled>Select a developer</option>
                {authors
                  .filter((author) => author.role === 'Developer')
                  .map((author) => (
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
              {image && (
                <div className="mt-4">
                  <Image src={image} alt="Preview" width={100} height={100} className="rounded-lg shadow-md" />
                </div>
              )}
              <p className="text-gray-600 text-sm mt-1">Valid image size: 400 * 270 px </p>
            </div>
            <button
              className="bg-blue-500 text-white p-3 rounded-lg w-full mb-4 shadow-md"
              onClick={handleSubmit}
            >
              Save & Edit
            </button>
            <button
              className="bg-green-500 text-white p-3 rounded-lg w-full shadow-md"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default Blogs;
