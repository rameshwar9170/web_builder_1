import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const SpecialOffersEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => card.offers || { items: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [currentOffer, setCurrentOffer] = useState({
    title: '',
    description: '',
    image: '',
    validUntil: ''
  });

  useEffect(() => {
    if (card?.offers) {
      setFormData(card.offers);
    }
  }, [card?.offers?.items?.length, card?.offers?.enabled, card?.offers]);

  const handleAddOffer = () => {
    if (!currentOffer.title) {
      toast.error('Offer title is required');
      return;
    }

    if (editingOffer) {
      // Update existing offer
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.id === editingOffer.id ? { ...currentOffer, id: editingOffer.id } : item
        )
      });
    } else {
      // Add new offer
      const newOffer = { ...currentOffer, id: uuidv4() };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newOffer]
      });
    }
    
    setCurrentOffer({ title: '', description: '', image: '', validUntil: '' });
    setEditingOffer(null);
    setShowModal(false);
  };

  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setCurrentOffer({
      title: offer.title || '',
      description: offer.description || '',
      image: offer.image || '',
      validUntil: offer.validUntil || ''
    });
    setShowModal(true);
  };

  const handleRemoveOffer = (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      const updatedData = {
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      };
      setFormData(updatedData);
      onSave('offers', updatedData);
      toast.success('Offer deleted');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if image is landscape (16:9 ratio recommended)
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = async () => {
      const aspectRatio = img.width / img.height;
      
      // Warn if not close to 16:9 (1.77)
      if (aspectRatio < 1.5 || aspectRatio > 2.0) {
        if (!window.confirm('For best results, use a landscape image with 16:9 ratio (e.g., 1920x1080). Continue anyway?')) {
          return;
        }
      }

      setUploading(true);
      try {
        const url = await cardService.uploadImage(file, `cards/${card.id}/offers`);
        setCurrentOffer({ ...currentOffer, image: url });
        toast.success('Image uploaded');
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('offers', formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOffer(null);
    setCurrentOffer({ title: '', description: '', image: '', validUntil: '' });
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
            <span className="font-medium">Enable Special Offers Section</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Special Offers ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingOffer(null);
                setCurrentOffer({ title: '', description: '', image: '', validUntil: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Add Offer
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="space-y-4">
              {formData.items.map((offer) => (
                <div key={offer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex gap-4">
                    {offer.image && (
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-64 h-36 object-cover rounded"
                        style={{ aspectRatio: '16/9' }}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{offer.title}</h4>
                          {offer.validUntil && (
                            <p className="text-sm text-gray-500">Valid until: {new Date(offer.validUntil).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditOffer(offer)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit offer"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveOffer(offer.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete offer"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{offer.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No offers added yet</p>
              <p className="text-sm text-gray-500">Click "Add Offer" to get started</p>
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
              {editingOffer ? 'Edit Offer' : 'Add Special Offer'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Offer Title *</label>
                <input
                  type="text"
                  placeholder="e.g., 50% Off on Selected Items"
                  value={currentOffer.title}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Terms and conditions, offer details..."
                  value={currentOffer.description}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Valid Until</label>
                <input
                  type="date"
                  value={currentOffer.validUntil}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, validUntil: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Banner Image (16:9 ratio recommended)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Recommended size: 1920x1080 or 1280x720 pixels
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {currentOffer.image && (
                  <div className="mt-2">
                    <img 
                      src={currentOffer.image} 
                      alt="Preview" 
                      className="w-full h-auto rounded"
                      style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentOffer({ ...currentOffer, image: '' })}
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
                  onClick={handleAddOffer}
                  disabled={!currentOffer.title || uploading}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                >
                  {editingOffer ? 'Update' : 'Add'}
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

export default SpecialOffersEditor;
