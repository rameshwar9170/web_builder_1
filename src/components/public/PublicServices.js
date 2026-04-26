import React from 'react';
import { FiCheck } from 'react-icons/fi';

const PublicServices = ({ card }) => {
  const services = card.services?.items || [];
  const theme = card.theme || {};

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No services available at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-xl text-gray-600">Professional services tailored for you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {service.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2" style={{ color: theme.primaryColor }}>
                {service.name}
              </h3>
              {service.price && (
                <div className="text-3xl font-bold mb-4" style={{ color: theme.secondaryColor }}>
                  {service.price}
                </div>
              )}
              <p className="text-gray-600 mb-4">{service.description}</p>
              {service.duration && (
                <p className="text-sm text-gray-500 mb-4">
                  <FiCheck className="inline mr-2" />
                  Duration: {service.duration}
                </p>
              )}
              {service.features && service.features.length > 0 && (
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <FiCheck className="mr-2 mt-1 flex-shrink-0" style={{ color: theme.primaryColor }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicServices;
