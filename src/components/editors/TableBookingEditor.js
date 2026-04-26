import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiCalendar, FiClock, FiUsers, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TableBookingEditor = ({ card, onSave }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    maxTables: 20,
    maxGuestsPerTable: 8,
    bookingDuration: 120, // minutes
    workingHours: {
      start: '11:00',
      end: '23:00'
    },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    advanceBookingDays: 30,
    requireDeposit: false,
    depositAmount: 0
  });

  const [bookings, setBookings] = useState([]);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    status: 'pending'
  });

  useEffect(() => {
    if (card.tableBooking) {
      setSettings(card.tableBooking.settings || settings);
      setBookings(card.tableBooking.bookings || []);
    }
  }, [card, settings]);

  const handleSaveSettings = async () => {
    try {
      await onSave('tableBooking', {
        settings,
        bookings,
        statistics: calculateStatistics()
      });
      toast.success('Table booking settings saved');
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
      tableNumber: assignTable(),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    const updatedBookings = [...bookings, booking];
    setBookings(updatedBookings);
    setNewBooking({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: '',
      status: 'pending'
    });
    setShowNewBooking(false);
    
    saveBookings(updatedBookings);
    toast.success(`Table ${booking.tableNumber} reserved!`);
  };

  const assignTable = () => {
    const usedTables = bookings
      .filter(b => b.date === newBooking.date && b.time === newBooking.time)
      .map(b => b.tableNumber);
    
    for (let i = 1; i <= settings.maxTables; i++) {
      if (!usedTables.includes(i)) {
        return i;
      }
    }
    return Math.floor(Math.random() * settings.maxTables) + 1;
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
    if (!window.confirm('Delete this reservation?')) return;
    
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
    toast.success('Reservation deleted');
  };

  const saveBookings = async (updatedBookings) => {
    try {
      await onSave('tableBooking', {
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
    const today = bookingsList.filter(b => {
      const bookingDate = new Date(b.date);
      return bookingDate.toDateString() === now.toDateString();
    });

    const thisWeek = bookingsList.filter(b => {
      const bookingDate = new Date(b.date);
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return bookingDate >= weekStart;
    });

    return {
      total: bookingsList.length,
      today: today.length,
      thisWeek: thisWeek.length,
      confirmed: bookingsList.filter(b => b.status === 'confirmed').length,
      completed: bookingsList.filter(b => b.status === 'completed').length,
      cancelled: bookingsList.filter(b => b.status === 'cancelled').length,
      totalGuests: bookingsList.reduce((sum, b) => sum + (parseInt(b.guests) || 0), 0),
      lastUpdated: new Date().toISOString()
    };
  };

  const stats = calculateStatistics();
  const upcomingBookings = bookings
    .filter(b => new Date(b.date) >= new Date() && b.status !== 'cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.today}</div>
          <div className="text-sm text-gray-600">Today's Bookings</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{stats.confirmed}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{stats.totalGuests}</div>
          <div className="text-sm text-gray-600">Total Guests</div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Table Booking Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Total Tables</label>
            <input
              type="number"
              value={settings.maxTables}
              onChange={(e) => setSettings({...settings, maxTables: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border rounded-lg"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Guests Per Table</label>
            <input
              type="number"
              value={settings.maxGuestsPerTable}
              onChange={(e) => setSettings({...settings, maxGuestsPerTable: parseInt(e.target.value)})}
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
              min="30"
              step="30"
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

          <div>
            <label className="block text-sm font-medium mb-2">Opening Time</label>
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
            <label className="block text-sm font-medium mb-2">Closing Time</label>
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

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireDeposit}
                onChange={(e) => setSettings({...settings, requireDeposit: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm font-medium">Require Deposit</span>
            </label>
          </div>

          {settings.requireDeposit && (
            <div>
              <label className="block text-sm font-medium mb-2">Deposit Amount</label>
              <input
                type="number"
                value={settings.depositAmount}
                onChange={(e) => setSettings({...settings, depositAmount: parseFloat(e.target.value)})}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSaveSettings}
          className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          <FiSave className="inline mr-2" />
          Save Settings
        </button>
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Table Reservations</h3>
          <button
            onClick={() => setShowNewBooking(!showNewBooking)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FiPlus className="inline mr-2" />
            New Reservation
          </button>
        </div>

        {showNewBooking && (
          <div className="bg-gray-50 border rounded-lg p-4 mb-4">
            <h4 className="font-bold mb-3">Add New Reservation</h4>
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
                placeholder="Phone *"
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
                type="number"
                placeholder="Number of Guests"
                value={newBooking.guests}
                onChange={(e) => setNewBooking({...newBooking, guests: parseInt(e.target.value)})}
                className="px-3 py-2 border rounded"
                min="1"
                max={settings.maxGuestsPerTable}
              />
              <textarea
                placeholder="Special Requests"
                value={newBooking.specialRequests}
                onChange={(e) => setNewBooking({...newBooking, specialRequests: e.target.value})}
                className="px-3 py-2 border rounded md:col-span-2"
                rows="2"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddBooking}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Reserve Table
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

        <div className="overflow-x-auto">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiCalendar className="mx-auto text-4xl mb-2" />
              <p>No upcoming reservations</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Table</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date & Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Guests</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
                  <tr key={booking.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-bold text-lg">#{booking.tableNumber}</div>
                    </td>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <FiUsers className="mr-1" />
                        {booking.guests}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
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

export default TableBookingEditor;
