import React from 'react';

const PublicCategories = ({ card }) => {
  const categories = card.categories;

  if (!categories?.enabled || !categories?.items || categories.items.length === 0) {
    return null;
  }

  const theme = card.theme || {};

  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
        Product Categories
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.items.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
          >
            {category.image && (
              <div className="h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: theme.primaryColor }}
              >
                {category.name}
              </h3>
              {category.description && (
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicCategories;
