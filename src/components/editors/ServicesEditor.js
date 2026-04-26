import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../../services/aiService';
import { toast } from 'react-toastify';

const ServicesEditor = ({ card, onSave, customLabels }) => {
  const labels = customLabels || {
    singular: 'Service',
    plural: 'Services',
    addButton: 'Add Service'
  };
  
  // Initialize from card.services
  const [formData, setFormData] = useState(() => card.services || { items: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [currentService, setCurrentService] = useState({ 
    title: '', 
    description: '', 
    price: '',
    duration: ''
  });
  const [generating, setGenerating] = useState(false);

  // Update formData when card.services changes (after save/reload)
  useEffect(() => {
    console.log('ServicesEditor useEffect triggered, card.services:', card?.services);
    if (card?.services) {
      console.log('Updating formData from card.services');
      setFormData(card.services);
    }
  }, [card?.services?.items?.length, card?.services?.enabled, card?.services]); // Only update when items count or enabled changes

  const handleAddService = () => {
    if (!currentService.title) {
      toast.error('Service title is required');
      return;
    }

    if (editingService) {
      // Update existing service
      setFormData({
        ...formData,
        items: formData.items.map(item => 
          item.id === editingService.id ? { ...currentService, id: editingService.id } : item
        )
      });
    } else {
      // Add new service
      const newService = { ...currentService, id: uuidv4() };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newService]
      });
    }
    
    setCurrentService({ title: '', description: '', price: '', duration: '' });
    setEditingService(null);
    setShowModal(false);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setCurrentService({
      title: service.title || '',
      description: service.description || '',
      price: service.price || '',
      duration: service.duration || ''
    });
    setShowModal(true);
  };

  const handleRemoveService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updatedData = {
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      };
      setFormData(updatedData);
      onSave(updatedData);
      toast.success('Service deleted');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('ServicesEditor handleSubmit called with formData:', formData);
    try {
      await onSave(formData); // Just pass formData, EditCard wrapper adds the section name
      console.log('Save completed successfully');
    } catch (error) {
      console.error('Save error in ServicesEditor:', error);
      toast.error('Failed to save services');
    }
  };

  const handleGenerateWithAI = async () => {
    if (formData.items && formData.items.length > 0) {
      if (!window.confirm('This will add AI-generated services to your existing services. Continue?')) {
        return;
      }
    }

    try {
      setGenerating(true);
      
      // Use the actual template ID from the card
      const templateId = card.templateId || 'salon-spa';
      const businessName = card.basicInfo?.businessName || 'Your Business';
      
      const aiContent = await aiService.generateAboutContent(templateId, businessName);
      
      const aiServices = aiContent.services.map(service => ({
        id: uuidv4(),
        title: service.name,
        description: service.description,
        price: service.price || '',
        duration: service.duration || ''
      }));
      
      // Add AI services to existing services instead of replacing
      setFormData({
        ...formData,
        items: [...(formData.items || []), ...aiServices],
        enabled: true
      });
      
      toast.success(`${aiServices.length} AI services added! Review and edit as needed.`);
    } catch (error) {
      console.error('Error generating AI services:', error);
      toast.error('Failed to generate AI services. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setCurrentService({ title: '', description: '', price: '', duration: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enabled !== false}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mr-2 w-5 h-5"
            />
            <span className="font-medium">Enable Services Section</span>
          </label>
          
          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{labels.plural} ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingService(null);
                setCurrentService({ title: '', description: '', price: '', duration: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              {labels.addButton}
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="space-y-4">
              {formData.items.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-lg">{service.title}</h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditService(service)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="Edit service"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(service.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                            title="Delete service"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <div className="flex gap-4 text-sm">
                        {service.price && (
                          <span className="font-semibold text-primary-600">{service.price}</span>
                        )}
                        {service.duration && (
                          <span className="text-gray-500">⏱ {service.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No {labels.plural.toLowerCase()} added yet</p>
              <p className="text-sm text-gray-500">Click "{labels.addButton}" or "Generate with AI" to get started</p>
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
              {editingService ? `Edit ${labels.singular}` : labels.addButton}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Hair Styling & Cut"
                  value={currentService.title}
                  onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Describe your service..."
                  value={currentService.description}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="text"
                    placeholder="e.g., $45 - $85"
                    value={currentService.price}
                    onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 60 minutes"
                    value={currentService.duration}
                    onChange={(e) => setCurrentService({ ...currentService, duration: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddService}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  {editingService ? 'Update' : 'Add'}
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

export default ServicesEditor;
