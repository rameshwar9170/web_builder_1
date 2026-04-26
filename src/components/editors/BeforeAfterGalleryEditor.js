import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiUpload } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const BeforeAfterGalleryEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => ({
    enabled: true,
    title: 'Our Results',
    description: 'See the amazing transformations',
    items: [],
    ...card.beforeAfter
  }));
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState({ before: false, after: false });
  const [currentItem, setCurrentItem] = useState({
    title: '',
    description: '',
    beforeImage: '',
    afterImage: ''
  });

  useEffect(() => {
    if (card.beforeAfter) {
      setFormData(card.beforeAfter);
    }
  }, [card.beforeAfter?.items?.length, card.beforeAfter?.enabled, card.beforeAfter]);

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading({ ...uploading, [type]: true });
    try {
      const url = await cardService.uploadImage(file, `cards/${card.id}/before-after`);
      setCurrentItem({ ...currentItem, [`${type}Image`]: url });
      toast.success(`${type} image uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${type} image`);
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleAddItem = () => {
    if (!currentItem.beforeImage || !currentItem.afterImage) {
      toast.error('Both before and after images are required');
      return;
    }

    if (editingItem) {
      // Update existing item
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.id === editingItem.id ? { ...currentItem, id: editingItem.id } : item
        )
      });
    } else {
      // Add new item
      const newItem = { ...currentItem, id: uuidv4() };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newItem]
      });
    }

    setCurrentItem({ title: '', description: '', beforeImage: '', afterImage: '' });
    setEditingItem(null);
    setShowModal(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setCurrentItem({
      title: item.title || '',
      description: item.description || '',
      beforeImage: item.beforeImage || '',
      afterImage: item.afterImage || ''
    });
    setShowModal(true);
  };

  const handleRemoveItem = (id) => {
    if (window.confirm('Are you sure you want to delete this before/after comparison?')) {
      setFormData({
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('beforeAfter', formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setCurrentItem({ title: '', description: '', beforeImage: '', afterImage: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Enable Toggle */}
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.enabled !== false}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mr-2 w-5 h-5"
            />
            <span className="font-medium">Enable Before/After Gallery</span>
          </label>
        </div>

        {/* Gallery Settings */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gallery Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Our Results"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gallery Description</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="2"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="See the amazing transformations..."
            />
          </div>
        </div>

        {/* Gallery Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Before/After Comparisons ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setCurrentItem({ title: '', description: '', beforeImage: '', afterImage: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Add Before/After
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold">{item.title || 'Transformation'}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">BEFORE</p>
                      {item.beforeImage ? (
                        <img
                          src={item.beforeImage}
                          alt="Before"
                          className="w-full h-32 object-cover rounded border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">AFTER</p>
                      {item.afterImage ? (
                        <img
                          src={item.afterImage}
                          alt="After"
                          className="w-full h-32 object-cover rounded border-2 border-green-500"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No before/after comparisons added yet</p>
              <p className="text-sm text-gray-500">Click "Add Before/After" to showcase your transformations</p>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingItem ? 'Edit Before/After' : 'Add Before/After'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Hair Transformation, Skin Treatment Result"
                  value={currentItem.title}
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Describe the transformation..."
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Image */}
                <div className="border-2 border-dashed rounded-lg p-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Before Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'before')}
                    className="w-full text-sm"
                    disabled={uploading.before}
                  />
                  {uploading.before && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                  )}
                  {currentItem.beforeImage && (
                    <div className="mt-3">
                      <img
                        src={currentItem.beforeImage}
                        alt="Before preview"
                        className="w-full h-40 object-cover rounded border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentItem({ ...currentItem, beforeImage: '' })}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                  {!currentItem.beforeImage && !uploading.before && (
                    <div className="mt-3 bg-gray-100 rounded p-4 text-center">
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Upload before image</p>
                    </div>
                  )}
                </div>

                {/* After Image */}
                <div className="border-2 border-dashed border-green-300 rounded-lg p-4">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    After Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'after')}
                    className="w-full text-sm"
                    disabled={uploading.after}
                  />
                  {uploading.after && (
                    <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                  )}
                  {currentItem.afterImage && (
                    <div className="mt-3">
                      <img
                        src={currentItem.afterImage}
                        alt="After preview"
                        className="w-full h-40 object-cover rounded border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setCurrentItem({ ...currentItem, afterImage: '' })}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                  {!currentItem.afterImage && !uploading.after && (
                    <div className="mt-3 bg-green-50 rounded p-4 text-center">
                      <FiUpload className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Upload after image</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!currentItem.beforeImage || !currentItem.afterImage || uploading.before || uploading.after}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-medium"
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

export default BeforeAfterGalleryEditor;
