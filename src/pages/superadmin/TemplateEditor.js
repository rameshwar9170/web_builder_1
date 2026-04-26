import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { templateService } from '../../services/templateService';
import { toast } from 'react-toastify';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft } from 'react-icons/fi';

const TemplateEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    icon: '💼',
    order: 1,
    isActive: true,
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#0369a1',
      accentColor: '#075985',
      fontFamily: 'Inter',
      layout: 'modern',
      headerStyle: 'clean',
      cardStyle: 'rounded',
      buttonStyle: 'rounded'
    },
    features: [],
    sections: {
      hero: { enabled: true, style: 'modern' },
      about: { enabled: true, style: 'two-column' },
      services: { enabled: true, style: 'grid-cards' },
      products: { enabled: true, style: 'grid-shop' },
      team: { enabled: true, style: 'circular-photos' },
      gallery: { enabled: true, style: 'masonry' },
      contact: { enabled: true, style: 'inline' }
    }
  });

  const [newFeature, setNewFeature] = useState('');

  // Available section styles for each section type
  const sectionStyles = {
    hero: ['modern', 'classic', 'minimal', 'full-screen', 'video-background', 'image-overlay', 'centered', 'professional'],
    about: ['two-column', 'centered', 'story', 'mission', 'credentials', 'expertise', 'institution', 'creative'],
    services: ['grid-cards', 'list-detailed', 'icons-grid', 'professional-list', 'cards', 'packages', 'categorized'],
    products: ['grid-shop', 'showcase', 'listings', 'featured', 'tiles'],
    team: ['circular-photos', 'professional-cards', 'profiles', 'academic'],
    gallery: ['masonry', 'grid', 'lightbox', 'masonry-full'],
    contact: ['inline', 'map-sidebar', 'appointment', 'booking', 'store-locator', 'inquiry', 'consultation', 'admission', 'membership']
  };

  useEffect(() => {
    console.log('TemplateEditor mounted with templateId:', templateId);
    
    const loadTemplate = async () => {
      setInitialLoading(true);
      try {
        console.log('Loading template with ID:', templateId);
        const data = await templateService.getTemplate(templateId);
        console.log('Loaded template data:', data);
        
        if (data) {
          setFormData({
            name: data.name || '',
            category: data.category || '',
            description: data.description || '',
            icon: data.icon || '',
            order: data.order || 0,
            isActive: data.isActive !== undefined ? data.isActive : true,
            preview: data.preview || '',
            theme: data.theme || {
              primaryColor: '#0ea5e9',
              secondaryColor: '#0369a1',
              accentColor: '#0284c7',
              fontFamily: 'Inter',
              layout: 'modern',
              headerStyle: 'sticky',
              cardStyle: 'rounded',
              buttonStyle: 'rounded'
            },
            sections: data.sections || {},
            features: data.features || []
          });
        }
      } catch (error) {
        console.error('Error loading template:', error);
        toast.error('Failed to load template');
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (templateId && templateId !== 'new') {
      loadTemplate();
    } else {
      console.log('Creating new template');
      setInitialLoading(false);
    }
  }, [templateId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleThemeChange = (field, value) => {
    setFormData({
      ...formData,
      theme: {
        ...formData.theme,
        [field]: value
      }
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSectionToggle = (sectionName) => {
    setFormData({
      ...formData,
      sections: {
        ...formData.sections,
        [sectionName]: {
          ...formData.sections[sectionName],
          enabled: !formData.sections[sectionName]?.enabled
        }
      }
    });
  };

  const handleSectionStyleChange = (sectionName, style) => {
    setFormData({
      ...formData,
      sections: {
        ...formData.sections,
        [sectionName]: {
          ...formData.sections[sectionName],
          style: style
        }
      }
    });
  };

  const addCustomSection = (sectionName) => {
    if (sectionName && !formData.sections[sectionName]) {
      setFormData({
        ...formData,
        sections: {
          ...formData.sections,
          [sectionName]: { enabled: true, style: 'default' }
        }
      });
    }
  };

  const removeSection = (sectionName) => {
    const newSections = { ...formData.sections };
    delete newSections[sectionName];
    setFormData({
      ...formData,
      sections: newSections
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up the data before saving
      const dataToSave = {
        ...formData,
        features: formData.features || [],
        sections: formData.sections || {},
        theme: {
          ...formData.theme
        }
      };

      if (templateId && templateId !== 'new') {
        await templateService.updateTemplate(templateId, dataToSave);
        toast.success('Template updated successfully!');
      } else {
        const newId = await templateService.createTemplate(dataToSave);
        toast.success('Template created successfully!');
        console.log('Created template with ID:', newId);
      }
      navigate('/super-admin/templates');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading template...</p>
          </div>
        </div>
      </div>
    );
  }

  const iconOptions = ['💇', '🍽️', '🏥', '🛍️', '🏨', '💪', '📚', '🏠', '📸', '💼', '🎨', '🚗', '🏭', '🎵', '⚖️', '🏦', '✈️', '🎓', '🏢', '🔧', '💻', '📱', '🎬', '🎤', '🏃', '⚽', '🎯', '💍', '🌸', '🍕'];
  const fontOptions = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Playfair Display', 'Merriweather', 'Oswald', 'Raleway', 'Lora', 'Ubuntu', 'Nunito', 'PT Sans', 'Source Sans Pro'];
  const layoutOptions = ['modern', 'classic', 'minimal', 'elegant', 'professional', 'creative', 'luxury', 'energetic', 'academic', 'corporate', 'portfolio', 'artistic', 'tech', 'traditional'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/super-admin/templates')}
          className="mr-4 p-2 hover:bg-gray-100 rounded"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {templateId === 'new' ? 'Create New Template' : 'Edit Template'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Preview Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
          <h2 className="text-lg font-bold mb-4 text-gray-800">Template Preview</h2>
          <div className="bg-white rounded-lg p-6" style={{
            borderLeft: `4px solid ${formData.theme.primaryColor}`,
            fontFamily: formData.theme.fontFamily
          }}>
            <div className="flex items-center mb-4">
              <span className="text-5xl mr-4">{formData.icon}</span>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: formData.theme.primaryColor }}>
                  {formData.name || 'Template Name'}
                </h3>
                <p className="text-sm text-gray-600">{formData.category || 'Category'}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{formData.description || 'Template description will appear here...'}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.features?.map((feature, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: formData.theme.primaryColor + '20',
                    color: formData.theme.primaryColor
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded" style={{ backgroundColor: formData.theme.primaryColor + '10' }}>
                <div className="font-medium">Primary</div>
                <div style={{ color: formData.theme.primaryColor }}>{formData.theme.primaryColor}</div>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: formData.theme.secondaryColor + '10' }}>
                <div className="font-medium">Secondary</div>
                <div style={{ color: formData.theme.secondaryColor }}>{formData.theme.secondaryColor}</div>
              </div>
              <div className="p-2 rounded" style={{ backgroundColor: formData.theme.accentColor + '10' }}>
                <div className="font-medium">Accent</div>
                <div style={{ color: formData.theme.accentColor }}>{formData.theme.accentColor}</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2 text-xs text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded">📝 {formData.theme.layout}</span>
              <span className="px-2 py-1 bg-gray-100 rounded">🎨 {formData.theme.fontFamily}</span>
              <span className="px-2 py-1 bg-gray-100 rounded">📱 {Object.keys(formData.sections).length} sections</span>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Beauty & Wellness"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="flex gap-2">
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg text-2xl"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-20 px-4 py-2 border rounded-lg text-center text-2xl"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Brief description of this template"
              required
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active (visible to admins)</span>
            </label>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Theme & Design</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="w-16 h-10 rounded"
                />
                <input
                  type="text"
                  value={formData.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="w-16 h-10 rounded"
                />
                <input
                  type="text"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="w-16 h-10 rounded"
                />
                <input
                  type="text"
                  value={formData.theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
              <select
                value={formData.theme.fontFamily}
                onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {fontOptions.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
              <select
                value={formData.theme.layout}
                onChange={(e) => handleThemeChange('layout', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {layoutOptions.map(layout => (
                  <option key={layout} value={layout}>{layout}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Header Style</label>
              <select
                value={formData.theme.headerStyle}
                onChange={(e) => handleThemeChange('headerStyle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="clean">Clean</option>
                <option value="centered">Centered</option>
                <option value="sticky">Sticky</option>
                <option value="bold">Bold</option>
                <option value="transparent">Transparent</option>
                <option value="professional">Professional</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Style</label>
              <select
                value={formData.theme.cardStyle}
                onChange={(e) => handleThemeChange('cardStyle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="rounded">Rounded</option>
                <option value="shadow">Shadow</option>
                <option value="minimal">Minimal</option>
                <option value="elevated">Elevated</option>
                <option value="elegant">Elegant</option>
                <option value="angular">Angular</option>
                <option value="clean">Clean</option>
                <option value="property">Property</option>
                <option value="borderless">Borderless</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
              <select
                value={formData.theme.buttonStyle}
                onChange={(e) => handleThemeChange('buttonStyle', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="rounded">Rounded</option>
                <option value="rounded-full">Rounded Full</option>
                <option value="square">Square</option>
                <option value="outlined">Outlined</option>
                <option value="minimal">Minimal</option>
                <option value="sharp">Sharp</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Section Configuration</h2>
          <p className="text-sm text-gray-600 mb-4">Configure which sections are available and their default styles</p>
          
          <div className="space-y-3">
            {Object.entries(formData.sections).map(([sectionName, sectionData]) => (
              <div key={sectionName} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sectionData.enabled}
                      onChange={() => handleSectionToggle(sectionName)}
                      className="mr-3 w-5 h-5"
                    />
                    <span className="font-medium capitalize">{sectionName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(sectionName)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove section"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                {sectionData.enabled && sectionStyles[sectionName] && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Default Style:</label>
                    <select
                      value={sectionData.style}
                      onChange={(e) => handleSectionStyleChange(sectionName, e.target.value)}
                      className="w-full px-3 py-2 border rounded text-sm"
                    >
                      {sectionStyles[sectionName].map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Add Custom Section:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Section name (e.g., testimonials)"
                className="flex-1 px-3 py-2 border rounded text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSection(e.target.value.toLowerCase().trim());
                    e.target.value = '';
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  addCustomSection(input.value.toLowerCase().trim());
                  input.value = '';
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Template Features</h2>
          <p className="text-sm text-gray-600 mb-4">Add features that will be available for this template</p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="e.g., Online Booking, Service Menu"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Add Feature
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.features?.map((feature, index) => (
              <div key={index} className="flex items-center bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg">
                <span className="text-sm">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {formData.features?.length === 0 && (
            <p className="text-gray-500 text-sm italic">No features added yet</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <FiSave className="mr-2" />
            {loading ? 'Saving...' : 'Save Template'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/super-admin/templates')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TemplateEditor;
