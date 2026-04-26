import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { FiEye, FiCopy, FiExternalLink, FiShare2 } from 'react-icons/fi';
import BasicInfoEditor from '../../components/editors/BasicInfoEditor';
import AboutEditor from '../../components/editors/AboutEditor';
import ServicesEditor from '../../components/editors/ServicesEditor';
import ProductsEditor from '../../components/editors/ProductsEditor';
import TeamEditor from '../../components/editors/TeamEditor';
import GalleryEditor from '../../components/editors/GalleryEditor';
import ContactEditor from '../../components/editors/ContactEditor';
import ThemeEditor from '../../components/editors/ThemeEditor';
import DynamicFeatureEditor from '../../components/editors/DynamicFeatureEditor';
import OnlineBookingEditor from '../../components/editors/OnlineBookingEditor';
import TableBookingEditor from '../../components/editors/TableBookingEditor';
import OnlineOrdersEditor from '../../components/editors/OnlineOrdersEditor';
import BeforeAfterGalleryEditor from '../../components/editors/BeforeAfterGalleryEditor';
import CategoriesEditor from '../../components/editors/CategoriesEditor';
import SpecialOffersEditor from '../../components/editors/SpecialOffersEditor';
import VirtualToursEditor from '../../components/editors/VirtualToursEditor';
import RoomsEditor from '../../components/editors/RoomsEditor';
import RoomBookingEditor from '../../components/editors/RoomBookingEditor';
import AdmissionFormEditor from '../../components/editors/AdmissionFormEditor';
import PremiumWebEditor from '../../components/editors/PremiumWebEditor';
import { getFeatureConfig } from '../../constants/featureConfigs';

const EditCard = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (card?.isPremium && activeTab === 'basic') {
      setActiveTab('premium-design');
    }
  }, [card, activeTab]);
  const [showFeatureManager, setShowFeatureManager] = useState(false);

  useEffect(() => {
    loadCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId]);

  const loadCard = async () => {
    try {
      const data = await cardService.getCard(cardId);
      setCard(data);
    } catch (error) {
      toast.error('Failed to load card');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section, data) => {
    console.log('EditCard handleSave called:', { section, data });
    try {
      await cardService.updateCardSection(cardId, section, data);
      console.log('Save successful');
      toast.success('Changes saved');
      await loadCard();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save changes');
      throw error; // Re-throw so the editor knows it failed
    }
  };

  const handleGlobalUpdate = async (updates) => {
    try {
      await cardService.updateCard(cardId, updates);
      toast.success('Elite Experience updated');
      await loadCard();
    } catch (error) {
      toast.error('Failed to update experience');
    }
  };

  const toggleFeature = async (feature) => {
    try {
      const currentFeatures = card.enabledFeatures || [];
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter(f => f !== feature)
        : [...currentFeatures, feature];

      await cardService.updateCard(cardId, { enabledFeatures: newFeatures });
      toast.success('Features updated');
      loadCard();
    } catch (error) {
      toast.error('Failed to update features');
    }
  };

  const getEnabledTabs = () => {
    const tabs = [];

    // Specialized Premium Design Tab First
    if (card?.isPremium) {
      tabs.push({ id: 'premium-design', label: 'Premium Design', type: 'premium' });
    }

    tabs.push(
      { id: 'basic', label: 'Basic Info', type: 'default' },
      { id: 'about', label: 'About', type: 'default' },
      { id: 'gallery', label: 'Gallery', type: 'default' },
      { id: 'contact', label: 'Contact', type: 'default' }
    );

    // Add tabs for enabled features
    const enabledFeatures = card?.enabledFeatures || [];
    const addedTabs = new Set();

    enabledFeatures.forEach(feature => {
      const config = getFeatureConfig(feature);
      if (!config) return;

      // Use feature name as tab label
      const tabId = `feature-${feature.toLowerCase().replace(/\s+/g, '-')}`;

      if (!addedTabs.has(tabId)) {
        tabs.push({
          id: tabId,
          label: feature, // Use exact feature name
          type: config.useCustomEditor ? 'custom' : config.useExistingEditor ? 'existing' : 'dynamic',
          feature: feature,
          config: config,
          editorComponent: config.useCustomEditor
        });
        addedTabs.add(tabId);
      }
    });

    // Always add theme tab at the end
    tabs.push({ id: 'theme', label: 'Theme', type: 'default' });

    return tabs;
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message || 'Link copied to clipboard!');
  };

  const getCardUrl = (isPreview = false) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/card/${card.slug}${isPreview ? '?preview=true' : ''}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const tabs = getEnabledTabs();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Card</h1>
          <p className="text-gray-600 mt-1">
            Status: <span className={`font-medium ${card.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>
              {card.status}
            </span>
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowFeatureManager(!showFeatureManager)}
            className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <FiShare2 className="mr-2" />
            Manage Features
          </button>
          <button
            onClick={() => window.open(getCardUrl(true), '_blank')}
            className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            <FiEye className="mr-2" />
            Preview
          </button>
          {card.status === 'published' && (
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: card.basicInfo?.name || 'Digital Card',
                    text: 'Check out my digital visiting card!',
                    url: getCardUrl()
                  });
                } else {
                  copyToClipboard(getCardUrl(), 'Public link copied!');
                }
              }}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <FiShare2 className="mr-2" />
              Share
            </button>
          )}
        </div>
      </div>

      {/* Feature Manager Modal */}
      {showFeatureManager && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Card Features</h2>
            <button
              onClick={() => setShowFeatureManager(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Enable or disable features for your card. Disabled features will be hidden but can be enabled anytime.
          </p>

          {card.templateFeatures && card.templateFeatures.length > 0 && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await cardService.updateCard(cardId, { enabledFeatures: card.templateFeatures });
                    toast.success('All features enabled');
                    loadCard();
                  } catch (error) {
                    toast.error('Failed to update features');
                  }
                }}
                className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await cardService.updateCard(cardId, { enabledFeatures: [] });
                    toast.success('All features disabled');
                    loadCard();
                  } catch (error) {
                    toast.error('Failed to update features');
                  }
                }}
                className="text-sm px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Disable All
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {card.templateFeatures?.map((feature, index) => {
              const isEnabled = card.enabledFeatures?.includes(feature);
              return (
                <div
                  key={index}
                  onClick={() => toggleFeature(feature)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${isEnabled
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${isEnabled
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-400'
                        }`}>
                        {isEnabled && (
                          <FiCopy className="text-white" size={14} />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium">{feature}</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${isEnabled
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-600'
                          }`}>
                          {isEnabled ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {(!card.templateFeatures || card.templateFeatures.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No features available for this template.</p>
              <p className="text-sm mt-2">This card was created with an older template version.</p>
            </div>
          )}
        </div>
      )}

      {/* Card Link Section for Published Cards */}
      {card.status === 'published' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-green-900 mb-2">🎉 Your card is live!</h3>
              <p className="text-sm text-green-700 mb-3">Share this link with your contacts:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={getCardUrl()}
                  readOnly
                  className="flex-1 px-3 py-2 border border-green-300 rounded bg-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(getCardUrl(), 'Public link copied!')}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  <FiCopy className="mr-2" />
                  Copy
                </button>
                <a
                  href={getCardUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  <FiExternalLink className="mr-2" />
                  Open
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {card.status === 'draft' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            <strong>Draft Mode:</strong> This card is not public yet. Publish it from the "My Cards" page to share it with others.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'basic' && (
            <BasicInfoEditor card={card} onSave={(data) => handleSave('basicInfo', data)} />
          )}
          {activeTab === 'about' && (
            <AboutEditor card={card} onSave={(data) => handleSave('about', data)} />
          )}
          {activeTab === 'gallery' && (
            <GalleryEditor card={card} onSave={(data) => handleSave('gallery', data)} />
          )}
          {activeTab === 'contact' && (
            <ContactEditor card={card} onSave={(data) => handleSave('contact', data)} />
          )}
          {activeTab === 'theme' && (
            <ThemeEditor card={card} onSave={(data) => handleSave('theme', data)} />
          )}
          {activeTab === 'premium-design' && (
            <PremiumWebEditor card={card} onSave={handleSave} onGlobalSave={handleGlobalUpdate} />
          )}

          {/* Dynamic feature tabs */}
          {activeTab.startsWith('feature-') && (() => {
            const currentTab = tabs.find(t => t.id === activeTab);
            if (!currentTab) return null;

            // Custom editor components
            if (currentTab.type === 'custom') {
              if (currentTab.editorComponent === 'OnlineBookingEditor') {
                return <OnlineBookingEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'TableBookingEditor') {
                return <TableBookingEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'OnlineOrdersEditor') {
                return <OnlineOrdersEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'BeforeAfterGalleryEditor') {
                return <BeforeAfterGalleryEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'CategoriesEditor') {
                return <CategoriesEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'SpecialOffersEditor') {
                return <SpecialOffersEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'VirtualToursEditor') {
                return <VirtualToursEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'RoomsEditor') {
                return <RoomsEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'RoomBookingEditor') {
                return <RoomBookingEditor card={card} onSave={handleSave} />;
              }
              if (currentTab.editorComponent === 'AdmissionFormEditor') {
                return <AdmissionFormEditor card={card} onSave={handleSave} />;
              }
            }

            // Existing editors
            if (currentTab.type === 'existing') {
              const dataKey = currentTab.config.dataKey;
              const customLabels = currentTab.config.customLabels;
              if (dataKey === 'services') {
                return <ServicesEditor card={card} onSave={(data) => handleSave('services', data)} customLabels={customLabels} />;
              }
              if (dataKey === 'products') {
                return <ProductsEditor card={card} onSave={(data) => handleSave('products', data)} customLabels={customLabels} />;
              }
              if (dataKey === 'team') {
                return <TeamEditor card={card} onSave={(data) => handleSave('team', data)} customLabels={customLabels} />;
              }
              if (dataKey === 'gallery') {
                return <GalleryEditor card={card} onSave={(data) => handleSave('gallery', data)} />;
              }
            }

            // Dynamic form-based editors
            if (currentTab.type === 'dynamic') {
              return (
                <DynamicFeatureEditor
                  feature={currentTab.config}
                  card={card}
                  onSave={handleSave}
                />
              );
            }

            return null;
          })()}
        </div>
      </div>
    </div>
  );
};

export default EditCard;
