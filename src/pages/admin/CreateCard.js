import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiLoader, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import TemplateSelector from '../../components/TemplateSelector';

const CreateCard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Template, 2: Features, 3: Basic Info
  const [loading, setLoading] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [suggestedSlugs, setSuggestedSlugs] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [enabledFeatures, setEnabledFeatures] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    slug: ''
  });

  // Debounce timer
  useEffect(() => {
    if (formData.slug) {
      const timer = setTimeout(() => {
        checkSlugAvailability(formData.slug);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSlugAvailable(null);
      setSuggestedSlugs([]);
    }
  }, [formData.slug]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const checkSlugAvailability = async (slug) => {
    if (!slug) return;
    
    setCheckingSlug(true);
    try {
      const available = await cardService.isSlugAvailable(slug);
      setSlugAvailable(available);
      
      if (!available) {
        // Generate suggestions
        const suggestions = [];
        const baseSlug = slug.replace(/-\d+$/, ''); // Remove existing numbers
        
        for (let i = 1; i <= 3; i++) {
          const suggestion = `${baseSlug}-${i}`;
          const isAvailable = await cardService.isSlugAvailable(suggestion);
          if (isAvailable) {
            suggestions.push(suggestion);
          }
        }
        
        // Add random number suggestion
        const randomSuggestion = `${baseSlug}-${Math.floor(Math.random() * 9999)}`;
        const isRandomAvailable = await cardService.isSlugAvailable(randomSuggestion);
        if (isRandomAvailable) {
          suggestions.push(randomSuggestion);
        }
        
        setSuggestedSlugs(suggestions.slice(0, 3));
      } else {
        setSuggestedSlugs([]);
      }
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate slug from name
    if (name === 'name') {
      const autoSlug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleSlugChange = (e) => {
    const slug = generateSlug(e.target.value);
    setFormData({ ...formData, slug });
  };

  const applySuggestedSlug = (slug) => {
    setFormData({ ...formData, slug });
  };

  const toggleFeature = (feature) => {
    setEnabledFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    if (!formData.slug) {
      toast.error('Please enter a URL slug');
      return;
    }

    if (slugAvailable === false) {
      toast.error('This slug is already taken. Please choose another one.');
      return;
    }

    setLoading(true);

    try {
      // Double-check slug availability before creating
      const available = await cardService.isSlugAvailable(formData.slug);
      
      if (!available) {
        toast.error('This slug was just taken. Please choose another one.');
        setSlugAvailable(false);
        setLoading(false);
        return;
      }

      // Merge template theme with card data
      const cardData = {
        ...formData,
        templateId: selectedTemplate.id,
        theme: selectedTemplate.theme,
        templateFeatures: selectedTemplate.features || [], // All available features
        enabledFeatures: enabledFeatures // Currently enabled features
      };

      const cardId = await cardService.createCard(user.uid, cardData);
      toast.success('Card created successfully!');
      navigate(`/admin/cards/edit/${cardId}`);
    } catch (error) {
      toast.error('Failed to create card');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Card</h1>
      <p className="text-gray-600 mb-8">Step {step} of 3: {step === 1 ? 'Choose Template' : step === 2 ? 'Select Features' : 'Basic Information'}</p>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-2 rounded-full ml-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-2 rounded-full ml-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        {step === 1 && (
          <div>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
            
            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  setStep(2);
                  // Initialize all features as enabled by default
                  setEnabledFeatures(selectedTemplate?.features || []);
                }}
                disabled={!selectedTemplate}
                className="flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Select Features
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Customize Template Features</h2>
            <p className="text-gray-600 mb-6">
              Enable or disable features for your card. Disabled features will be hidden but can be enabled later.
            </p>

            {selectedTemplate && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{selectedTemplate.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEnabledFeatures(selectedTemplate.features || [])}
                      className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Enable All
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnabledFeatures([])}
                      className="text-sm px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Disable All
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {selectedTemplate?.features?.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => toggleFeature(feature)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    enabledFeatures.includes(feature)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        enabledFeatures.includes(feature)
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-400'
                      }`}>
                        {enabledFeatures.includes(feature) && (
                          <FiCheck className="text-white" size={14} />
                        )}
                      </div>
                      <div>
                        <span className="font-medium">{feature}</span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          enabledFeatures.includes(feature)
                            ? 'bg-green-200 text-green-800'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {enabledFeatures.includes(feature) ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplate?.features?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>This template has no customizable features.</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
              >
                Next: Basic Info
                <FiArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card URL Slug *
            </label>
            <div className="flex items-center mb-2">
              <span className="text-gray-500 mr-2">yoursite.com/card/</span>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={handleSlugChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 pr-10 ${
                    slugAvailable === true ? 'border-green-500' : 
                    slugAvailable === false ? 'border-red-500' : 
                    'border-gray-300'
                  }`}
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {checkingSlug && <FiLoader className="animate-spin text-gray-400" />}
                  {!checkingSlug && slugAvailable === true && <FiCheck className="text-green-500" />}
                  {!checkingSlug && slugAvailable === false && <FiX className="text-red-500" />}
                </div>
              </div>
            </div>
            
            {/* Availability Status */}
            {!checkingSlug && slugAvailable === true && (
              <p className="text-sm text-green-600 flex items-center">
                <FiCheck className="mr-1" /> This slug is available!
              </p>
            )}
            {!checkingSlug && slugAvailable === false && (
              <div>
                <p className="text-sm text-red-600 flex items-center mb-2">
                  <FiX className="mr-1" /> This slug is already taken
                </p>
                {suggestedSlugs.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Try these available options:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSlugs.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => applySuggestedSlug(suggestion)}
                          className="px-3 py-1 bg-white border border-yellow-300 rounded text-sm text-yellow-800 hover:bg-yellow-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {checkingSlug && (
              <p className="text-sm text-gray-500">Checking availability...</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You can add more details like email, phone, website, and business information after creating the card in the Basic Info and Contact tabs.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            <button
              type="submit"
              disabled={loading || checkingSlug || slugAvailable === false}
              className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Card'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/cards')}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default CreateCard;
