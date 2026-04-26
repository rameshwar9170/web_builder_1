import React, { useState } from 'react';
import { aiService } from '../../services/aiService';

const AboutEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(card.about || {});
  const [generating, setGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleGenerateWithAI = async () => {
    try {
      setGenerating(true);
      
      // Get business type from card template
      const businessType = card.templateId || 'salon-spa';
      const businessName = card.basicInfo?.businessName || 'Your Business';
      
      // Generate AI content
      const aiContent = await aiService.generateAboutContent(businessType, businessName);
      
      // Update form data with AI generated content
      setFormData({
        ...formData,
        description: aiContent.description,
        mission: aiContent.mission,
        vision: aiContent.vision,
        enabled: true
      });
      
      alert('AI content generated successfully! Review and edit as needed.');
    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Failed to generate AI content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enabled !== false}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="mr-2"
          />
          <span className="font-medium">Enable About Section</span>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="6"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Tell your story..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mission</label>
        <textarea
          value={formData.mission || ''}
          onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Your mission statement..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
        <textarea
          value={formData.vision || ''}
          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
          rows="4"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Your vision statement..."
        />
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

export default AboutEditor;
