import React, { useState } from 'react';

const ThemeEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(card.theme || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <input
            type="color"
            value={formData.primaryColor || '#0ea5e9'}
            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
            className="w-full h-12 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
          <input
            type="color"
            value={formData.secondaryColor || '#0369a1'}
            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
            className="w-full h-12 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
          <select
            value={formData.fontFamily || 'Inter'}
            onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Montserrat">Montserrat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
          <select
            value={formData.layout || 'modern'}
            onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="minimal">Minimal</option>
            <option value="creative">Creative</option>
          </select>
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

export default ThemeEditor;
