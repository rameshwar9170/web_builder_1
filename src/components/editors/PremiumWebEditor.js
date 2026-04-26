import React, { useState } from 'react';
import { FiStar, FiZap, FiImage, FiMapPin, FiGlobe, FiUsers, FiBriefcase, FiCheck, FiUpload, FiLoader } from 'react-icons/fi';
import { cardService } from '../../services/cardService';
import { toast } from 'react-toastify';

const PremiumWebEditor = ({ card, onSave, onGlobalSave }) => {
    const [subActiveTab, setSubActiveTab] = useState('aesthetic');
    const [uploadingField, setUploadingField] = useState(null);

    const subTabs = [
        { id: 'aesthetic', label: 'Aesthetic', icon: <FiGlobe /> },
        { id: 'hero', label: 'Hero', icon: <FiStar /> },
        { id: 'metrics', label: 'Metrics', icon: <FiBriefcase /> },
        { id: 'mission', label: 'Mission', icon: <FiGlobe /> },
        { id: 'offerings', label: 'Offerings', icon: <FiZap /> },
        { id: 'curators', label: 'Curators', icon: <FiUsers /> },
        { id: 'portfolio', label: 'Portfolio', icon: <FiImage /> },
        { id: 'echoes', label: 'Echoes', icon: <FiCheck /> },
        { id: 'atelier', label: 'Atelier', icon: <FiMapPin /> },
        { id: 'nodes', label: 'Identity', icon: <FiCheck /> }
    ];

    const [premiumWeb, setPremiumWeb] = useState(card.premiumWeb || {
        navbar: { subtitle: 'Elite Class' },
        hero: { heading: '', image: '', badge: 'Premium Edition' },
        stats: [
            { label: 'Happy Clients', value: '500+' },
            { label: 'Project Done', value: '150+' },
            { label: 'Expert Years', value: '12+' }
        ],
        about: { photo: '', mission: '', vision: '' },
        services: [
            { title: 'Digital Strategy', description: 'Next-gen growth patterns.' },
            { title: 'Premium Design', description: 'Bespoke UI/UX experiences.' },
            { title: 'Cloud Solutions', description: 'Scalable infrastructure.' }
        ],
        gallery: [],
        team: [
            { name: 'John Doe', role: 'CEO', image: '' },
            { name: 'Jane Smith', role: 'CFO', image: '' }
        ],
        testimonials: [
            { author: 'Robert Fox', text: 'Absolute excellence in every detail.', stars: 5 }
        ],
        contact: { address: '', workingHours: '9 AM - 6 PM' },
        footer: { whatsapp: '', instagram: '', linkedin: '' }
    });

    const [loading, setLoading] = useState(false);

    const handleImageUpload = async (e, path, callback) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingField(path);
        try {
            const url = await cardService.uploadImage(file, `cards/${card.id}/premium`);
            callback(url);
            toast.success('Image uploaded successfully');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploadingField(null);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            // Combine all updates into one atomic transaction
            const updates = {
                premiumWeb: premiumWeb,

                // Sync to standard About node
                about: {
                    ...card.about,
                    mission: premiumWeb.about.mission,
                    vision: premiumWeb.about.vision,
                    description: premiumWeb.hero.heading || card.about?.description,
                    enabled: true
                },

                // Sync to standard Services node
                services: {
                    ...card.services,
                    items: premiumWeb.services.map((s, i) => ({
                        id: card.services?.items?.[i]?.id || Math.random().toString(36).substr(2, 9),
                        title: s.title,
                        description: s.description
                    })),
                    enabled: true
                },

                // Sync to standard Team node
                team: {
                    ...card.team,
                    members: premiumWeb.team.map((m, i) => ({
                        id: card.team?.members?.[i]?.id || Math.random().toString(36).substr(2, 9),
                        name: m.name,
                        role: m.role
                    })),
                    enabled: true
                },

                // Sync to standard Gallery node
                gallery: {
                    ...card.gallery,
                    images: premiumWeb.gallery.filter(url => url && url.trim() !== '').map((url, i) => ({
                        id: card.gallery?.images?.[i]?.id || Math.random().toString(36).substr(2, 9),
                        url: url
                    })),
                    enabled: true
                },

                // Sync to standard Contact node
                contact: {
                    ...card.contact,
                    address: premiumWeb.contact.address,
                    socialLinks: {
                        ...card.contact?.socialLinks,
                        whatsapp: premiumWeb.footer.whatsapp,
                        instagram: premiumWeb.footer.instagram
                    },
                    enabled: true
                },

                // Sync crucial identity fields
                basicInfo: {
                    ...card.basicInfo,
                    title: premiumWeb.hero.heading || card.basicInfo?.title,
                    businessName: card.basicInfo?.businessName || card.basicInfo?.name || 'Elite Brand'
                }
            };

            await onGlobalSave(updates);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Save Button */}
            <div className="flex justify-between items-center bg-gray-900 p-6 rounded-3xl text-white shadow-xl">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FiZap className="text-yellow-400" />
                        Elite Content Builder
                    </h2>
                    <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">10-Section Master Layout</p>
                </div>
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <FiLoader className="animate-spin" /> : <FiZap />}
                    {loading ? 'Propagating...' : 'Update Showcase'}
                </button>
            </div>

            {/* Sub-Tabs Navigation */}
            <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide gap-1">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSubActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${subActiveTab === tab.id ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[500px]">
                {/* 1. Layout Switcher */}
                {subActiveTab === 'aesthetic' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-gray-900 border-b pb-4">
                            <FiGlobe className="text-primary-600" /> Base Brand Aesthetic
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { id: 'silver', name: 'Sterling Silver', color: 'bg-slate-200' },
                                { id: 'gold', name: 'Liquid Gold', color: 'bg-yellow-600' },
                                { id: 'minimal', name: 'Zenith Noir', color: 'bg-black' }
                            ].map(l => (
                                <button
                                    key={l.id}
                                    onClick={async () => {
                                        await onSave('premiumLayout', l.id);
                                    }}
                                    className={`p-6 rounded-[32px] border-2 transition-all text-center group ${card.premiumLayout === l.id ? 'border-primary-600 bg-primary-50' : 'border-gray-50 hover:border-gray-200 bg-gray-50'}`}
                                >
                                    <div className={`w-full aspect-video rounded-2xl mb-4 shadow-inner transition-transform group-hover:scale-105 ${l.color}`}></div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{l.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. Hero Section */}
                {subActiveTab === 'hero' && (
                    <div className="p-10 bg-white rounded-[40px] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-gray-900 text-center">
                            <FiStar className="text-primary-600" /> Atmosphere & Impact
                        </h3>
                        <div className="grid gap-8 max-w-2xl mx-auto">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Visual Badge</label>
                                <input
                                    className="w-full px-8 py-5 rounded-[24px] border-none shadow-inner bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500 text-sm font-bold text-primary-600"
                                    value={premiumWeb.hero.badge || ''}
                                    onChange={e => setPremiumWeb({ ...premiumWeb, hero: { ...premiumWeb.hero, badge: e.target.value } })}
                                    placeholder="e.g. Elite Experience"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Main Headliner</label>
                                <input
                                    className="w-full px-8 py-5 rounded-[24px] border-none shadow-inner bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold"
                                    value={premiumWeb.hero.heading}
                                    onChange={e => setPremiumWeb({ ...premiumWeb, hero: { ...premiumWeb.hero, heading: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Atmospheric Visual</label>
                                <div className="flex gap-4">
                                    <input
                                        className="flex-1 px-8 py-5 rounded-[24px] border-none shadow-inner bg-gray-50 outline-none focus:ring-2 focus:ring-primary-500 text-xs"
                                        value={premiumWeb.hero.image}
                                        onChange={e => setPremiumWeb({ ...premiumWeb, hero: { ...premiumWeb.hero, image: e.target.value } })}
                                        placeholder="Visual URL"
                                    />
                                    <div className="relative">
                                        <input type="file" className="hidden" id="hero-up" onChange={e => handleImageUpload(e, 'hero', (url) => setPremiumWeb({ ...premiumWeb, hero: { ...premiumWeb.hero, image: url } }))} />
                                        <label htmlFor="hero-up" className="flex items-center justify-center w-16 h-full bg-primary-600 text-white rounded-[20px] shadow-lg cursor-pointer hover:bg-primary-700 transition-all">
                                            {uploadingField === 'hero' ? <FiLoader className="animate-spin" /> : <FiUpload />}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Metrics Section */}
                {subActiveTab === 'metrics' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-bold mb-10 flex items-center gap-2 text-gray-900 border-b pb-4">
                            <FiBriefcase className="text-primary-600" /> Impact Metrics
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                            {premiumWeb.stats.map((s, i) => (
                                <div key={i} className="bg-gray-50 p-8 rounded-[32px] shadow-inner text-center">
                                    <input
                                        value={s.value}
                                        onChange={e => { const ns = [...premiumWeb.stats]; ns[i].value = e.target.value; setPremiumWeb({ ...premiumWeb, stats: ns }); }}
                                        className="w-full text-center font-black text-4xl text-primary-600 outline-none bg-transparent"
                                        placeholder="500+"
                                    />
                                    <input
                                        value={s.label}
                                        onChange={e => { const ns = [...premiumWeb.stats]; ns[i].label = e.target.value; setPremiumWeb({ ...premiumWeb, stats: ns }); }}
                                        className="w-full text-center text-[10px] uppercase tracking-widest font-bold text-gray-400 outline-none mt-2 bg-transparent"
                                        placeholder="Happy Clients"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. Mission Section */}
                {subActiveTab === 'mission' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-bold mb-8 flex items-center gap-2 text-gray-900 border-b pb-4">
                            <FiGlobe className="text-primary-600" /> Strategic Mission
                        </h3>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Mission Snapshot</label>
                                    <div className="flex gap-4">
                                        <input className="flex-1 px-6 py-4 rounded-2xl bg-gray-50 border-none shadow-inner outline-none text-xs" value={premiumWeb.about.photo} onChange={e => setPremiumWeb({ ...premiumWeb, about: { ...premiumWeb.about, photo: e.target.value } })} placeholder="Photo URL" />
                                        <div className="relative">
                                            <input type="file" className="hidden" id="about-up" onChange={e => handleImageUpload(e, 'about', (url) => setPremiumWeb({ ...premiumWeb, about: { ...premiumWeb.about, photo: url } }))} />
                                            <label htmlFor="about-up" className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-primary-50 transition-all">
                                                {uploadingField === 'about' ? <FiLoader className="animate-spin" /> : <FiUpload className="text-primary-600" />}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Our Legacy / Story</label>
                                    <textarea
                                        value={premiumWeb.about.mission}
                                        onChange={e => setPremiumWeb({ ...premiumWeb, about: { ...premiumWeb.about, mission: e.target.value } })}
                                        className="w-full px-6 py-4 rounded-[24px] bg-gray-50 border-none shadow-inner min-h-[150px] outline-none text-sm leading-relaxed"
                                        placeholder="Tell your brand story..."
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Visionary Future</label>
                                    <textarea
                                        value={premiumWeb.about.vision}
                                        onChange={e => setPremiumWeb({ ...premiumWeb, about: { ...premiumWeb.about, vision: e.target.value } })}
                                        className="w-full px-6 py-4 rounded-[24px] bg-gray-50 border-none shadow-inner min-h-[150px] outline-none text-sm leading-relaxed"
                                        placeholder="Where are you going?"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Offerings Section */}
                {subActiveTab === 'offerings' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <h3 className="font-bold flex items-center gap-2 text-gray-900">
                                <FiZap className="text-primary-600" /> Elite Offerings
                            </h3>
                            <button
                                onClick={() => setPremiumWeb({ ...premiumWeb, services: [...premiumWeb.services, { title: '', description: '' }] })}
                                className="text-[10px] bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg font-black uppercase tracking-widest hover:bg-primary-700 transition-all"
                            >
                                + Add Offering
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {premiumWeb.services.map((s, i) => (
                                <div key={i} className="bg-gray-50 p-8 rounded-[32px] shadow-sm relative group border border-transparent hover:border-primary-100 transition-all">
                                    <button
                                        onClick={() => {
                                            const ns = premiumWeb.services.filter((_, idx) => idx !== i);
                                            setPremiumWeb({ ...premiumWeb, services: ns });
                                        }}
                                        className="absolute top-6 right-6 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                                    >
                                        ✕
                                    </button>
                                    <input
                                        value={s.title}
                                        onChange={e => { const ns = [...premiumWeb.services]; ns[i].title = e.target.value; setPremiumWeb({ ...premiumWeb, services: ns }); }}
                                        className="w-full font-black text-xl mb-3 outline-none bg-transparent placeholder-gray-300"
                                        placeholder="Service Title"
                                    />
                                    <textarea
                                        value={s.description}
                                        onChange={e => { const ns = [...premiumWeb.services]; ns[i].description = e.target.value; setPremiumWeb({ ...premiumWeb, services: ns }); }}
                                        className="w-full text-sm text-gray-500 outline-none bg-transparent min-h-[80px] leading-relaxed"
                                        placeholder="Brief Description of this elite offering..."
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. Curators Section */}
                {subActiveTab === 'curators' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <h3 className="font-bold flex items-center gap-2 text-gray-900">
                                <FiUsers className="text-primary-600" /> Core Curators
                            </h3>
                            <button
                                onClick={() => setPremiumWeb({ ...premiumWeb, team: [...premiumWeb.team, { name: '', role: '', image: '' }] })}
                                className="text-[10px] bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg font-black uppercase tracking-widest hover:bg-primary-700 transition-all"
                            >
                                + Add Curator
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {premiumWeb.team.map((m, i) => (
                                <div key={i} className="bg-gray-50 p-6 rounded-[32px] border border-transparent hover:border-primary-100 shadow-sm relative group transition-all">
                                    <button
                                        onClick={() => {
                                            const nt = premiumWeb.team.filter((_, idx) => idx !== i);
                                            setPremiumWeb({ ...premiumWeb, team: nt });
                                        }}
                                        className="absolute top-4 right-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm z-10"
                                    >
                                        ✕
                                    </button>
                                    <div className="aspect-square rounded-[24px] bg-white mb-6 overflow-hidden shadow-inner flex items-center justify-center relative group/img">
                                        {m.image ? (
                                            <img src={m.image} className="w-full h-full object-cover" alt="Team" />
                                        ) : (
                                            <FiUsers className="text-4xl text-gray-200" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <input type="file" className="hidden" id={`team-up-${i}`} onChange={e => handleImageUpload(e, `team-${i}`, (url) => {
                                                const nt = [...premiumWeb.team];
                                                nt[i].image = url;
                                                setPremiumWeb({ ...premiumWeb, team: nt });
                                            })} />
                                            <label htmlFor={`team-up-${i}`} className="bg-white p-3 rounded-full cursor-pointer hover:scale-110 transition-transform">
                                                {uploadingField === `team-${i}` ? <FiLoader className="animate-spin text-primary-600" /> : <FiUpload className="text-primary-600" />}
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        value={m.name}
                                        onChange={e => { const nt = [...premiumWeb.team]; nt[i].name = e.target.value; setPremiumWeb({ ...premiumWeb, team: nt }); }}
                                        className="w-full font-black text-lg text-center outline-none bg-transparent mb-1"
                                        placeholder="Full Name"
                                    />
                                    <input
                                        value={m.role}
                                        onChange={e => { const nt = [...premiumWeb.team]; nt[i].role = e.target.value; setPremiumWeb({ ...premiumWeb, team: nt }); }}
                                        className="w-full text-[10px] uppercase tracking-widest font-bold text-primary-500 text-center outline-none bg-transparent"
                                        placeholder="Role/Title"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 7. Portfolio Section */}
                {subActiveTab === 'portfolio' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-bold mb-8 flex items-center gap-2 text-gray-900 border-b pb-4">
                            <FiImage className="text-primary-600" /> Portfolio Nodes
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[0, 1, 2, 3, 4, 5].map(idx => (
                                <div key={idx} className="aspect-square bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group">
                                    {premiumWeb.gallery[idx] ? (
                                        <img src={premiumWeb.gallery[idx]} className="w-full h-full object-cover" alt="Gallery" />
                                    ) : (
                                        <div className="text-center">
                                            <FiImage className="text-3xl text-gray-200 mx-auto mb-2" />
                                            <span className="text-[9px] uppercase font-bold text-gray-300">Space 0{idx + 1}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-4">
                                        <input type="file" className="hidden" id={`gal-up-${idx}`} onChange={e => handleImageUpload(e, `gal-${idx}`, (url) => {
                                            const ng = [...premiumWeb.gallery];
                                            ng[idx] = url;
                                            setPremiumWeb({ ...premiumWeb, gallery: ng });
                                        })} />
                                        <label htmlFor={`gal-up-${idx}`} className="bg-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform mb-3 shadow-xl">
                                            {uploadingField === `gal-${idx}` ? <FiLoader className="animate-spin text-primary-600" /> : <FiUpload className="text-primary-600" />}
                                        </label>
                                        <input
                                            value={premiumWeb.gallery[idx] || ''}
                                            onChange={e => {
                                                const ng = [...premiumWeb.gallery];
                                                ng[idx] = e.target.value;
                                                setPremiumWeb({ ...premiumWeb, gallery: ng });
                                            }}
                                            className="w-full bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] text-white outline-none placeholder-white/40"
                                            placeholder="or paste URL"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 8. Echoes Section */}
                {subActiveTab === 'echoes' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <h3 className="font-bold flex items-center gap-2 text-gray-900">
                                <FiStar className="text-primary-600" /> Client Echoes
                            </h3>
                            <button
                                onClick={() => setPremiumWeb({ ...premiumWeb, testimonials: [...premiumWeb.testimonials, { author: '', text: '', stars: 5 }] })}
                                className="text-[10px] bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg font-black uppercase tracking-widest hover:bg-primary-700 transition-all"
                            >
                                + Add Echo
                            </button>
                        </div>
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {premiumWeb.testimonials.map((t, i) => (
                                <div key={i} className="bg-gray-50 p-8 rounded-[40px] shadow-sm relative group border border-transparent hover:border-primary-100 transition-all">
                                    <button
                                        onClick={() => {
                                            const nt = premiumWeb.testimonials.filter((_, idx) => idx !== i);
                                            setPremiumWeb({ ...premiumWeb, testimonials: nt });
                                        }}
                                        className="absolute top-6 right-6 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm"
                                    >
                                        ✕
                                    </button>
                                    <textarea
                                        value={t.text}
                                        onChange={e => { const nt = [...premiumWeb.testimonials]; nt[i].text = e.target.value; setPremiumWeb({ ...premiumWeb, testimonials: nt }); }}
                                        className="w-full text-center text-lg italic text-gray-600 outline-none bg-transparent mb-6 min-h-[100px] leading-relaxed"
                                        placeholder="The client's voice goes here..."
                                    />
                                    <input
                                        value={t.author}
                                        onChange={e => { const nt = [...premiumWeb.testimonials]; nt[i].author = e.target.value; setPremiumWeb({ ...premiumWeb, testimonials: nt }); }}
                                        className="w-full text-center text-xs font-black uppercase tracking-[0.3em] text-primary-600 outline-none bg-transparent"
                                        placeholder="Signature / Designation"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 9. Atelier Section */}
                {subActiveTab === 'atelier' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-bold mb-8 flex items-center gap-2 text-gray-900 border-b pb-4">
                            <FiMapPin className="text-primary-600" /> Atelier Connectivity
                        </h3>
                        <div className="grid gap-6 max-w-xl mx-auto">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Physical Headquarters</label>
                                <input
                                    value={premiumWeb.contact.address}
                                    onChange={e => setPremiumWeb({ ...premiumWeb, contact: { ...premiumWeb.contact, address: e.target.value } })}
                                    className="w-full px-8 py-5 rounded-[24px] bg-gray-50 border-none shadow-inner outline-none font-bold"
                                    placeholder="Signature Tower, Level 42, Mumbai"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Hours of Availability</label>
                                <input
                                    value={premiumWeb.contact.workingHours}
                                    onChange={e => setPremiumWeb({ ...premiumWeb, contact: { ...premiumWeb.contact, workingHours: e.target.value } })}
                                    className="w-full px-8 py-5 rounded-[24px] bg-gray-50 border-none shadow-inner outline-none font-bold"
                                    placeholder="Mon - Sat: 10:00 AM - 07:00 PM"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* 10. Identity Section */}
                {subActiveTab === 'nodes' && (
                    <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="font-bold mb-8 flex items-center gap-2 text-gray-900 border-b pb-4">
                            <FiCheck className="text-primary-600" /> Digital Identity & Nodes
                        </h3>
                        <div className="grid gap-8 max-w-xl mx-auto">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Navbar Branding Subtitle</label>
                                <input
                                    value={premiumWeb.navbar.subtitle}
                                    onChange={e => setPremiumWeb({ ...premiumWeb, navbar: { ...premiumWeb.navbar, subtitle: e.target.value } })}
                                    className="w-full px-8 py-5 rounded-[24px] bg-gray-50 border-none shadow-inner outline-none font-bold"
                                    placeholder="e.g. Defining Modernity"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">WhatsApp Node</label>
                                    <input
                                        value={premiumWeb.footer.whatsapp}
                                        onChange={e => setPremiumWeb({ ...premiumWeb, footer: { ...premiumWeb.footer, whatsapp: e.target.value } })}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none shadow-inner outline-none text-xs"
                                        placeholder="Target Phone Number"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Instagram Node</label>
                                    <input
                                        value={premiumWeb.footer.instagram}
                                        onChange={e => setPremiumWeb({ ...premiumWeb, footer: { ...premiumWeb.footer, instagram: e.target.value } })}
                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none shadow-inner outline-none text-xs"
                                        placeholder="Profile Link"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumWebEditor;
