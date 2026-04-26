import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { FiUsers, FiCreditCard, FiActivity } from 'react-icons/fi';

const SuperAdminDashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalAdmins: 0,
    activeAdmins: 0,
    totalCards: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const admins = await adminService.getAllAdmins();
      setStats({
        totalAdmins: admins.length,
        activeAdmins: admins.filter(a => a.isActive).length,
        totalCards: 0 // Calculate from all cards
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome, {userData?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Admins</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalAdmins}</p>
            </div>
            <FiUsers className="text-4xl text-primary-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Admins</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activeAdmins}</p>
            </div>
            <FiActivity className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Cards</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCards}</p>
            </div>
            <FiCreditCard className="text-4xl text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
