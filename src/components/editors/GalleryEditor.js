import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const GalleryEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => card.gallery || { images: [], enabled: true });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (card?.gallery) {
      setFormData(card.gallery);
    }
  }, [card?.gallery?.images?.length, card?.gallery?.enabled, card?.gallery]);

  // Compress image to max 100KB
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions to reduce file size
          const maxDimension = 1200;
          if (width > height && width > maxDimension) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Start with quality 0.8 and reduce until under 100KB
          let quality = 0.8;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (blob.size <= 100 * 1024 || quality <= 0.1) {
                  // Under 100KB or minimum quality reached
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  });
                  console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(2)}KB -> ${(blob.size / 1024).toFixed(2)}KB`);
                  resolve(compressedFile);
                } else {
                  // Still too large, reduce quality
                  quality -= 0.1;
                  tryCompress();
                }
              },
              'image/jpeg',
              quality
            );
          };
          
          tryCompress();
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = validFiles.length;
      const uploadedImages = [];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Compress image
        toast.info(`Compressing ${file.name}...`);
        const compressedFile = await compressImage(file);
        
        // Upload compressed image
        const url = await cardService.uploadImage(compressedFile, `cards/${card.id}/gallery`);
        
        uploadedImages.push({
          id: uuidv4(),
          url,
          caption: '',
          order: (formData.images?.length || 0) + i
        });

        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      setFormData({
        ...formData,
        images: [...(formData.images || []), ...uploadedImages]
      });
      
      toast.success(`${validFiles.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = async (id) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      try {
        // Find the image to get its URL
        const imageToDelete = formData.images.find(img => img.id === id);
        
        if (imageToDelete && imageToDelete.url) {
          // Delete from storage
          try {
            await cardService.deleteImage(imageToDelete.url);
          } catch (storageError) {
            console.error('Error deleting from storage:', storageError);
            // Continue even if storage deletion fails
          }
        }
        
        // Remove from formData
        const updatedData = {
          ...formData,
          images: formData.images.filter(img => img.id !== id)
        };
        
        setFormData(updatedData);
        onSave(updatedData);
        toast.success('Image removed');
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Failed to remove image');
      }
    }
  };

  const handleCaptionChange = (id, caption) => {
    setFormData({
      ...formData,
      images: formData.images.map(img => 
        img.id === id ? { ...img, caption } : img
      )
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={formData.enabled !== false}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="mr-2 w-5 h-5"
          />
          <span className="font-medium">Enable Gallery Section</span>
        </label>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Gallery Images ({formData.images?.length || 0})</h3>
          <label className={`flex items-center px-4 py-2 rounded-lg cursor-pointer font-medium ${
            uploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}>
            <FiPlus className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>

        {uploading && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Compressing and uploading images...</span>
              <span className="text-sm font-bold text-blue-900">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-blue-700 mt-2">Images are automatically compressed to max 100KB</p>
          </div>
        )}

        {formData.images && formData.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.map((image) => (
              <div key={image.id} className="relative group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={image.url}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                  title="Remove image"
                >
                  <FiTrash2 size={16} />
                </button>
                <div className="p-2 bg-white">
                  <input
                    type="text"
                    placeholder="Add caption (optional)"
                    value={image.caption || ''}
                    onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
            <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No images in gallery</p>
            <p className="text-sm text-gray-500 mb-4">Upload images to showcase your work</p>
            <p className="text-xs text-gray-400">Images will be automatically compressed to max 100KB</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Changes
      </button>
    </form>
  );
};

export default GalleryEditor;
