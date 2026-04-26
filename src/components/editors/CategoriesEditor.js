import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const CategoriesEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => card.categories || { items: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (card?.categories) {
      setFormData(card.categories);
    }
  }, [card?.categories?.items?.length, card?.categories?.enabled, card?.categories]);

  const handleAddCategory = () => {
    if (!currentCategory.name) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      // Update existing category
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.id === editingCategory.id ? { ...currentCategory, id: editingCategory.id } : item
        )
      });
    } else {
      // Add new category
      const newCategory = { ...currentCategory, id: uuidv4() };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newCategory]
      });
    }
    
    setCurrentCategory({ name: '', description: '', image: '' });
    setEditingCategory(null);
    setShowModal(false);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCurrentCategory({
      name: category.name || '',
      description: category.description || '',
      image: category.image || ''
    });
    setShowModal(true);
  };

  const handleRemoveCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const updatedData = {
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      };
      setFormData(updatedData);
      onSave('categories', updatedData);
      toast.success('Category deleted');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await cardService.uploadImage(file, `cards/${card.id}/categories`);
      setCurrentCategory({ ...currentCategory, image: url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('categories', formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setCurrentCategory({ name: '', description: '', image: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.enabled !== false}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mr-2 w-5 h-5"
            />
            <span className="font-medium">Enable Categories Section</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Product Categories ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCurrentCategory({ name: '', description: '', image: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Add Category
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.items.map((category) => (
                <div key={category.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  {category.image && (
                    <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded mb-3" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{category.name}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit category"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete category"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No categories added yet</p>
              <p className="text-sm text-gray-500">Click "Add Category" to get started</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium"
        >
          Save Changes
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Electronics"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Brief description of this category..."
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {currentCategory.image && (
                  <div className="mt-2">
                    <img src={currentCategory.image} alt="Preview" className="w-full h-32 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setCurrentCategory({ ...currentCategory, image: '' })}
                      className="mt-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!currentCategory.name || uploading}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                >
                  {editingCategory ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesEditor;
