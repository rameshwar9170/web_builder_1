import React, { useEffect, useState } from 'react';
import { templateService } from '../services/templateService';
import { FiCheck } from 'react-icons/fi';

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setError(null);
      const data = await templateService.getActiveTemplates();
      console.log('Loaded templates:', data); // Debug log
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
      setError('Failed to load templates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadTemplates}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-bold mb-2">No Templates Available</h3>
        <p className="text-gray-600 mb-4">
          Please contact your administrator to initialize templates.
        </p>
        <p className="text-sm text-gray-500">
          Super Admin can initialize templates from the "Manage Templates" page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Choose a Template</h3>
      <p className="text-gray-600 mb-6">Select a template that best fits your business type</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`relative p-4 rounded-lg border-2 transition hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
          >
            {selectedTemplate?.id === template.id && (
              <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1">
                <FiCheck size={12} />
              </div>
            )}
            
            <div 
              className="w-full h-24 rounded-lg flex items-center justify-center text-4xl mb-3"
              style={{ backgroundColor: template.theme?.primaryColor + '20' }}
            >
              {template.icon}
            </div>
            
            <h4 className="font-bold text-sm text-center mb-1">{template.name}</h4>
            <p className="text-xs text-gray-500 text-center">{template.category}</p>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center">
            <span className="text-2xl mr-2">{selectedTemplate.icon}</span>
            {selectedTemplate.name}
          </h4>
          <p className="text-sm text-gray-700 mb-3">{selectedTemplate.description}</p>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.features?.map((feature, index) => (
              <span key={index} className="text-xs bg-white px-3 py-1 rounded-full border border-blue-200">
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
