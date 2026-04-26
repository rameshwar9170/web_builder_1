import React, { useState, useEffect } from 'react';
import { FiTrash2, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdmissionFormEditor = ({ card, onSave }) => {
  const [applications, setApplications] = useState([]);
  const [viewingApplication, setViewingApplication] = useState(null);

  useEffect(() => {
    if (card.admissionForm) {
      setApplications(card.admissionForm.applications || []);
    }
  }, [card]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    await saveApplications(updatedApplications);
    toast.success(`Application ${newStatus}`);
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm('Delete this application?')) return;
    
    const updatedApplications = applications.filter(app => app.id !== applicationId);
    setApplications(updatedApplications);
    await saveApplications(updatedApplications);
    toast.success('Application deleted');
  };

  const saveApplications = async (updatedApplications) => {
    try {
      await onSave('admissionForm', {
        enabled: true,
        settings: card.admissionForm?.settings || { allowApplications: true, requireApproval: true },
        applications: updatedApplications,
        statistics: calculateStatistics(updatedApplications)
      });
    } catch (error) {
      console.error('Error saving applications:', error);
    }
  };

  const calculateStatistics = (appList = applications) => {
    return {
      total: appList.length,
      pending: appList.filter(a => a.status === 'pending').length,
      approved: appList.filter(a => a.status === 'approved').length,
      rejected: appList.filter(a => a.status === 'rejected').length,
      lastUpdated: new Date().toISOString()
    };
  };

  const stats = calculateStatistics();

  return (
    <div className="space-y-6">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Admission Applications</h3>

        <div className="overflow-x-auto">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No applications yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Student Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Contact</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Course</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{app.studentName}</div>
                      {app.parentName && <div className="text-sm text-gray-500">Parent: {app.parentName}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{app.email}</div>
                      <div className="text-gray-500">{app.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{app.course || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setViewingApplication(app)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'approved')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Approve"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'rejected')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
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

      {/* View Application Modal */}
      {viewingApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Application Details</h2>
                <button
                  onClick={() => setViewingApplication(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Student Name</label>
                    <p className="text-lg">{viewingApplication.studentName}</p>
                  </div>
                  {viewingApplication.parentName && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Parent Name</label>
                      <p className="text-lg">{viewingApplication.parentName}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{viewingApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-lg">{viewingApplication.phone}</p>
                  </div>
                  {viewingApplication.course && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Course</label>
                      <p className="text-lg">{viewingApplication.course}</p>
                    </div>
                  )}
                  {viewingApplication.grade && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Grade/Class</label>
                      <p className="text-lg">{viewingApplication.grade}</p>
                    </div>
                  )}
                </div>
                {viewingApplication.message && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Message</label>
                    <p className="text-gray-700 mt-1">{viewingApplication.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      viewingApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                      viewingApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {viewingApplication.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Applied On</label>
                  <p className="text-gray-700">{new Date(viewingApplication.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                {viewingApplication.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateStatus(viewingApplication.id, 'approved');
                        setViewingApplication(null);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleUpdateStatus(viewingApplication.id, 'rejected');
                        setViewingApplication(null);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setViewingApplication(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionFormEditor;
