import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { FiHome, FiCreditCard, FiLogOut, FiPlusCircle } from 'react-icons/fi';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">{userData?.name}</p>
        </div>

        <nav className="mt-6">
          <Link
            to="/admin"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
          >
            <FiHome className="mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/cards"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
          >
            <FiCreditCard className="mr-3" />
            My Cards
          </Link>
          <Link
            to="/admin/cards/create"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
          >
            <FiPlusCircle className="mr-3" />
            Create Card
          </Link>
          <Link
            to="/admin/premium-cards"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <FiPlusCircle className="mr-3 text-yellow-500" />
            Premium Cards
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut className="mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
