import React, { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiPhone, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { cardService } from '../../services/cardService';

const PublicOnlineBooking = ({ card }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const settings = card.onlineBooking?.settings || {};
  const services = card.services?.items || [];

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
        service: formData.service,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        status: settings.requireApproval ? 'pending' : 'confirmed'
      };

      // Fetch fresh data from database
      const freshCard = await cardService.getCard(card.id);
      const existingBookings = freshCard.onlineBooking?.bookings || [];
      const updatedBookings = [...existingBookings, booking];

      await cardService.updateCardSection(card.id, 'onlineBooking', {
        ...freshCard.onlineBooking,
        bookings: updatedBookings
      });

      setSubmitted(true);
      toast.success(settings.requireApproval 
        ? 'Booking request submitted! We will confirm shortly.' 
        : 'Booking confirmed! See you soon!');
      
      setFormData({
        customerName: '',
        customerPhone: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    const start = settings.workingHours?.start || '09:00';
    const end = settings.workingHours?.end || '18:00';
    const duration = settings.bookingDuration || 60;

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
        <h3 className="text-2xl font-bold mb-2">Booking Submitted!</h3>
        <p className="text-gray-600 mb-6">
          {settings.requireApproval 
            ? 'We will review your booking and confirm via email/phone shortly.'
            : 'Your booking is confirmed! We look forward to seeing you.'}
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Book Your Appointment</h2>
        <p className="text-gray-600">Fill in the details below to schedule your visit</p>
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
              <FiCalendar className="inline mr-2" />
              Preferred Date *
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
              Preferred Time *
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

          <div>
            <label className="block text-sm font-medium mb-2">
              Service *
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select service</option>
              {services.map((service, index) => (
                <option key={index} value={service.name}>
                  {service.name} {service.price && `- ${service.price}`}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="4"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Any special requests or preferences..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 text-lg font-semibold"
        >
          {submitting ? 'Submitting...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default PublicOnlineBooking;
