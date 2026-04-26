import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';
import { FiEye, FiZap, FiExternalLink, FiShare2, FiHome, FiArrowLeft, FiGlobe, FiBriefcase, FiZap as FiZapIcon } from 'react-icons/fi';
import PremiumWebEditor from '../../components/editors/PremiumWebEditor';
import BasicInfoEditor from '../../components/editors/BasicInfoEditor';
import ContactEditor from '../../components/editors/ContactEditor';
import GalleryEditor from '../../components/editors/GalleryEditor';
import ThemeEditor from '../../components/editors/ThemeEditor';

const EditPremiumCard = () => {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('design');

    useEffect(() => {
        loadCard();
    }, [cardId]);

    const loadCard = async () => {
        try {
            const data = await cardService.getCard(cardId);
            if (!data.isPremium) {
                toast.warning('Redirecting to Standard Editor');
                navigate(`/admin/cards/edit/${cardId}`);
                return;
            }
            setCard(data);
        } catch (error) {
            toast.error('Failed to load elite space');
            navigate('/admin/premium-cards');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section, data) => {
        try {
            await cardService.updateCardSection(cardId, section, data);
            toast.success('Experience Updated');
            await loadCard();
        } catch (error) {
            toast.error('Failed to save');
        }
    };

    const handleGlobalUpdate = async (updates) => {
        try {
            await cardService.updateCard(cardId, updates);
            toast.success('Elite Ecosystem Synchronized');
            await loadCard();
        } catch (error) {
            toast.error('Sync Failed');
        }
    };

    const getCardUrl = (isPreview = false) => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/premium-card/${card.slug}${isPreview ? '?preview=true' : ''}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[600px]">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-6 font-black uppercase tracking-[0.3em] text-[10px] text-primary-600">Architectural Sync in progress...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'design', label: 'Experience Design', icon: <FiZap /> },
        { id: 'identity', label: 'Identity Node', icon: <FiHome /> },
        { id: 'connectivity', label: 'Connectivity', icon: <FiGlobe /> },
        { id: 'portfolio', label: 'Global Portfolio', icon: <FiBriefcase /> },
        { id: 'aesthetics', label: 'Base Theme', icon: <FiZapIcon /> }
    ];

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Header Navigation */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/admin/premium-cards')}
                        className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400"
                    >
                        <FiArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                            {card.basicInfo?.businessName || 'Elite Space'}
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-600 mt-1">Premium Ecosystem Architecture</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => window.open(getCardUrl(true), '_blank')}
                        className="bg-gray-100 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-all"
                    >
                        <FiEye /> Preview
                    </button>
                    <button
                        onClick={() => window.open(getCardUrl(false), '_blank')}
                        className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg"
                    >
                        <FiExternalLink /> View Live
                    </button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden min-h-[800px]">
                {/* Internal Navigation */}
                <div className="bg-gray-50 px-8 py-2 border-b border-gray-100">
                    <div className="flex gap-8">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-6 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.icon}
                                {tab.label}
                                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600 rounded-t-full"></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-10 animate-in fade-in duration-500">
                    {activeTab === 'design' && (
                        <PremiumWebEditor card={card} onSave={handleSave} onGlobalSave={handleGlobalUpdate} />
                    )}
                    {activeTab === 'identity' && (
                        <div className="max-w-3xl mx-auto bg-gray-50 p-10 rounded-[40px] shadow-inner">
                            <h2 className="text-2xl font-black mb-8 border-b pb-6">Base Identity Node</h2>
                            <BasicInfoEditor card={card} onSave={(data) => handleSave('basicInfo', data)} />
                        </div>
                    )}
                    {activeTab === 'connectivity' && (
                        <div className="max-w-3xl mx-auto bg-gray-50 p-10 rounded-[40px] shadow-inner">
                            <h2 className="text-2xl font-black mb-8 border-b pb-6">Connectivity & Access</h2>
                            <ContactEditor card={card} onSave={(data) => handleSave('contact', data)} />
                        </div>
                    )}
                    {activeTab === 'portfolio' && (
                        <div className="max-w-4xl mx-auto bg-gray-50 p-10 rounded-[40px] shadow-inner">
                            <h2 className="text-2xl font-black mb-8 border-b pb-6">Portfolio Assets</h2>
                            <GalleryEditor card={card} onSave={(data) => handleSave('gallery', data)} />
                        </div>
                    )}
                    {activeTab === 'aesthetics' && (
                        <div className="max-w-3xl mx-auto bg-gray-50 p-10 rounded-[40px] shadow-inner">
                            <h2 className="text-2xl font-black mb-8 border-b pb-6">Foundation Aesthetics</h2>
                            <ThemeEditor card={card} onSave={(data) => handleSave('theme', data)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditPremiumCard;
