import React, { useState, useEffect } from 'react';
import Layout from './layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
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

  const handleSaveNewCategory = async () => {
    if (newCategory && !categories.some(category => category.name === newCategory)) {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory }),
        });

        if (!response.ok) {
          throw new Error('Failed to add new category');
        }

        const newCategoryData = await response.json();
        setCategories([...categories, newCategoryData]);
        setNewCategory('');
        setIsNewCategoryModalOpen(false);
        toast.success('Category added successfully!');
      } catch (error) {
        console.error('Error adding category:', error.message);
        setError(error.message);
      }
    }
  };

  const openNewCategoryModal = () => {
    setIsNewCategoryModalOpen(true);
  };

  const closeNewCategoryModal = () => {
    setIsNewCategoryModalOpen(false);
  };

  const handleChange = (e) => {
    setNewCategory(e.target.value);
  };

  return (
    <Layout>
      <div className='container p-5 category-container'>
        <h2 className='category-title'>Manage Categories</h2>
        <button onClick={openNewCategoryModal} className="btn btn-primary mb-3">Add New Category</button>

        {isNewCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-smoke-light">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
              <div className="mb-4">
                <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">New Category:</label>
                <input
                  type="text"
                  id="newCategory"
                  value={newCategory}
                  onChange={handleChange}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                />
              </div>
              <div className="flex justify-end">
                <button onClick={handleSaveNewCategory} className="btn btn-primary mr-2">Save</button>
                <button onClick={closeNewCategoryModal} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <ul className="category-list">
          {categories.map((category) => (
            <li key={category._id} className="category-item">{category.name}</li>
          ))}
        </ul>

        {error && <div className="text-red-500">Error: {error}</div>}
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default Categories;
