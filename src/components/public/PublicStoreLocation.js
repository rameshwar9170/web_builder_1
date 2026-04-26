import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const PublicStoreLocation = ({ card }) => {
  const location = card.location;
  const contact = card.contact;

  if (!location || !contact) {
    return null;
  }

  const theme = card.theme || {};

  // Build full address from contact
  const address = contact.address || '';
  const city = contact.city || '';
  const state = contact.state || '';
  const country = contact.country || '';
  const zipCode = contact.zipCode || '';
  
  const fullAddress = [address, city, state, zipCode, country].filter(Boolean).join(', ');

  if (!fullAddress && !location.mapUrl) {
    return null;
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
        Store Location
      </h2>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {location.mapUrl && (
          <div className="w-full h-96">
            <iframe
              src={location.mapUrl.replace('/maps/', '/maps/embed/')}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location Map"
            />
          </div>
        )}
        
        {fullAddress && (
          <div className="p-6">
            <div className="flex items-start gap-3">
              <FiMapPin className="text-2xl mt-1" style={{ color: theme.primaryColor }} />
              <div>
                <h3 className="font-bold text-xl mb-2" style={{ color: theme.primaryColor }}>
                  Visit Us
                </h3>
                <p className="text-gray-700 text-lg">
                  {fullAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicStoreLocation;
