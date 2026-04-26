import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const PublicBeforeAfterGallery = ({ card }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const beforeAfter = card.beforeAfter || {};
  const items = beforeAfter.items || [];

  // Don't show if explicitly disabled or no items
  if (beforeAfter.enabled === false || items.length === 0) {
    return null;
  }

  const handleMouseMove = (e) => {
    if (!selectedItem) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e) => {
    if (!selectedItem) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{beforeAfter.title || 'Our Results'}</h2>
        {beforeAfter.description && (
          <p className="text-xl text-gray-600">{beforeAfter.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setSliderPosition(50);
            }}
            className="cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              {/* Before/After Preview */}
              <div className="relative h-64">
                <img
                  src={item.beforeImage}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                >
                  <img
                    src={item.afterImage}
                    alt="After"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                
                {/* Divider Line */}
                <div className="absolute inset-y-0 left-1/2 w-1 bg-white shadow-lg transform -translate-x-1/2">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-gray-400"></div>
                      <div className="w-1 h-4 bg-gray-400"></div>
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                  BEFORE
                </div>
                <div className="absolute top-2 right-2 bg-green-600 bg-opacity-90 text-white px-2 py-1 rounded text-xs font-medium">
                  AFTER
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view
                  </span>
                </div>
              </div>

              {/* Item Info */}
              {(item.title || item.description) && (
                <div className="p-4 bg-white">
                  {item.title && <h3 className="font-bold mb-1">{item.title}</h3>}
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <FiX className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full">
            {(selectedItem.title || selectedItem.description) && (
              <div className="text-center mb-4 text-white">
                {selectedItem.title && <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>}
                {selectedItem.description && <p className="text-gray-300">{selectedItem.description}</p>}
              </div>
            )}

            <div
              className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-ew-resize select-none"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Before Image (Full) */}
              <img
                src={selectedItem.beforeImage}
                alt="Before"
                className="absolute inset-0 w-full h-full object-contain"
                draggable="false"
              />

              {/* After Image (Clipped) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={selectedItem.afterImage}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable="false"
                />
              </div>

              {/* Slider Line */}
              <div
                className="absolute inset-y-0 w-1 bg-white shadow-2xl"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <div className="flex gap-1">
                    <div className="w-1 h-6 bg-gray-600"></div>
                    <div className="w-1 h-6 bg-gray-600"></div>
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded font-medium">
                BEFORE
              </div>
              <div className="absolute top-4 right-4 bg-green-600 bg-opacity-90 text-white px-3 py-2 rounded font-medium">
                AFTER
              </div>
            </div>

            <p className="text-center text-white mt-4 text-sm">
              Drag the slider or move your mouse to compare
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicBeforeAfterGallery;
