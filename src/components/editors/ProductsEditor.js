import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const ProductsEditor = ({ card, onSave, customLabels }) => {
  const labels = customLabels || {
    singular: 'Product',
    plural: 'Products',
    addButton: 'Add Product'
  };
  
  const [formData, setFormData] = useState(() => card.products || { items: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  // Update formData when card.products changes (after save/reload)
  useEffect(() => {
    if (card?.products) {
      setFormData(card.products);
    }
  }, [card?.products?.items?.length, card?.products?.enabled, card?.products]);

  const handleAddProduct = () => {
    if (!currentProduct.name) {
      toast.error('Product name is required');
      return;
    }

    if (editingProduct) {
      // Update existing product
      setFormData({
        ...formData,
        items: formData.items.map(item => 
          item.id === editingProduct.id ? { ...currentProduct, id: editingProduct.id } : item
        )
      });
    } else {
      // Add new product
      const newProduct = { ...currentProduct, id: uuidv4() };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newProduct]
      });
    }
    
    setCurrentProduct({ name: '', description: '', price: '', category: '', image: '' });
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setCurrentProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      image: product.image || ''
    });
    setShowModal(true);
  };

  const handleRemoveProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedData = {
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      };
      setFormData(updatedData);
      onSave(updatedData);
      toast.success('Product deleted');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await cardService.uploadImage(file, `cards/${card.id}/products`);
      setCurrentProduct({ ...currentProduct, image: url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Just pass formData, EditCard wrapper adds the section name
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setCurrentProduct({ name: '', description: '', price: '', category: '', image: '' });
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
            <span className="font-medium">Enable Products Section</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{labels.plural} ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                setCurrentProduct({ name: '', description: '', price: '', category: '', image: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              {labels.addButton}
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.items.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold">{product.name}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit product"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  {product.price && <p className="font-bold text-primary-600">${product.price}</p>}
                  {product.category && <p className="text-xs text-gray-500 mt-1 capitalize">{product.category}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No {labels.plural.toLowerCase()} added yet</p>
              <p className="text-sm text-gray-500">Click "{labels.addButton}" to get started</p>
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
              {editingProduct ? `Edit ${labels.singular}` : labels.addButton}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Product Description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    placeholder="Category"
                    value={currentProduct.category}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {currentProduct.image && (
                  <img src={currentProduct.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!currentProduct.name || uploading}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                >
                  {editingProduct ? 'Update' : 'Add'}
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

export default ProductsEditor;
