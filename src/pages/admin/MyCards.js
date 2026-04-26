import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { cardService } from '../../services/cardService';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiCopy, FiExternalLink, FiShare2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyCards = () => {
  const { user } = useSelector((state) => state.auth);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCards = async () => {
    try {
      const data = await cardService.getAdminCards(user.uid);
      setCards(data);
    } catch (error) {
      toast.error('Failed to load cards');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await cardService.deleteCard(cardId);
        toast.success('Card deleted successfully');
        loadCards();
      } catch (error) {
        toast.error('Failed to delete card');
      }
    }
  };

  const handlePublish = async (cardId) => {
    try {
      await cardService.publishCard(cardId);
      toast.success('Card published successfully');
      loadCards();
    } catch (error) {
      toast.error('Failed to publish card');
    }
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    toast.success(message || 'Link copied to clipboard!');
  };

  const getCardUrl = (slug, isPremium = false, isPreview = false) => {
    const baseUrl = window.location.origin;
    const path = isPremium ? 'premium-card' : 'card';
    return `${baseUrl}/${path}/${slug}${isPreview ? '?preview=true' : ''}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Cards</h1>
        <Link
          to="/admin/cards/create"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        >
          Create New Card
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You haven't created any cards yet</p>
          <Link
            to="/admin/cards/create"
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            Create Your First Card
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{card.basicInfo?.name || 'Untitled'}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.basicInfo?.title || ''}</p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${card.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {card.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {card.analytics?.views || 0} views
                  </span>
                </div>

                {/* Card Links */}
                {card.status === 'published' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">Public Link:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={getCardUrl(card.slug, card.isPremium)}
                        readOnly
                        className="flex-1 text-xs px-2 py-1 border rounded bg-white"
                      />
                      <button
                        onClick={() => copyToClipboard(getCardUrl(card.slug, card.isPremium), 'Public link copied!')}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        title="Copy link"
                      >
                        <FiCopy size={16} />
                      </button>
                      <a
                        href={getCardUrl(card.slug, card.isPremium)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        title="Open in new tab"
                      >
                        <FiExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    to={card.isPremium ? `/admin/premium-cards/edit/${card.id}` : `/admin/cards/edit/${card.id}`}
                    className="flex-1 flex items-center justify-center bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
                  >
                    <FiEdit className="mr-1" /> Edit
                  </Link>

                  {card.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(card.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Publish
                    </button>
                  )}

                  <button
                    onClick={() => window.open(getCardUrl(card.slug, card.isPremium, true), '_blank')}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    title="Preview"
                  >
                    <FiEye />
                  </button>

                  <button
                    onClick={() => handleDelete(card.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                {/* Share Button for Published Cards */}
                {card.status === 'published' && (
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: card.basicInfo?.name || 'Digital Card',
                          text: `Check out my digital visiting card!`,
                          url: getCardUrl(card.slug, card.isPremium)
                        });
                      } else {
                        copyToClipboard(getCardUrl(card.slug, card.isPremium), 'Link copied! Share it with others.');
                      }
                    }}
                    className="w-full mt-2 flex items-center justify-center bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100"
                  >
                    <FiShare2 className="mr-2" /> Share Card
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCards;
