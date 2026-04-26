import React, { useState } from 'react';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { aiService } from '../../services/aiService';

const BasicInfoEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(card.basicInfo || {});
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await cardService.uploadImage(file, `cards/${card.id}`);
      setFormData({ ...formData, [field]: url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleGenerateTagline = async () => {
    if (!formData.businessName) {
      toast.error('Please enter a business name first');
      return;
    }

    try {
      setGenerating(true);
      
      const businessType = card.templateId || 'salon-spa';
      const businessName = formData.businessName || 'Your Business';
      
      // Generate AI content to get tagline
      const aiContent = await aiService.generateAboutContent(businessType, businessName);
      
      // Extract a tagline from the description (first sentence)
      const tagline = aiContent.description.split('.')[0] + '.';
      
      setFormData({ ...formData, tagline });
      toast.success('AI tagline generated! Review and edit as needed.');
    } catch (error) {
      console.error('Error generating tagline:', error);
      toast.error('Failed to generate tagline. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Your business name"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Tagline / Slogan</label>
          <button
            type="button"
            onClick={handleGenerateTagline}
            disabled={generating}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </div>
        <input
          type="text"
          name="tagline"
          value={formData.tagline || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Your catchy tagline or slogan"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'profileImage')}
            className="w-full"
            disabled={uploading}
          />
          {formData.profileImage && (
            <img src={formData.profileImage} alt="Profile" className="mt-2 w-32 h-32 object-cover rounded-full" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'logo')}
            className="w-full"
            disabled={uploading}
          />
          {formData.logo && (
            <img src={formData.logo} alt="Logo" className="mt-2 w-32 h-32 object-contain" />
          )}
        </div>
      </div>

      <button
        type="submit"
        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
      >
        Save Changes
      </button>
    </form>
  );
};

export default BasicInfoEditor;
