import React, { useState, useEffect } from 'react';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiGlobe, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const ContactEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => ({
    enabled: true,
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      whatsapp: '',
      telegram: '',
      tiktok: '',
      pinterest: '',
      snapchat: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    },
    ...card.contact
  }));

  useEffect(() => {
    if (card?.contact) {
      setFormData(prevData => ({
        ...prevData,
        ...card.contact,
        socialLinks: {
          ...prevData.socialLinks,
          ...card.contact.socialLinks
        },
        businessHours: {
          ...prevData.businessHours,
          ...card.contact.businessHours
        }
      }));
    }
  }, [card?.contact]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData({
      ...formData,
      socialLinks: {
        ...formData.socialLinks,
        [platform]: value
      }
    });
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: {
          ...formData.businessHours[day],
          [field]: value
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: FiFacebook, placeholder: 'https://facebook.com/yourpage' },
    { key: 'twitter', label: 'Twitter/X', icon: FiTwitter, placeholder: 'https://twitter.com/yourhandle' },
    { key: 'instagram', label: 'Instagram', icon: FiInstagram, placeholder: 'https://instagram.com/yourhandle' },
    { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
    { key: 'youtube', label: 'YouTube', icon: FiYoutube, placeholder: 'https://youtube.com/@yourchannel' },
    { key: 'whatsapp', label: 'WhatsApp', icon: FiPhone, placeholder: '+1234567890' },
    { key: 'telegram', label: 'Telegram', icon: FiGlobe, placeholder: 'https://t.me/yourusername' },
    { key: 'tiktok', label: 'TikTok', icon: FiGlobe, placeholder: 'https://tiktok.com/@yourhandle' },
    { key: 'pinterest', label: 'Pinterest', icon: FiGlobe, placeholder: 'https://pinterest.com/yourprofile' },
    { key: 'snapchat', label: 'Snapchat', icon: FiGlobe, placeholder: 'https://snapchat.com/add/yourhandle' }
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Enable Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.enabled !== false}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="mr-2 w-5 h-5"
          />
          <span className="font-medium">Enable Contact Section</span>
        </label>
      </div>

      {/* Basic Contact Information */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FiMail className="text-primary-600" />
          Basic Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="contact@business.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="https://www.yourbusiness.com"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FiMapPin className="text-primary-600" />
          Address Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Street Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="123 Main Street, Suite 100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">State/Province</label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="United States"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ZIP/Postal Code</label>
              <input
                type="text"
                value={formData.zipCode || ''}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="10001"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FiGlobe className="text-primary-600" />
          Social Media Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map(platform => (
            <div key={platform.key}>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <platform.icon className="text-gray-600" />
                {platform.label}
              </label>
              <input
                type="text"
                value={formData.socialLinks[platform.key] || ''}
                onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder={platform.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold">Business Hours</h3>

        <div className="space-y-3">
          {days.map(day => (
            <div key={day} className="flex items-center gap-4 bg-white p-3 rounded-lg">
              <div className="w-28">
                <span className="font-medium capitalize">{day}</span>
              </div>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.businessHours[day]?.closed || false}
                  onChange={(e) => handleBusinessHoursChange(day, 'closed', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Closed</span>
              </label>

              {!formData.businessHours[day]?.closed && (
                <>
                  <input
                    type="time"
                    value={formData.businessHours[day]?.open || '09:00'}
                    onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                    className="px-3 py-1 border rounded"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={formData.businessHours[day]?.close || '18:00'}
                    onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                    className="px-3 py-1 border rounded"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-medium"
      >
        Save Changes
      </button>
    </form>
  );
};

export default ContactEditor;
