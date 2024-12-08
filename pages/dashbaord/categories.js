import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'zhHANT', name: '中国传统的 (Traditional Chinese)' },
  { code: 'zhHANS', name: '简体中文 (Simplified Chinese)' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
];

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from the start
    .replace(/-+$/, ''); // Trim hyphens from the end
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [categoryData, setCategoryData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data || []);  // Safeguard against undefined data
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setError(error.message);
    }
  };

  const handleSaveCategory = async () => {
    const { name, slug, description } = categoryData;

    const updatedTranslations = {
      ...editingCategory?.translations,
      [selectedLanguage]: { name, slug, description }
    };

    const newCategory = {
      defaultLanguage: editingCategory?.defaultLanguage || selectedLanguage,
      translations: updatedTranslations
    };

    const method = editingCategory ? 'PUT' : 'POST';
    const response = await fetch(`/api/categories${editingCategory ? `?id=${editingCategory._id}` : ''}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    });

    if (response.ok) {
      setCategoryData({ name: '', slug: '', description: '' });
      setEditingCategory(null);
      toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
      fetchCategories(); // Reload categories after saving
    } else {
      const errorData = await response.json();
      console.error(`Error ${editingCategory ? 'updating' : 'adding'} category:`, errorData.error);
      setError(errorData.error);
      toast.error(`Error: ${errorData.error}`);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories?id=${id}&lang=${selectedLanguage}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // Update the category list by fetching it again after deletion
      fetchCategories();
      toast.success(`Category in ${selectedLanguage.toUpperCase()} deleted successfully!`);
    } catch (error) {
      console.error('Error deleting category:', error.message);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    if (editingCategory) {
      const translation = editingCategory.translations && editingCategory.translations[e.target.value] 
        ? editingCategory.translations[e.target.value]
        : {};
      setCategoryData({
        name: translation.name || '',
        slug: translation.slug || createSlug(translation.name || ''),
        description: translation.description || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prevState => {
      const newState = { ...prevState, [name]: value };
      if (name === 'name' && !editingCategory) {
        newState.slug = createSlug(value);
      }
      return newState;
    });
  };

  const handleEdit = (category) => {
    const translation = category.translations && category.translations[selectedLanguage] 
      ? category.translations[selectedLanguage] 
      : {};
    setCategoryData({
      name: translation.name || '',
      slug: translation.slug || createSlug(translation.name || ''),
      description: translation.description || ''
    });
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setCategoryData({ name: '', slug: '', description: '' });
    setEditingCategory(null);
  };

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-5">Categories</h2>

        {/* Add/Edit Category Form */}
        <div className="border p-4 rounded-lg shadow-md mb-5">
          <h3 className="text-xl font-semibold mb-3">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select
              id="language"
              name="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="mt-1 block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          {/* Name Input */}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              className="mt-1 block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Slug Input */}
          <div className="mb-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={categoryData.slug}
              onChange={handleInputChange}
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description Input */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={categoryData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Language Selector */}
        

          <div className="flex justify-end">
            {editingCategory && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveCategory}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingCategory ? 'Update Category' : 'Add New Category'}
            </button>
          </div>
        </div>

        {/* Categories List Table */}
        <h3 className="text-xl font-semibold mb-3">Categories List</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => {
              const translation = category.translations[selectedLanguage] || {};
              return (
                <tr key={`${category._id}-${selectedLanguage}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {availableLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.slug || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {translation.description || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default Categories;
