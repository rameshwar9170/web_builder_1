import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROLES } from '../firebase/collections';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { userData, user } = useSelector((state) => state.auth);

  const handleGoToDashboard = () => {
    if (userData?.role === ROLES.SUPER_ADMIN) {
      navigate('/super-admin');
    } else if (userData?.role === ROLES.ADMIN) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        
        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded mb-6 text-left text-sm">
          <p className="font-bold mb-2">Debug Info:</p>
          <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
          <p><strong>Current Role:</strong> {userData?.role || 'No role set'}</p>
          <p><strong>User ID:</strong> {user?.uid || 'N/A'}</p>
          <p className="mt-2 text-xs text-gray-600">
            To access Super Admin, your role must be "super_admin" in Firestore.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            Go to Dashboard
          </button>
          <Link
            to="/login"
            className="block w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
