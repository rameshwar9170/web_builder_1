import React, { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiPhone, FiUsers, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { cardService } from '../../services/cardService';

const PublicTableBooking = ({ card }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    tableNumber: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const settings = card.tableBooking?.settings || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const booking = {
        id: Date.now().toString(),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        specialRequests: formData.specialRequests,
        tableNumber: Math.floor(Math.random() * (settings.maxTables || 20)) + 1,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // Fetch fresh data from database to get latest bookings
      const freshCard = await cardService.getCard(card.id);
      const existingBookings = freshCard.tableBooking?.bookings || [];
      const updatedBookings = [...existingBookings, booking];

      await cardService.updateCardSection(card.id, 'tableBooking', {
        ...freshCard.tableBooking,
        bookings: updatedBookings
      });

      setSubmitted(true);
      toast.success('Table reserved successfully!');
      
      setFormData({
        customerName: '',
        customerPhone: '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: '',
        tableNumber: booking.tableNumber
      });
    } catch (error) {
      toast.error('Failed to reserve table. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = settings.workingHours?.start || '11:00';
    const end = settings.workingHours?.end || '23:00';
    const duration = settings.bookingDuration || 120;

    let current = start;
    while (current < end) {
      slots.push(current);
      const [hours, minutes] = current.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + duration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      current = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + (settings.advanceBookingDays || 30) * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FiCheck className="text-3xl text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Table Reserved!</h3>
        <p className="text-gray-600 mb-2">
          Your table has been reserved. We look forward to serving you!
        </p>
        <p className="text-lg font-bold text-primary-600 mb-6">
          Table Number: {formData.tableNumber}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Reserve Another Table
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Reserve Your Table</h2>
        <p className="text-gray-600">Book a table for your next dining experience</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              <FiUser className="inline mr-2" />
              Your Name *
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FiPhone className="inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FiUsers className="inline mr-2" />
              Number of Guests *
            </label>
            <select
              value={formData.guests}
              onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              {[...Array(settings.maxGuestsPerTable || 8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FiCalendar className="inline mr-2" />
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              min={minDate}
              max={maxDate}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <FiClock className="inline mr-2" />
              Time *
            </label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Special Requests
          </label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
            rows="4"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Any dietary restrictions, seating preferences, or special occasions..."
          />
        </div>

        {settings.requireDeposit && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> A deposit of ${settings.depositAmount} is required to confirm your reservation.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 text-lg font-semibold"
        >
          {submitting ? 'Reserving...' : 'Reserve Table'}
        </button>
      </form>
    </div>
  );
};

export default PublicTableBooking;
