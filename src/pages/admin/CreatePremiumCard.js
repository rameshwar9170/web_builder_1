import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { cardService } from '../../services/cardService';
import { premiumService } from '../../services/premiumService';
import { toast } from 'react-toastify';
import { FiCheck, FiX, FiLoader, FiArrowRight, FiStar, FiZap, FiSettings } from 'react-icons/fi';

const CreatePremiumCard = () => {
    const { userData } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [checkingSlug, setCheckingSlug] = useState(false);
    const [slugAvailable, setSlugAvailable] = useState(null);
    const [selectedLayout, setSelectedLayout] = useState('silver');
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        slug: '',
        email: '',
        phone: ''
    });

    const [premiumWeb] = useState({
        navbar: { subtitle: 'Gold Standard' },
        hero: { heading: '', image: '', badge: 'Elite Experience' },
        stats: [
            { label: 'Success Rate', value: '99%' },
            { label: 'Global Clients', value: '250+' },
            { label: 'Expert Curators', value: '15' }
        ],
        about: { photo: '', mission: '', vision: '' },
        services: [
            { title: 'Brand Architecture', description: 'Defining the core of your digital identity.' },
            { title: 'Premium Execution', description: 'Flawless delivery of complex systems.' },
            { title: 'Growth Scaling', description: 'Next-gen expansion strategies.' }
        ],
        gallery: [],
        team: [
            { name: 'Dr. Alistair', role: 'Chief Strategist', image: '' },
            { name: 'Sarah Black', role: 'Design Director', image: '' }
        ],
        testimonials: [
            { author: 'The Obsidian Group', text: 'Unparalleled attention to detail and luxury aesthetics.', stars: 5 }
        ],
        contact: { address: '', workingHours: 'By Appointment' },
        footer: { whatsapp: '', instagram: '', linkedin: '' }
    });

    const layouts = [
        {
            id: 'silver',
            name: 'Sterling Silver',
            description: 'Sleek industrial aesthetics with glassmorphism',
            features: ['Modern', 'Slate Accents', 'Glass Blur'],
            previewColor: 'bg-slate-200'
        },
        {
            id: 'gold',
            name: 'Liquid Gold',
            description: 'Royal palatial feel with shimmering gradients',
            features: ['Luxury', 'Gold Foil', 'Serif Type'],
            previewColor: 'bg-yellow-600'
        },
        {
            id: 'minimal',
            name: 'Zenith Noir',
            description: 'Monochromatic architectural minimalism',
            features: ['Dark Mode', 'Sharp Lines', 'Ultra Clean'],
            previewColor: 'bg-black'
        }
    ];

    useEffect(() => {
        if (formData.slug) {
            const timer = setTimeout(() => checkSlugAvailability(formData.slug), 500);
            return () => clearTimeout(timer);
        }
    }, [formData.slug]);

    const generateSlug = (text) => {
        return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    };

    const checkSlugAvailability = async (slug) => {
        setCheckingSlug(true);
        try {
            const available = await cardService.isSlugAvailable(slug);
            setSlugAvailable(available);
        } catch (error) {
            console.error(error);
        } finally {
            setCheckingSlug(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'name') newData.slug = generateSlug(value);
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.slug || slugAvailable === false) return toast.error('Check URL availability');

        setLoading(true);
        try {
            const cardData = {
                ...formData,
                isPremium: true,
                premiumLayout: selectedLayout,
                premiumWeb,
                templateId: 'premium-elite',
                // Synchronize with standard sections
                basicInfo: {
                    ...formData,
                    name: formData.name || '',
                    businessName: formData.name || 'Elite Brand',
                    title: premiumWeb.hero.heading || formData.title || '',
                    brandStatement: premiumWeb.navbar.subtitle || 'Defining Excellence.'
                },
                about: {
                    mission: premiumWeb.about.mission,
                    vision: premiumWeb.about.vision,
                    description: premiumWeb.hero.heading,
                    enabled: true
                },
                services: {
                    items: premiumWeb.services.map(s => ({
                        id: Math.random().toString(36).substr(2, 9),
                        title: s.title,
                        description: s.description
                    })),
                    enabled: true
                },
                team: {
                    members: premiumWeb.team.map(m => ({
                        id: Math.random().toString(36).substr(2, 9),
                        name: m.name,
                        role: m.role
                    })),
                    enabled: true
                },
                contact: {
                    email: formData.email || '',
                    phone: formData.phone || '',
                    address: premiumWeb.contact.address || '',
                    socialLinks: {
                        whatsapp: premiumWeb.footer.whatsapp || '',
                        instagram: premiumWeb.footer.instagram || ''
                    },
                    enabled: true
                },
                enabledFeatures: ['About', 'Services', 'Team', 'Gallery', 'Testimonials']
            };
            const cardId = await premiumService.createPremiumExperience(userData.uid, cardData);
            toast.success('Elite Experience Deployed!');
            navigate(`/admin/premium-cards/edit/${cardId}`);
        } catch (err) {
            toast.error('Deployment Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-5xl font-black text-gray-900 flex items-center gap-4">
                    <FiStar className="text-yellow-500 fill-yellow-500 animate-pulse" />
                    Premium Engine
                </h1>
                <p className="text-gray-500 mt-4 text-xl">Architect your next-level digital storefront.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-12">
                <div className="lg:col-span-3">
                    {/* Step 1: Layout */}
                    {currentStep === 1 && (
                        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center">1</span>
                                Choose Base Aesthetic
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {layouts.map(l => (
                                    <button
                                        key={l.id}
                                        onClick={() => setSelectedLayout(l.id)}
                                        className={`group relative p-8 rounded-[32px] border-2 transition-all text-left ${selectedLayout === l.id ? 'border-primary-600 bg-primary-50 ring-8 ring-primary-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-full aspect-video rounded-2xl mb-6 ${l.previewColor} shadow-inner`}></div>
                                        <h3 className="text-xl font-bold text-gray-900">{l.name}</h3>
                                        <p className="text-sm text-gray-500 mt-2">{l.description}</p>
                                        {selectedLayout === l.id && <div className="absolute top-6 right-6 bg-primary-600 text-white p-2 rounded-full"><FiCheck /></div>}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-12 flex justify-end">
                                <button onClick={() => setCurrentStep(2)} className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all">
                                    Continue to Identity <FiArrowRight />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {currentStep === 2 && (
                        <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100">
                            <h2 className="text-2xl font-bold mb-8">2. Brand Foundations</h2>
                            <form className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Name</label>
                                        <input value={formData.name} name="name" onChange={handleChange} className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-primary-100 transition-all font-medium" placeholder="Ex: Zenith Luxury" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Vocation/Title</label>
                                        <input value={formData.title} name="title" onChange={handleChange} className="w-full px-8 py-5 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-primary-100 transition-all font-medium" placeholder="Ex: Master Architect" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Digital Domain Identifier (Slug)</label>
                                    <div className="relative">
                                        <input value={formData.slug} name="slug" onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })} className="w-full px-8 py-5 pl-14 bg-gray-50 rounded-2xl border-none font-bold" />
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">/</div>
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                            {checkingSlug ? <FiLoader className="animate-spin" /> : slugAvailable === true ? <FiCheck className="text-green-500" /> : <FiX className="text-red-500" />}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-12 flex justify-between">
                                    <button onClick={() => setCurrentStep(1)} className="text-gray-400 font-bold hover:text-gray-900 transition-colors">Return to Layout</button>
                                    <button onClick={handleSubmit} disabled={loading} className="bg-primary-600 text-white px-14 py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50">
                                        <FiZap /> {loading ? 'Processing...' : 'Deploy Experience'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-[40px] p-10 text-white shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><FiSettings /> Specs Overview</h3>
                        <div className="space-y-6 text-sm">
                            <div className="flex justify-between items-center opacity-70">
                                <span>Architecture:</span>
                                <span className="font-bold">{selectedLayout.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center opacity-70">
                                <span>Security:</span>
                                <span className="text-green-400 font-bold">Verified</span>
                            </div>
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-[10px] uppercase font-black tracking-widest text-primary-400 mb-4">Core Benefits</p>
                                <ul className="space-y-3 opacity-80">
                                    <li className="flex gap-2"><FiCheck className="text-primary-500" /> Ultra-Responsive</li>
                                    <li className="flex gap-2"><FiCheck className="text-primary-500" /> Platinum Hosting</li>
                                    <li className="flex gap-2"><FiCheck className="text-primary-500" /> Global CDN</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePremiumCard;
