import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { FiSend } from 'react-icons/fi';

const PublicAdmissionForm = ({ card }) => {
  const admissionForm = card.admissionForm;
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    course: '',
    grade: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (!admissionForm?.enabled || !admissionForm?.settings?.allowApplications) {
    return null;
  }

  const theme = card.theme || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.email || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const application = {
        id: uuidv4(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const freshCard = await cardService.getCard(card.id);
      const currentApplications = freshCard.admissionForm?.applications || [];
      const updatedApplications = [...currentApplications, application];
      
      const updatedStats = {
        total: updatedApplications.length,
        pending: updatedApplications.filter(a => a.status === 'pending').length,
        approved: updatedApplications.filter(a => a.status === 'approved').length,
        rejected: updatedApplications.filter(a => a.status === 'rejected').length
      };

      await cardService.updateCardSection(card.id, 'admissionForm', {
        ...freshCard.admissionForm,
        applications: updatedApplications,
        statistics: updatedStats
      });

      toast.success('Application submitted successfully! We will contact you soon.');
      
      setFormData({
        studentName: '',
        parentName: '',
        email: '',
        phone: '',
        course: '',
        grade: '',
        message: ''
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-4" style={{ color: theme.primaryColor }}>
        Admission Application
      </h2>
      <p className="text-center text-gray-600 mb-12">
        Fill out the form below to apply for admission. We'll get back to you soon!
      </p>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Student Name *
              </label>
              <input
                type="text"
                required
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter student name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Parent/Guardian Name
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter parent name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Course/Program
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Mathematics, Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Grade/Class
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Grade 10, Class 12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="4"
              placeholder="Any additional information you'd like to share..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FiSend />
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicAdmissionForm;
