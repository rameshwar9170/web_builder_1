import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiVideo } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const VirtualToursEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => card.virtualTours || { items: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [currentTour, setCurrentTour] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (card?.virtualTours) {
      setFormData(card.virtualTours);
    }
  }, [card?.virtualTours?.items?.length, card?.virtualTours?.enabled, card?.virtualTours]);

  const extractVideoId = (url) => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return { type: 'youtube', id: youtubeMatch[1] };
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[3] };
    }

    return null;
  };

  const handleAddTour = () => {
    if (!currentTour.title) {
      toast.error('Tour title is required');
      return;
    }

    if (!currentTour.videoUrl) {
      toast.error('Video URL is required');
      return;
    }

    const videoInfo = extractVideoId(currentTour.videoUrl);
    if (!videoInfo) {
      toast.error('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    if (editingTour) {
      // Update existing tour
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.id === editingTour.id 
            ? { ...currentTour, id: editingTour.id, videoType: videoInfo.type, videoId: videoInfo.id } 
            : item
        )
      });
    } else {
      // Add new tour
      const newTour = { 
        ...currentTour, 
        id: uuidv4(),
        videoType: videoInfo.type,
        videoId: videoInfo.id
      };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newTour]
      });
    }
    
    setCurrentTour({ title: '', description: '', videoUrl: '' });
    setEditingTour(null);
    setShowModal(false);
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setCurrentTour({
      title: tour.title || '',
      description: tour.description || '',
      videoUrl: tour.videoUrl || ''
    });
    setShowModal(true);
  };

  const handleRemoveTour = (id) => {
    if (window.confirm('Are you sure you want to delete this virtual tour?')) {
      const updatedData = {
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      };
      setFormData(updatedData);
      onSave('virtualTours', updatedData);
      toast.success('Virtual tour deleted');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('virtualTours', formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTour(null);
    setCurrentTour({ title: '', description: '', videoUrl: '' });
  };

  const getEmbedUrl = (tour) => {
    if (tour.videoType === 'youtube') {
      return `https://www.youtube.com/embed/${tour.videoId}`;
    } else if (tour.videoType === 'vimeo') {
      return `https://player.vimeo.com/video/${tour.videoId}`;
    }
    return '';
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
            <span className="font-medium">Enable Virtual Tours Section</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Virtual Tours ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingTour(null);
                setCurrentTour({ title: '', description: '', videoUrl: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Add Virtual Tour
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="space-y-4">
              {formData.items.map((tour) => (
                <div key={tour.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex gap-4">
                    <div className="w-64 h-36 bg-gray-200 rounded flex items-center justify-center">
                      <iframe
                        src={getEmbedUrl(tour)}
                        className="w-full h-full rounded"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={tour.title}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{tour.title}</h4>
                          <p className="text-xs text-gray-500 capitalize">{tour.videoType} Video</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditTour(tour)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit tour"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveTour(tour.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete tour"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      {tour.description && (
                        <p className="text-gray-600 text-sm">{tour.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <FiVideo className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">No virtual tours added yet</p>
              <p className="text-sm text-gray-500">Click "Add Virtual Tour" to get started</p>
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
              {editingTour ? 'Edit Virtual Tour' : 'Add Virtual Tour'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tour Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Property Walkthrough"
                  value={currentTour.title}
                  onChange={(e) => setCurrentTour({ ...currentTour, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Brief description of the tour..."
                  value={currentTour.description}
                  onChange={(e) => setCurrentTour({ ...currentTour, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Video URL *</label>
                <input
                  type="url"
                  placeholder="YouTube or Vimeo URL"
                  value={currentTour.videoUrl}
                  onChange={(e) => setCurrentTour({ ...currentTour, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports YouTube and Vimeo URLs
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddTour}
                  disabled={!currentTour.title || !currentTour.videoUrl}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                >
                  {editingTour ? 'Update' : 'Add'}
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

export default VirtualToursEditor;
