import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { aiService } from '../../services/aiService';

const TeamEditor = ({ card, onSave, customLabels }) => {
  const labels = customLabels || {
    singular: 'Member',
    plural: 'Members',
    addButton: 'Add Member'
  };
  
  const [formData, setFormData] = useState(() => card.team || { members: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [currentMember, setCurrentMember] = useState({
    name: '',
    position: '',
    bio: '',
    email: '',
    phone: '',
    photo: ''
  });

  // Update formData when card.team changes (after save/reload)
  useEffect(() => {
    if (card?.team) {
      setFormData(card.team);
    }
  }, [card?.team?.members?.length, card?.team?.enabled, card?.team]);

  const handleAddMember = () => {
    if (!currentMember.name) {
      toast.error('Member name is required');
      return;
    }

    if (editingMember) {
      // Update existing member
      setFormData({
        ...formData,
        members: formData.members.map(member =>
          member.id === editingMember.id ? { ...currentMember, id: editingMember.id } : member
        )
      });
    } else {
      // Add new member
      const newMember = { ...currentMember, id: uuidv4() };
      setFormData({
        ...formData,
        members: [...(formData.members || []), newMember]
      });
    }
    
    setCurrentMember({ name: '', position: '', bio: '', email: '', phone: '', photo: '' });
    setEditingMember(null);
    setShowModal(false);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setCurrentMember({
      name: member.name || '',
      position: member.position || '',
      bio: member.bio || '',
      email: member.email || '',
      phone: member.phone || '',
      photo: member.photo || ''
    });
    setShowModal(true);
  };

  const handleRemoveMember = (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      const updatedData = {
        ...formData,
        members: formData.members.filter(member => member.id !== id)
      };
      setFormData(updatedData);
      onSave(updatedData);
      toast.success('Team member removed');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await cardService.uploadImage(file, `cards/${card.id}/team`);
      setCurrentMember({ ...currentMember, photo: url });
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Just pass formData, EditCard wrapper adds the section name
  };

  const handleGenerateWithAI = async () => {
    if (formData.members && formData.members.length > 0) {
      if (!window.confirm('This will add AI-generated team members to your existing team. Continue?')) {
        return;
      }
    }

    try {
      setGenerating(true);
      
      // Use the actual template ID from the card
      const templateId = card.templateId || 'salon-spa';
      const businessName = card.basicInfo?.businessName || 'Your Business';
      
      const aiContent = await aiService.generateAboutContent(templateId, businessName);
      
      const aiTeamMembers = aiContent.team.map(member => ({
        id: uuidv4(),
        name: member.name,
        position: member.role,
        bio: member.bio || '',
        email: '',
        phone: '',
        photo: ''
      }));
      
      // Add AI team members to existing members instead of replacing
      setFormData({
        ...formData,
        members: [...(formData.members || []), ...aiTeamMembers],
        enabled: true
      });
      
      toast.success(`${aiTeamMembers.length} AI team members added! Review and edit as needed.`);
    } catch (error) {
      console.error('Error generating AI team members:', error);
      toast.error('Failed to generate AI team members. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setCurrentMember({ name: '', position: '', bio: '', email: '', phone: '', photo: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enabled !== false}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mr-2"
            />
            <span className="font-medium">Enable Team Section</span>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{labels.plural} ({formData.members?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingMember(null);
                setCurrentMember({ name: '', position: '', bio: '', email: '', phone: '', photo: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              {labels.addButton}
            </button>
          </div>

          {formData.members && formData.members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.members.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow bg-white">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full mx-auto mb-2 bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
                      {member.name?.charAt(0)}
                    </div>
                  )}
                  <h4 className="font-bold">{member.name}</h4>
                  <p className="text-gray-600 text-sm">{member.position}</p>
                  {member.bio && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.bio}</p>}
                  <div className="flex gap-2 justify-center mt-3">
                    <button
                      type="button"
                      onClick={() => handleEditMember(member)}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      title="Edit member"
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      title="Remove member"
                    >
                      <FiTrash2 className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No {labels.plural.toLowerCase()} added yet</p>
              <p className="text-sm text-gray-500">Click "{labels.addButton}" or "Generate with AI" to get started</p>
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
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={currentMember.name}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Position/Title</label>
                <input
                  type="text"
                  placeholder="Position/Title"
                  value={currentMember.position}
                  onChange={(e) => setCurrentMember({ ...currentMember, position: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  placeholder="Bio"
                  value={currentMember.bio}
                  onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={currentMember.email}
                  onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={currentMember.phone}
                  onChange={(e) => setCurrentMember({ ...currentMember, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {currentMember.photo && (
                  <div className="mt-2">
                    <img src={currentMember.photo} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCurrentMember({ ...currentMember, photo: '' })}
                      className="mt-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!currentMember.name || uploading}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                >
                  {editingMember ? 'Update' : 'Add'}
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

export default TeamEditor;
