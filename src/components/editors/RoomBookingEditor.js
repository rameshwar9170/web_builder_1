import React, { useState, useEffect } from 'react';
import { FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const RoomBookingEditor = ({ card, onSave }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (card.roomBooking) {
      setBookings(card.roomBooking.bookings || []);
    }
  }, [card]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
    toast.success(`Booking ${newStatus}`);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this booking?')) return;
    
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
    toast.success('Booking deleted');
  };

  const saveBookings = async (updatedBookings) => {
    try {
      await onSave('roomBooking', {
        enabled: true,
        bookings: updatedBookings,
        statistics: calculateStatistics(updatedBookings)
      });
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  const calculateStatistics = (bookingsList = bookings) => {
    return {
      total: bookingsList.length,
      pending: bookingsList.filter(b => b.status === 'pending').length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      cancelled: bookingsList.filter(b => b.status === 'cancelled').length,
      lastUpdated: new Date().toISOString()
    };
  };

  const stats = calculateStatistics();
  const upcomingBookings = bookings
    .filter(b => b.status !== 'completed')
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
          <div className="text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Room Bookings</h3>

        <div className="overflow-x-auto">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No bookings yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Guest</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Room</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Check-in / Check-out</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{booking.guestName}</div>
                      <div className="text-sm text-gray-500">{booking.guestPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{booking.roomType}</div>
                      <div className="text-sm text-gray-500">Room #{booking.roomNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                      <div className="text-gray-500">{new Date(booking.checkOut).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Confirm"
                          >
                            <FiCheck />
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Complete"
                          >
                            <FiCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <FiX />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomBookingEditor;
