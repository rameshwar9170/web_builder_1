import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const OnlineBookingEditor = ({ card, onSave }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    allowBooking: true,
    maxBookingsPerDay: 10,
    bookingDuration: 60, // minutes
    workingHours: {
      start: '09:00',
      end: '18:00'
    },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    advanceBookingDays: 30,
    requireApproval: false
  });

  const [bookings, setBookings] = useState([]);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    service: '',
    notes: '',
    status: 'pending'
  });

  useEffect(() => {
    if (card.onlineBooking) {
      setSettings(card.onlineBooking.settings || settings);
      setBookings(card.onlineBooking.bookings || []);
    }
  }, [card, settings]);

  const handleSaveSettings = async () => {
    try {
      await onSave('onlineBooking', {
        settings,
        bookings,
        statistics: calculateStatistics()
      });
      toast.success('Booking settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleAddBooking = () => {
    if (!newBooking.customerName || !newBooking.date || !newBooking.time) {
      toast.error('Please fill required fields');
      return;
    }

    const booking = {
      id: Date.now().toString(),
      ...newBooking,
      createdAt: new Date().toISOString(),
      status: settings.requireApproval ? 'pending' : 'confirmed'
    };

    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    setNewBooking({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      service: '',
      notes: '',
      status: 'pending'
    });
    setShowNewBooking(false);
    
    saveBookings(updatedBookings);
  };

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
      await onSave('onlineBooking', {
        settings,
        bookings: updatedBookings,
        statistics: calculateStatistics(updatedBookings)
      });
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  const calculateStatistics = (bookingsList = bookings) => {
    const now = new Date();
    const thisMonth = bookingsList.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear();
    });

    return {
      total: bookingsList.length,
      pending: bookingsList.filter(b => b.status === 'pending').length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      cancelled: bookingsList.filter(b => b.status === 'cancelled').length,
      thisMonth: thisMonth.length,
      lastUpdated: new Date().toISOString()
    };
  };

  const stats = calculateStatistics();
  const upcomingBookings = bookings
    .filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
          <div className="text-2xl font-bold text-gray-600">{stats.thisMonth}</div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Booking Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Max Bookings Per Day</label>
            <input
              type="number"
              value={settings.maxBookingsPerDay}
              onChange={(e) => setSettings({...settings, maxBookingsPerDay: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Booking Duration (minutes)</label>
            <input
              type="number"
              value={settings.bookingDuration}
              onChange={(e) => setSettings({...settings, bookingDuration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
              min="15"
              step="15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Working Hours Start</label>
            <input
              type="time"
              value={settings.workingHours.start}
              onChange={(e) => setSettings({
                ...settings,
                workingHours: {...settings.workingHours, start: e.target.value}
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Working Hours End</label>
            <input
              type="time"
              value={settings.workingHours.end}
              onChange={(e) => setSettings({
                ...settings,
                workingHours: {...settings.workingHours, end: e.target.value}
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Advance Booking Days</label>
            <input
              type="number"
              value={settings.advanceBookingDays}
              onChange={(e) => setSettings({...settings, advanceBookingDays: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
              min="1"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => setSettings({...settings, requireApproval: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm font-medium">Require Admin Approval</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          <FiSave className="inline mr-2" />
          Save Settings
        </button>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Bookings</h3>
          <button
            onClick={() => setShowNewBooking(!showNewBooking)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FiPlus className="inline mr-2" />
            New Booking
          </button>
        </div>

        {/* New Booking Form */}
        {showNewBooking && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-4">
            <h4 className="font-bold mb-3">Add New Booking</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Customer Name *"
                value={newBooking.customerName}
                onChange={(e) => setNewBooking({...newBooking, customerName: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newBooking.customerEmail}
                onChange={(e) => setNewBooking({...newBooking, customerEmail: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newBooking.customerPhone}
                onChange={(e) => setNewBooking({...newBooking, customerPhone: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="date"
                value={newBooking.date}
                onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                className="px-3 py-2 border rounded"
                min={new Date().toISOString().split('T')[0]}
              />
              <input
                type="time"
                value={newBooking.time}
                onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Service"
                value={newBooking.service}
                onChange={(e) => setNewBooking({...newBooking, service: e.target.value})}
                className="px-3 py-2 border rounded"
              />
              <textarea
                placeholder="Notes"
                value={newBooking.notes}
                onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                className="px-3 py-2 border rounded md:col-span-2"
                rows="2"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddBooking}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add Booking
              </button>
              <button
                onClick={() => setShowNewBooking(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiCalendar className="mx-auto text-4xl mb-2" />
              <p>No upcoming bookings</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date & Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Service</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <FiCalendar className="mr-1" />
                        {new Date(booking.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1" />
                        {booking.time}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.service || '-'}</td>
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

export default OnlineBookingEditor;
