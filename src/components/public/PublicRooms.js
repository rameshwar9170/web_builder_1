import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { FiX, FiUsers } from 'react-icons/fi';

const PublicRooms = ({ card }) => {
  const rooms = card.rooms;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestPhone: '',
    checkIn: '',
    checkOut: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!rooms?.enabled || !rooms?.items || rooms.items.length === 0) {
    return null;
  }

  const theme = card.theme || {};

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    if (!bookingData.guestName || !bookingData.guestPhone || !bookingData.checkIn || !bookingData.checkOut) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const booking = {
        id: uuidv4(),
        guestName: bookingData.guestName,
        guestPhone: bookingData.guestPhone,
        roomNumber: selectedRoom.roomNumber,
        roomType: selectedRoom.roomType,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const freshCard = await cardService.getCard(card.id);
      const currentBookings = freshCard.roomBooking?.bookings || [];
      const updatedBookings = [...currentBookings, booking];
      
      await cardService.updateCardSection(card.id, 'roomBooking', {
        enabled: true,
        bookings: updatedBookings,
        statistics: {
          total: updatedBookings.length,
          pending: updatedBookings.filter(b => b.status === 'pending').length,
          confirmed: updatedBookings.filter(b => b.status === 'confirmed').length,
          completed: updatedBookings.filter(b => b.status === 'completed').length,
          cancelled: updatedBookings.filter(b => b.status === 'cancelled').length
        }
      });

      toast.success('Room booking request submitted successfully!');
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBookingData({ guestName: '', guestPhone: '', checkIn: '', checkOut: '' });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>Our Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.items.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {room.image && <img src={room.image} alt={room.roomType} className="w-full h-48 object-cover" />}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold" style={{ color: theme.secondaryColor }}>{room.roomType}</h3>
                {room.price && <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>${room.price}/night</span>}
              </div>
              {room.roomNumber && <p className="text-sm text-gray-600 mb-2">Room #{room.roomNumber}</p>}
              {room.capacity && (
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FiUsers className="w-4 h-4" />
                  <span className="text-sm">Up to {room.capacity} guests</span>
                </div>
              )}
              {room.description && <p className="text-gray-600 text-sm mb-4">{room.description}</p>}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{amenity}</span>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => handleBookRoom(room)} className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium">Book Now</button>
            </div>
          </div>
        ))}
      </div>
      {showBookingModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Book {selectedRoom.roomType}</h2>
                <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-700"><FiX className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input type="text" required value={bookingData.guestName} onChange={(e) => setBookingData({ ...bookingData, guestName: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input type="tel" required value={bookingData.guestPhone} onChange={(e) => setBookingData({ ...bookingData, guestPhone: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="+1 (555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Date *</label>
                  <input type="date" required value={bookingData.checkIn} onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Check-out Date *</label>
                  <input type="date" required value={bookingData.checkOut} onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" min={bookingData.checkIn || new Date().toISOString().split('T')[0]} />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Booking Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Room:</span><span className="font-medium">{selectedRoom.roomType}</span></div>
                    <div className="flex justify-between"><span>Room Number:</span><span className="font-medium">#{selectedRoom.roomNumber}</span></div>
                    {selectedRoom.price && <div className="flex justify-between"><span>Price:</span><span className="font-medium">${selectedRoom.price}/night</span></div>}
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed">{submitting ? 'Submitting...' : 'Submit Booking Request'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicRooms;
