import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { cardService } from '../../services/cardService';
import { FiCreditCard, FiEye, FiEdit } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, userData } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalCards: 0,
    publishedCards: 0,
    draftCards: 0,
    totalViews: 0
  });

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadStats = async () => {
    try {
      const cards = await cardService.getAdminCards(user.uid);
      const totalViews = cards.reduce((sum, card) => sum + (card.analytics?.views || 0), 0);
      
      setStats({
        totalCards: cards.length,
        publishedCards: cards.filter(c => c.status === 'published').length,
        draftCards: cards.filter(c => c.status === 'draft').length,
        totalViews
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Cards</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCards}</p>
            </div>
            <FiCreditCard className="text-4xl text-primary-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Published</p>
              <p className="text-3xl font-bold text-gray-800">{stats.publishedCards}</p>
            </div>
            <FiEdit className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Drafts</p>
              <p className="text-3xl font-bold text-gray-800">{stats.draftCards}</p>
            </div>
            <FiEdit className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Views</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalViews}</p>
            </div>
            <FiEye className="text-4xl text-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/cards/create"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 text-center"
          >
            <FiCreditCard className="mx-auto text-3xl text-gray-400 mb-2" />
            <p className="text-gray-600">Create New Card</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
