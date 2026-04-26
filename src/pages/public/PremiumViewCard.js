import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { premiumService } from '../../services/premiumService';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiLinkedin, FiTwitter, FiGlobe, FiCheck, FiArrowRight, FiStar } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// --- PREMIUM ELITE FRONTEND ---
const EliteHomeLayout = ({ card }) => {
    const { basicInfo, about, contact, premiumWeb, theme } = card;
    const web = premiumWeb || {};

    return (
        <div className="min-h-screen bg-[#faf9f6] text-[#1a1a1a] selection:bg-[#bf953f] selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;600;800&display=swap');
                    .serif { font-family: 'Playfair Display', serif; }
                    .sans { font-family: 'Inter', sans-serif; }
                    .gold-text { color: #bf953f; }
                    .gold-bg { background: #bf953f; }
                    .charcoal-bg { background: #121212; }
                    
                    .glass-nav {
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        background: rgba(255, 255, 255, 0.8);
                    }

                    .gold-frame {
                        border: 1px solid #bf953f;
                        padding: 20px;
                        position: relative;
                    }
                    .gold-frame::after {
                        content: '';
                        position: absolute;
                        top: -10px;
                        left: -10px;
                        right: -10px;
                        bottom: -10px;
                        border: 1px solid #bf953f;
                        opacity: 0.3;
                    }

                    .service-card:hover {
                        border-bottom: 4px solid #bf953f;
                    }

                    .grayscale-hover {
                        filter: grayscale(100%);
                        transition: all 0.5s ease;
                    }
                    .grayscale-hover:hover {
                        filter: grayscale(0%);
                        transform: scale(1.05);
                    }

                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-up { animation: slideUp 1s ease-out forwards; }
                `}
            </style>

            {/* 1. Navbar */}
            <nav className="fixed top-0 w-full z-50 glass-nav border-b border-black/5 h-24">
                <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                    <div>
                        <h1 className="serif text-2xl font-black tracking-tight">{basicInfo?.businessName || 'Elite Brand'}</h1>
                        <p className="sans text-[10px] uppercase tracking-[0.4em] gold-text font-bold">{web.navbar?.subtitle || 'Defining Luxury'}</p>
                    </div>
                    <div className="hidden md:flex gap-10 sans text-[11px] uppercase tracking-widest font-bold">
                        <a href="#about" className="hover:gold-text transition-colors">Legacy</a>
                        <a href="#services" className="hover:gold-text transition-colors">Offerings</a>
                        <a href="#team" className="hover:gold-text transition-colors">Curators</a>
                        <a href="#contact" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all">Inquire Now</a>
                    </div>
                </div>
            </nav>

            {/* 2. Hero Split */}
            <section className="pt-24 min-h-screen flex items-center">
                <div className="max-w-7xl mx-auto px-8 w-full grid md:grid-cols-2 gap-16 items-center">
                    <div className="animate-up">
                        <span className="inline-block px-4 py-1 rounded-full border border-black/10 text-[10px] uppercase tracking-widest font-bold mb-6">
                            {web.hero?.badge || 'Limited Edition'}
                        </span>
                        <h1 className="serif text-6xl md:text-8xl font-black leading-tight mb-8">
                            {web.hero?.heading || 'Bespoke Excellence Redefined.'}
                        </h1>
                        <p className="sans text-xl text-gray-500 max-w-md mb-10 font-light leading-relaxed">
                            {basicInfo?.title || 'World Class Digital Consulting & Strategy.'}
                        </p>
                        <div className="flex gap-6">
                            <button className="gold-bg text-white px-10 py-5 rounded-full font-bold shadow-xl shadow-gold/20 flex items-center gap-2">
                                Start Experience <FiArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className="relative animate-up" style={{ animationDelay: '0.3s' }}>
                        <div className="aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl">
                            <img
                                src={web.hero?.image || 'https://images.unsplash.com/photo-1600880212340-02344079b85c?auto=format&fit=crop&q=80'}
                                className="w-full h-full object-cover"
                                alt="Hero"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 charcoal-bg p-8 rounded-[30px] shadow-2xl text-white max-w-[200px]">
                            <p className="serif text-3xl font-bold mb-2">100%</p>
                            <p className="sans text-[10px] uppercase tracking-widest opacity-60">Success rate in global strategy</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Stats Strip */}
            <section className="charcoal-bg py-24">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    {(web.stats || []).map((stat, i) => (
                        <div key={i}>
                            <h3 className="serif text-5xl md:text-6xl font-bold gold-text mb-2">{stat.value}</h3>
                            <p className="sans text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. About */}
            <section id="about" className="py-32 px-8 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-24 items-center">
                    <div className="gold-frame rounded-2xl">
                        <img
                            src={web.about?.photo || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80'}
                            className="w-full aspect-square object-cover rounded-xl"
                            alt="About"
                        />
                    </div>
                    <div>
                        <h2 className="serif text-5xl mb-12">The Pillars of <br /><span className="gold-text">Our Legacy</span></h2>
                        <div className="space-y-12">
                            <div className="flex gap-8">
                                <div className="text-4xl serif gold-text opacity-30 italic">01</div>
                                <div>
                                    <h4 className="sans font-black uppercase text-xs tracking-widest mb-4">Our Mission</h4>
                                    <p className="sans text-gray-500 leading-relaxed font-light">{web.about?.mission || 'To provide unparalleled luxury experiences through digital innovation.'}</p>
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="text-4xl serif gold-text opacity-30 italic">02</div>
                                <div>
                                    <h4 className="sans font-black uppercase text-xs tracking-widest mb-4">Our Vision</h4>
                                    <p className="sans text-gray-500 leading-relaxed font-light">{web.about?.vision || 'Setting the gold standard for global business intelligence.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Services */}
            <section id="services" className="py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-8 text-center mb-20">
                    <h2 className="serif text-5xl">Our Exclusive <span className="italic font-normal">Offerings</span></h2>
                </div>
                <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-8">
                    {(web.services || []).map((service, i) => (
                        <div key={i} className="bg-white p-12 rounded-[40px] shadow-xl shadow-black/5 transition-all service-card">
                            <div className="w-16 h-16 gold-bg rounded-2xl mb-8 flex items-center justify-center text-white text-2xl">
                                {i === 0 ? <FiStar /> : i === 1 ? <FiGlobe /> : <FiCheck />}
                            </div>
                            <h3 className="serif text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="sans text-gray-500 leading-relaxed font-light">{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Gallery Masonry */}
            <section id="gallery" className="py-32 px-4 max-w-7xl mx-auto">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {(web.gallery && web.gallery.length > 0 ? web.gallery : [
                        'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
                        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
                        'https://images.unsplash.com/photo-1552664730-d307ca884978',
                        'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
                        'https://images.unsplash.com/photo-1556761175-b413da4baf72'
                    ]).filter(url => url && url.trim() !== '').map((url, i) => (
                        <img key={i} src={`${url}?auto=format&fit=crop&q=80&w=800`} className="w-full rounded-[30px] grayscale-hover" alt="Gallery" />
                    ))}
                </div>
            </section>

            {/* 7. Team */}
            <section id="team" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-8 text-center mb-24">
                    <h2 className="serif text-5xl mb-4">The Masterminds</h2>
                    <p className="sans text-xs uppercase tracking-[0.5em] gold-text font-bold">World Class Talent</p>
                </div>
                <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12">
                    {(web.team || []).map((m, i) => (
                        <div key={i} className="group overflow-hidden">
                            <div className="aspect-[3/4] rounded-[40px] overflow-hidden mb-6 relative">
                                <img src={m.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={m.name} />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><FiLinkedin /></div>
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><FiTwitter /></div>
                                </div>
                            </div>
                            <div className="text-center group-hover:-translate-y-2 transition-transform">
                                <h3 className="serif text-2xl font-bold">{m.name}</h3>
                                <p className="sans text-[10px] uppercase tracking-widest gold-text font-bold mt-1">{m.role}</p>
                                <div className="w-12 h-0.5 gold-bg mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-all"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. Testimonials */}
            <section id="testimonials" className="charcoal-bg py-32 text-center text-white">
                <div className="max-w-4xl mx-auto px-8">
                    <FiStar className="text-5xl gold-text mx-auto mb-10" />
                    {(web.testimonials || []).map((t, i) => (
                        <div key={i}>
                            <p className="serif text-3xl md:text-5xl italic leading-relaxed mb-12">"{t.text}"</p>
                            <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 grayscale">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200" alt="Author" />
                            </div>
                            <h4 className="sans font-black uppercase text-xs tracking-[0.3em] gold-text">{t.author}</h4>
                            <div className="flex justify-center gap-1 mt-4">
                                {[...Array(t.stars || 5)].map((_, j) => <FiStar key={j} className="text-yellow-500 fill-yellow-500" size={14} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 9. Contact Split */}
            <section id="contact" className="py-32 bg-[#faf9f6]">
                <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="serif text-6xl mb-12">Let's Craft Your <br /><span className="gold-text">Success Story.</span></h2>
                        <div className="space-y-10">
                            <div>
                                <h4 className="sans text-[10px] uppercase tracking-widest font-black opacity-40 mb-2">Direct Line</h4>
                                <p className="serif text-2xl font-bold">{contact?.phone || '+91 888 000 0000'}</p>
                            </div>
                            <div>
                                <h4 className="sans text-[10px] uppercase tracking-widest font-black opacity-40 mb-2">Digital Inquiry</h4>
                                <p className="serif text-2xl font-bold">{contact?.email || 'private@brand.com'}</p>
                            </div>
                            <div>
                                <h4 className="sans text-[10px] uppercase tracking-widest font-black opacity-40 mb-2">Atelier Address</h4>
                                <p className="serif text-2xl font-bold">{web.contact?.address || 'Signature Tower, Level 42, Mumbai'}</p>
                            </div>
                        </div>
                    </div>
                    <form className="bg-white p-12 rounded-[50px] shadow-2xl border border-black/5">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <input placeholder="Full Name" className="bg-gray-50 p-5 rounded-2xl outline-none border border-transparent focus:border-gold-text" />
                            <input placeholder="Email" className="bg-gray-50 p-5 rounded-2xl outline-none border border-transparent focus:border-gold-text" />
                        </div>
                        <input placeholder="Subject" className="w-full bg-gray-50 p-5 rounded-2xl outline-none border border-transparent focus:border-gold-text mb-6" />
                        <textarea placeholder="Your Message" rows="5" className="w-full bg-gray-50 p-5 rounded-2xl outline-none border border-transparent focus:border-gold-text mb-8"></textarea>
                        <button className="w-full charcoal-bg text-white py-6 rounded-full font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">Send Inquiry</button>
                    </form>
                </div>
            </section>

            {/* 10. Footer */}
            <footer className="charcoal-bg py-24 text-white border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-16 mb-20">
                    <div className="col-span-2">
                        <h2 className="serif text-4xl font-black mb-6">{basicInfo?.businessName || 'Elite Brand'}</h2>
                        <p className="sans text-gray-500 max-w-sm font-light leading-relaxed">
                            A boutique digital agency specializing in premium strategic consulting for global visionaries.
                        </p>
                    </div>
                    <div>
                        <h4 className="sans font-black text-xs uppercase tracking-widest mb-8">Navigation</h4>
                        <ul className="space-y-4 text-gray-500 sans text-sm">
                            <li><a href="#about" className="hover:text-white transition-colors">Legacy</a></li>
                            <li><a href="#services" className="hover:text-white transition-colors">Offerings</a></li>
                            <li><a href="#team" className="hover:text-white transition-colors">Curators</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="sans font-black text-xs uppercase tracking-widest mb-8">Connections</h4>
                        <div className="flex gap-6 text-2xl">
                            <FiInstagram className="hover:gold-text cursor-pointer transition-colors" />
                            <FiLinkedin className="hover:gold-text cursor-pointer transition-colors" />
                            <FiTwitter className="hover:gold-text cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 border-t border-white/5 pt-12 flex justify-between items-center opacity-40 sans text-[10px] uppercase tracking-[0.4em]">
                    <p>© {new Date().getFullYear()} Elite Digital. All Rights Reserved.</p>
                    <p>Designed by Zenith Studio</p>
                </div>

                {/* WhatsApp Float */}
                <a
                    href={`https://wa.me/${web.footer?.whatsapp || '910000000000'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-10 right-10 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl shadow-2xl hover:scale-110 transition-transform z-[100]"
                >
                    <FaWhatsapp />
                </a>
            </footer>
        </div>
    );
};

// --- MAIN COMPONENT ---
const PremiumViewCard = () => {
    const { slug } = useParams();
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCard = async () => {
            try {
                const data = await premiumService.getExperienceBySlug(slug);
                if (data) {
                    setCard(data);
                }
            } catch (error) {
                console.error('Error loading premium card:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCard();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
                <div className="text-center">
                    <div className="w-12 h-[1px] bg-black animate-pulse mx-auto mb-4"></div>
                    <p className="uppercase tracking-[0.3em] text-[10px] font-bold">Initializing Elite Space</p>
                </div>
            </div>
        );
    }

    if (!card) return <div>Not Found</div>;

    // Use EliteHomeLayout if premiumWeb data exists, otherwise fall back to previous layouts
    if (card.premiumWeb || card.premiumLayout === 'gold') {
        return <EliteHomeLayout card={card} />;
    }

    // Previous Layout Logic
    return <div>Previous Layout Rendered</div>;
};

export default PremiumViewCard;
