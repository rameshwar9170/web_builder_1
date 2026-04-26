import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const RoomsEditor = ({ card, onSave }) => {
  const [formData, setFormData] = useState(() => card.rooms || { items: [], enabled: true });
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [currentRoom, setCurrentRoom] = useState({
    roomNumber: '',
    roomType: '',
    description: '',
    price: '',
    capacity: '',
    facilities: [],
    image: ''
  });

  const facilityOptions = ['AC', 'Non-AC', 'WiFi', 'TV', 'Mini Bar', 'Balcony', 'Sea View', 'City View', 'Attached Bathroom', 'Room Service'];

  useEffect(() => {
    if (card?.rooms) {
      setFormData(card.rooms);
    }
  }, [card?.rooms?.items?.length, card?.rooms?.enabled, card?.rooms]);

  const handleAddRoom = () => {
    if (!currentRoom.roomNumber || !currentRoom.roomType) {
      toast.error('Room number and type are required');
      return;
    }

    if (editingRoom) {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.id === editingRoom.id ? { ...currentRoom, id: editingRoom.id } : item
        )
      });
    } else {
      const newRoom = { ...currentRoom, id: uuidv4() };
      setFormData({
        ...formData,
        items: [...(formData.items || []), newRoom]
      });
    }
    
    setCurrentRoom({ roomNumber: '', roomType: '', description: '', price: '', capacity: '', facilities: [], image: '' });
    setEditingRoom(null);
    setShowModal(false);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setCurrentRoom({
      roomNumber: room.roomNumber || '',
      roomType: room.roomType || '',
      description: room.description || '',
      price: room.price || '',
      capacity: room.capacity || '',
      facilities: room.facilities || [],
      image: room.image || ''
    });
    setShowModal(true);
  };

  const handleRemoveRoom = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      const updatedData = {
        ...formData,
        items: formData.items.filter(item => item.id !== id)
      };
      setFormData(updatedData);
      onSave('rooms', updatedData);
      toast.success('Room deleted');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await cardService.uploadImage(file, `cards/${card.id}/rooms`);
      setCurrentRoom({ ...currentRoom, image: url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const toggleFacility = (facility) => {
    const facilities = currentRoom.facilities || [];
    if (facilities.includes(facility)) {
      setCurrentRoom({ ...currentRoom, facilities: facilities.filter(f => f !== facility) });
    } else {
      setCurrentRoom({ ...currentRoom, facilities: [...facilities, facility] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave('rooms', formData);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setCurrentRoom({ roomNumber: '', roomType: '', description: '', price: '', capacity: '', facilities: [], image: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.enabled !== false}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="mr-2 w-5 h-5"
            />
            <span className="font-medium">Enable Room Showcase Section</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Rooms ({formData.items?.length || 0})</h3>
            <button
              type="button"
              onClick={() => {
                setEditingRoom(null);
                setCurrentRoom({ roomNumber: '', roomType: '', description: '', price: '', capacity: '', facilities: [], image: '' });
                setShowModal(true);
              }}
              className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="mr-2" />
              Add Room
            </button>
          </div>

          {formData.items && formData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.items.map((room) => (
                <div key={room.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  {room.image && (
                    <img src={room.image} alt={room.roomType} className="w-full h-48 object-cover rounded mb-3" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{room.roomType}</h4>
                      <p className="text-sm text-gray-600">Room #{room.roomNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditRoom(room)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit room"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoom(room.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete room"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  {room.price && (
                    <p className="text-lg font-bold text-primary-600 mb-2">${room.price}/night</p>
                  )}
                  {room.capacity && (
                    <p className="text-sm text-gray-600 mb-2">Capacity: {room.capacity} guests</p>
                  )}
                  {room.facilities && room.facilities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {room.facilities.map((facility, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {facility}
                        </span>
                      ))}
                    </div>
                  )}
                  {room.description && (
                    <p className="text-gray-600 text-sm">{room.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
              <p className="text-gray-600 mb-2">No rooms added yet</p>
              <p className="text-sm text-gray-500">Click "Add Room" to get started</p>
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
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingRoom ? 'Edit Room' : 'Add Room'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Room Number *</label>
                  <input
                    type="text"
                    placeholder="e.g., 101"
                    value={currentRoom.roomNumber}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, roomNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Room Type *</label>
                  <input
                    type="text"
                    placeholder="e.g., Deluxe Suite"
                    value={currentRoom.roomType}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, roomType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price per Night</label>
                  <input
                    type="number"
                    placeholder="e.g., 150"
                    value={currentRoom.price}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, price: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Capacity (Guests)</label>
                  <input
                    type="number"
                    placeholder="e.g., 2"
                    value={currentRoom.capacity}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  placeholder="Room description..."
                  value={currentRoom.description}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Facilities</label>
                <div className="grid grid-cols-2 gap-2">
                  {facilityOptions.map((facility) => (
                    <label key={facility} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(currentRoom.facilities || []).includes(facility)}
                        onChange={() => toggleFacility(facility)}
                        className="mr-2"
                      />
                      <span className="text-sm">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                {currentRoom.image && (
                  <div className="mt-2">
                    <img src={currentRoom.image} alt="Preview" className="w-full h-48 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setCurrentRoom({ ...currentRoom, image: '' })}
                      className="mt-1 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleAddRoom}
                  disabled={!currentRoom.roomNumber || !currentRoom.roomType || uploading}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
                >
                  {editingRoom ? 'Update' : 'Add'}
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

export default RoomsEditor;
