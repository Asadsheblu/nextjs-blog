import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', parentCategory: '', description: '' });
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
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setError(error.message);
    }
  };

  const handleSaveCategory = async () => {
    if (newCategory.name && newCategory.slug && (!editingCategory || categories.every(category => category.slug !== newCategory.slug))) {
      try {
        const method = editingCategory ? 'PUT' : 'POST';
        const response = await fetch(`/api/categories${editingCategory ? `?id=${editingCategory._id}` : ''}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCategory),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const categoryData = await response.json();
        if (editingCategory) {
          setCategories(categories.map(category => (category._id === categoryData._id ? categoryData : category)));
        } else {
          setCategories([...categories, categoryData]);
        }

        setNewCategory({ name: '', slug: '', parentCategory: '', description: '' });
        setEditingCategory(null);
        toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
      } catch (error) {
        console.error(`Error ${editingCategory ? 'updating' : 'adding'} category:`, error.message);
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      setCategories(categories.filter(category => category._id !== id));
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error.message);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevState => {
      let newSlug = prevState.slug;
      if (name === 'name') {
        newSlug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      }
      return { ...prevState, [name]: value, slug: newSlug };
    });
  };

  const handleSlugChange = (e) => {
    const { value } = e.target;
    setNewCategory(prevState => ({
      ...prevState,
      slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    }));
  };

  const handleEdit = (category) => {
    setNewCategory(category);
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setNewCategory({ name: '', slug: '', parentCategory: '', description: '' });
    setEditingCategory(null);
  };

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-5">Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                className="mt-1 block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={newCategory.slug}
                onChange={handleSlugChange}
                className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">Parent Category</label>
              <select
                id="parentCategory"
                name="parentCategory"
                value={newCategory.parentCategory}
                onChange={handleChange}
                className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">None</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                {editingCategory ? 'Update Category' : 'Add New Category'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Categories List</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link href={`/categories/${category.slug}`}>
                        <span>{category.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.description}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default Categories;
