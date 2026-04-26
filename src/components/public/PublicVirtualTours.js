import React from 'react';

const PublicVirtualTours = ({ card }) => {
  const virtualTours = card.virtualTours;

  if (!virtualTours?.enabled || !virtualTours?.items || virtualTours.items.length === 0) {
    return null;
  }

  const theme = card.theme || {};

  const getEmbedUrl = (tour) => {
    if (tour.videoType === 'youtube') {
      return `https://www.youtube.com/embed/${tour.videoId}`;
    } else if (tour.videoType === 'vimeo') {
      return `https://player.vimeo.com/video/${tour.videoId}`;
    }
    return '';
  };

  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
        Virtual Tours
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {virtualTours.items.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getEmbedUrl(tour)}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={tour.title}
              />
            </div>
            <div className="p-6">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: theme.primaryColor }}
              >
                {tour.title}
              </h3>
              {tour.description && (
                <p className="text-gray-600 text-sm">
                  {tour.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicVirtualTours;
