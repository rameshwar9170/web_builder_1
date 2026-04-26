import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templateService } from '../../services/templateService';
import { DEFAULT_TEMPLATES } from '../../data/defaultTemplates';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const ManageTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await templateService.getAllTemplates();
      console.log('Loaded templates:', data);
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultTemplates = async () => {
    setLoading(true);
    try {
      let successCount = 0;
      for (const template of DEFAULT_TEMPLATES) {
        try {
          // Use the template's ID as the document ID
          await templateService.createTemplate(template);
          successCount++;
          console.log(`Initialized template: ${template.id} - ${template.name}`);
        } catch (error) {
          console.error(`Failed to initialize template ${template.id}:`, error);
        }
      }
      toast.success(`${successCount} templates initialized successfully!`);
      loadTemplates();
    } catch (error) {
      console.error('Error initializing templates:', error);
      toast.error('Failed to initialize templates');
    } finally {
      setLoading(false);
    }
  };

  const resyncTemplates = async () => {
    if (!window.confirm('This will update all templates from defaults. Any custom changes will be overwritten. Continue?')) {
      return;
    }
    
    setLoading(true);
    try {
      let successCount = 0;
      for (const template of DEFAULT_TEMPLATES) {
        try {
          // Check if template exists
          const existing = await templateService.getTemplate(template.id);
          if (existing) {
            // Update existing template
            await templateService.updateTemplate(template.id, template);
            console.log(`Updated template: ${template.id}`);
          } else {
            // Create new template
            await templateService.createTemplate(template);
            console.log(`Created template: ${template.id}`);
          }
          successCount++;
        } catch (error) {
          console.error(`Failed to sync template ${template.id}:`, error);
        }
      }
      toast.success(`${successCount} templates synced successfully!`);
      loadTemplates();
    } catch (error) {
      console.error('Error syncing templates:', error);
      toast.error('Failed to sync templates');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (templateId, currentStatus) => {
    try {
      await templateService.toggleTemplateStatus(templateId, !currentStatus);
      toast.success('Template status updated');
      loadTemplates();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateService.deleteTemplate(templateId);
        toast.success('Template deleted');
        loadTemplates();
      } catch (error) {
        toast.error('Failed to delete template');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Templates</h1>
          <p className="text-gray-600 mt-1">Control which templates are available to admins</p>
        </div>
        <div className="flex gap-3">
          {templates.length === 0 && (
            <button
              onClick={initializeDefaultTemplates}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <FiPlus className="mr-2" />
              Initialize Default Templates
            </button>
          )}
          {templates.length > 0 && (
            <button
              onClick={resyncTemplates}
              className="flex items-center bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Re-sync from Defaults
            </button>
          )}
          <button
            onClick={() => navigate('/super-admin/templates/new')}
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            <FiPlus className="mr-2" />
            Create New Template
          </button>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold mb-2">No Templates Yet</h3>
          <p className="text-gray-600 mb-6">
            Initialize the default templates to get started with 10 pre-built templates for Indian businesses
          </p>
          <button
            onClick={initializeDefaultTemplates}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Initialize Default Templates
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
              <div 
                className="h-32 flex items-center justify-center text-6xl"
                style={{ backgroundColor: template.theme?.primaryColor || '#0ea5e9' }}
              >
                {template.icon}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category}</p>
                    <p className="text-xs text-gray-400 mt-1">ID: {template.id}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {template.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.features?.slice(0, 3).map((feature, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log('Editing template:', template.id);
                      navigate(`/super-admin/templates/edit/${template.id}`);
                    }}
                    className="flex-1 flex items-center justify-center bg-primary-100 text-primary-700 py-2 rounded hover:bg-primary-200"
                    title="Edit"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => toggleStatus(template.id, template.isActive)}
                    className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
                    title={template.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {template.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTemplates;
