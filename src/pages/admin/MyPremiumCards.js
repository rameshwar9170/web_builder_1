import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { cardService } from '../../services/cardService';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiCopy, FiExternalLink, FiZap, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MyPremiumCards = () => {
    const { userData } = useSelector((state) => state.auth);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadCards = React.useCallback(async () => {
        if (!userData?.uid) return;
        try {
            const allCards = await cardService.getAdminCards(userData.uid);
            // Filter only premium ones
            const premiumOnly = allCards.filter(c => c.isPremium === true);
            setCards(premiumOnly);
        } catch (error) {
            toast.error('Failed to load elite experiences');
        } finally {
            setLoading(false);
        }
    }, [userData?.uid]);

    useEffect(() => {
        if (userData?.uid) {
            loadCards();
        }
    }, [userData?.uid, loadCards]);

    const handleDelete = async (cardId) => {
        if (window.confirm('Are you sure you want to decommission this elite experience?')) {
            try {
                await cardService.deleteCard(cardId);
                toast.success('Experience decommissioned');
                loadCards();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    const copyToClipboard = (text, message) => {
        navigator.clipboard.writeText(text);
        toast.success(message || 'Link copied!');
    };

    const getCardUrl = (slug, isPreview = false) => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/premium-card/${slug}${isPreview ? '?preview=true' : ''}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <FiZap className="text-4xl text-yellow-500 animate-pulse mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Elite Database...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <FiZap className="text-yellow-500 fill-yellow-500" />
                        Elite Storefronts
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your high-conversion premium websites.</p>
                </div>
                <Link
                    to="/admin/cards/create-premium"
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-black transition-all shadow-xl"
                >
                    <FiPlus /> Deploy New Experience
                </Link>
            </div>

            {cards.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[40px] shadow-2xl border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiZap className="text-gray-200 text-3xl" />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-8">No elite experiences found</p>
                    <Link
                        to="/admin/cards/create-premium"
                        className="inline-block bg-primary-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-700 transition-all shadow-lg"
                    >
                        Start Your First Premium Design
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card) => (
                        <div key={card.id} className="group bg-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all border border-gray-100 overflow-hidden relative">
                            <div className={`h-40 relative overflow-hidden ${card.premiumLayout === 'gold' ? 'bg-yellow-600' : card.premiumLayout === 'minimal' ? 'bg-black' : 'bg-slate-300'}`}>
                                {card.premiumWeb?.hero?.image && (
                                    <img src={card.premiumWeb.hero.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                                )}
                                <div className="absolute top-6 right-6">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                        {card.premiumLayout || 'Elite'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-gray-900 mb-1">{card.basicInfo?.businessName || card.basicInfo?.name || 'Untitled Elite'}</h3>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">{card.basicInfo?.title || 'No Title Set'}</p>
                                </div>

                                {/* Slug display */}
                                <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Domain</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => copyToClipboard(getCardUrl(card.slug), 'Elite link copied!')}
                                                className="p-2 text-primary-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm"
                                            >
                                                <FiCopy size={14} />
                                            </button>
                                            <a
                                                href={getCardUrl(card.slug)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-primary-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm"
                                            >
                                                <FiExternalLink size={14} />
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-gray-900 mt-2 truncate">premium-card/{card.slug}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        to={`/admin/premium-cards/edit/${card.id}`}
                                        className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                                    >
                                        <FiEdit size={12} /> Architect
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(card.id)}
                                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all"
                                    >
                                        <FiTrash2 size={12} /> Destroy
                                    </button>
                                </div>

                                <button
                                    onClick={() => window.open(getCardUrl(card.slug, true), '_blank')}
                                    className="w-full mt-3 flex items-center justify-center gap-2 bg-primary-50 text-primary-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-100 transition-all"
                                >
                                    <FiEye size={12} /> Full Preview
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPremiumCards;
