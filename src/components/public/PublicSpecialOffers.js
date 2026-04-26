import React from 'react';
import { FiClock } from 'react-icons/fi';

const PublicSpecialOffers = ({ card }) => {
  const offers = card.offers;

  if (!offers?.enabled || !offers?.items || offers.items.length === 0) {
    return null;
  }

  const theme = card.theme || {};

  // Filter out expired offers
  const activeOffers = offers.items.filter(offer => {
    if (!offer.validUntil) return true;
    return new Date(offer.validUntil) >= new Date();
  });

  if (activeOffers.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
        Special Offers
      </h2>
      
      <div className="space-y-8">
        {activeOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {offer.image && (
              <div className="w-full" style={{ aspectRatio: '16/9' }}>
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3
                className="text-2xl font-bold mb-3"
                style={{ color: theme.primaryColor }}
              >
                {offer.title}
              </h3>
              {offer.description && (
                <p className="text-gray-600 mb-4">
                  {offer.description}
                </p>
              )}
              {offer.validUntil && (
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-2" />
                  <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicSpecialOffers;
