import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';

const DynamicFeatureEditor = ({ feature, card, onSave }) => {
  const [formData, setFormData] = useState(card[feature.dataKey] || feature.defaultData || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(feature.dataKey, formData);
    } finally {
      setLoading(false);
    }
  };

  // Special handling for Clinic Hours - display business hours from contact
  if (feature.useReadOnly && feature.dataKey === 'clinicHours') {
    const businessHours = card.contact?.businessHours || {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const formatTime = (time) => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-bold text-lg mb-4">Operating Hours</h4>
          <p className="text-sm text-gray-600 mb-4">
            These hours are automatically synced from your Contact tab. To update them, go to the Contact tab and modify the Business Hours section.
          </p>
          
          <div className="space-y-2">
            {days.map(day => {
              const dayHours = businessHours[day] || { open: '09:00', close: '18:00', closed: false };
              return (
                <div key={day} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <span className="font-medium capitalize w-32">{day}</span>
                  <span className={`${dayHours.closed ? 'text-red-600' : 'text-green-600'}`}>
                    {dayHours.closed ? 'Closed' : `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This section automatically displays the business hours you've set in the Contact tab. 
            Any changes made in the Contact tab will be reflected here automatically.
          </p>
        </div>
      </div>
    );
  }

  // Special handling for Store Location - display address from contact
  if (feature.useReadOnly && feature.dataKey === 'location') {
    const address = card.contact?.address || '';
    const city = card.contact?.city || '';
    const state = card.contact?.state || '';
    const country = card.contact?.country || '';
    const zipCode = card.contact?.zipCode || '';
    
    const fullAddress = [address, city, state, zipCode, country].filter(Boolean).join(', ');

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-bold text-lg mb-4">Store Address</h4>
          <p className="text-sm text-gray-600 mb-4">
            This address is automatically synced from your Contact tab. To update it, go to the Contact tab and modify the Address section.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              {fullAddress || 'No address set. Please add your address in the Contact tab.'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps URL
          </label>
          <input
            type="url"
            value={formData.mapUrl || ''}
            onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="https://maps.google.com/..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste the Google Maps URL for your store location
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
        >
          <FiSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    );
  }

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            rows={field.rows || 4}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={field.placeholder}
            required={field.required}
          />
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
              className="mr-2"
            />
            <span>{field.label}</span>
          </label>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
        <p className="text-sm text-gray-600">{feature.description}</p>
      </div>

      {feature.fields && feature.fields.map((field, index) => (
        <div key={index}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          {renderField(field)}
          {field.help && <p className="text-xs text-gray-500 mt-1">{field.help}</p>}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
      >
        <FiSave className="mr-2" />
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default DynamicFeatureEditor;
