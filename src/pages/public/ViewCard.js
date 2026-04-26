import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cardService } from '../../services/cardService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube, FiClock, FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaTelegram, FaTiktok, FaPinterest, FaSnapchat } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import PublicOnlineBooking from '../../components/public/PublicOnlineBooking';
import PublicTableBooking from '../../components/public/PublicTableBooking';
import PublicServices from '../../components/public/PublicServices';
import PublicGallery from '../../components/public/PublicGallery';
import PublicTeam from '../../components/public/PublicTeam';
import PublicOnlineOrders from '../../components/public/PublicOnlineOrders';
import PublicBeforeAfterGallery from '../../components/public/PublicBeforeAfterGallery';
import PublicCategories from '../../components/public/PublicCategories';
import PublicSpecialOffers from '../../components/public/PublicSpecialOffers';
import PublicStoreLocation from '../../components/public/PublicStoreLocation';
import PublicVirtualTours from '../../components/public/PublicVirtualTours';
import PublicRooms from '../../components/public/PublicRooms';
import PublicAdmissionForm from '../../components/public/PublicAdmissionForm';

const ViewCard = () => {
  const { slug } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  
  // Cart state for online ordering
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    tableNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadCard = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isPreview = urlParams.get('preview') === 'true';
      
      let data;
      if (isPreview) {
        const cardsRef = collection(db, 'cards');
        const q = query(cardsRef, where('slug', '==', slug));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          data = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        }
      } else {
        data = await cardService.getCardBySlug(slug);
      }
      
      if (data) {
        setCard(data);
        if (!isPreview) {
          await cardService.trackView(data.id);
        }
      }
    } catch (error) {
      console.error('Error loading card:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cart functions for online ordering
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    toast.info('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const order = {
        id: uuidv4(),
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        tableNumber: customerInfo.tableNumber,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          category: item.category
        })),
        totalAmount: calculateTotal(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get current orders - need to fetch fresh data from database
      const freshCard = await cardService.getCard(card.id);
      const currentOrders = freshCard.onlineOrders?.orders || [];
      const currentStats = freshCard.onlineOrders?.statistics || {};

      // Update statistics
      const today = new Date().toDateString();
      const todayOrders = currentOrders.filter(o => new Date(o.createdAt).toDateString() === today);
      
      const updatedStats = {
        total: currentOrders.length + 1,
        pending: (currentStats.pending || 0) + 1,
        preparing: currentStats.preparing || 0,
        ready: currentStats.ready || 0,
        delivered: currentStats.delivered || 0,
        cancelled: currentStats.cancelled || 0,
        todayOrders: todayOrders.length + 1,
        todayRevenue: todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) + calculateTotal()
      };

      // Update card with new order using updateCardSection
      await cardService.updateCardSection(card.id, 'onlineOrders', {
        ...freshCard.onlineOrders,
        orders: [...currentOrders, order],
        statistics: updatedStats
      });

      toast.success('Order placed successfully! 🎉');
      
      // Reset form
      setCart([]);
      setShowCheckout(false);
      setShowCart(false);
      setCustomerInfo({
        name: '',
        phone: '',
        tableNumber: ''
      });

      // Show order confirmation
      alert(`Order #${order.id.slice(0, 8)} placed successfully!\n\nTable: ${order.tableNumber}\nTotal: $${calculateTotal().toFixed(2)}\n\nYour order will be prepared shortly. Thank you!`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Card Not Found</h1>
          <p className="text-gray-600">The card you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const theme = card.theme || {};
  const basicInfo = card.basicInfo || {};
  const about = card.about || {};
  const contact = card.contact || {};
  const enabledFeatures = card.enabledFeatures || [];
  const isPreview = new URLSearchParams(window.location.search).get('preview') === 'true';

  // Build navigation
  const navItems = [
    { id: 'home', label: 'Home', always: true },
    { id: 'about', label: 'About', always: true },
    { id: 'gallery', label: 'Gallery', always: true }
  ];

  enabledFeatures.forEach(feature => {
    if (feature === 'Service Menu' || feature === 'Services List' || feature === 'Training Programs' || feature === 'Course Catalog') {
      if (!navItems.find(item => item.id === 'services')) {
        navItems.push({ id: 'services', label: feature === 'Training Programs' ? 'Programs' : feature === 'Course Catalog' ? 'Courses' : 'Services' });
      }
    }
    if (feature === 'Digital Menu') {
      if (!navItems.find(item => item.id === 'menu')) {
        navItems.push({ id: 'menu', label: 'Menu' });
      }
    }
    if (feature === 'Online Booking' || feature === 'Appointment Booking') {
      if (!navItems.find(item => item.id === 'booking')) {
        navItems.push({ id: 'booking', label: 'Book Now' });
      }
    }
    if (feature === 'Table Booking') {
      if (!navItems.find(item => item.id === 'table-booking')) {
        navItems.push({ id: 'table-booking', label: 'Reserve Table' });
      }
    }
    if (feature === 'Online Orders') {
      if (!navItems.find(item => item.id === 'online-orders')) {
        navItems.push({ id: 'online-orders', label: 'Order Online' });
      }
    }
    if (feature === 'Team Profiles' || feature === 'Doctor Profiles' || feature === 'Trainer Profiles' || feature === 'Faculty Profiles' || feature === 'Agent Profile') {
      if (!navItems.find(item => item.id === 'team')) {
        navItems.push({ id: 'team', label: feature === 'Agent Profile' ? 'Our Agents' : feature === 'Doctor Profiles' ? 'Our Doctors' : feature === 'Trainer Profiles' ? 'Our Trainers' : feature === 'Faculty Profiles' ? 'Faculty' : 'Our Team' });
      }
    }
    if (feature === 'Product Catalog' || feature === 'Property Listings' || feature === 'Membership Plans' || feature === 'Achievements') {
      if (!navItems.find(item => item.id === 'products')) {
        navItems.push({ id: 'products', label: feature === 'Property Listings' ? 'Properties' : feature === 'Membership Plans' ? 'Membership' : feature === 'Achievements' ? 'Achievements' : 'Products' });
      }
    }
    if (feature === 'Room Showcase') {
      if (!navItems.find(item => item.id === 'rooms')) {
        navItems.push({ id: 'rooms', label: 'Rooms' });
      }
    }
    if (feature === 'Booking System') {
      if (!navItems.find(item => item.id === 'room-booking')) {
        navItems.push({ id: 'room-booking', label: 'Book Room' });
      }
    }
    if (feature === 'Clinic Hours') {
      if (!navItems.find(item => item.id === 'clinic-hours')) {
        navItems.push({ id: 'clinic-hours', label: 'Hours' });
      }
    }
    if (feature === 'Categories') {
      if (!navItems.find(item => item.id === 'categories')) {
        navItems.push({ id: 'categories', label: 'Categories' });
      }
    }
    if (feature === 'Special Offers') {
      if (!navItems.find(item => item.id === 'special-offers')) {
        navItems.push({ id: 'special-offers', label: 'Offers' });
      }
    }
    if (feature === 'Store Location') {
      if (!navItems.find(item => item.id === 'store-location')) {
        navItems.push({ id: 'store-location', label: 'Location' });
      }
    }
    if (feature === 'Virtual Tours') {
      if (!navItems.find(item => item.id === 'virtual-tours')) {
        navItems.push({ id: 'virtual-tours', label: 'Virtual Tours' });
      }
    }
    if (feature === 'Admission Info') {
      if (!navItems.find(item => item.id === 'admission')) {
        navItems.push({ id: 'admission', label: 'Apply Now' });
      }
    }
  });

  // Add Before/After Gallery to nav if there's data and it's not explicitly disabled
  if (card.beforeAfter?.items?.length > 0 && card.beforeAfter?.enabled !== false) {
    if (!navItems.find(item => item.id === 'before-after')) {
      navItems.push({ id: 'before-after', label: 'Before/After' });
    }
  }

  navItems.push({ id: 'contact', label: 'Contact', always: true });

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    
    // If clicking "Order Online", scroll to menu section instead
    if (sectionId === 'online-orders') {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection('menu');
        return;
      }
    }
    
    // If clicking "Book Room", scroll to rooms section where booking happens
    if (sectionId === 'room-booking') {
      const roomsSection = document.getElementById('rooms');
      if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection('rooms');
        return;
      }
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: theme.fontFamily || 'Inter' }}>
      {isPreview && (
        <div className="bg-yellow-500 text-white py-2 px-4 text-center font-medium">
          Preview Mode - This is how your card will look when published
        </div>
      )}

      {/* Header */}
      <header 
        className="sticky top-0 z-40 bg-white shadow-md"
        style={{ borderBottom: `3px solid ${theme.primaryColor || '#0ea5e9'}` }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              {basicInfo.logo && (
                <img src={basicInfo.logo} alt="Logo" className="h-12 w-12 object-contain" />
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                  {basicInfo.businessName || basicInfo.name}
                </h1>
                {basicInfo.title && (
                  <p className="text-sm text-gray-600">{basicInfo.title}</p>
                )}
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors ${
                    activeSection === item.id ? 'border-b-2' : 'hover:opacity-70'
                  }`}
                  style={{
                    color: activeSection === item.id ? theme.primaryColor : theme.secondaryColor || '#666',
                    borderColor: theme.primaryColor
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section 
        id="home" 
        className="relative py-20 px-4"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor || '#0ea5e9'} 0%, ${theme.secondaryColor || '#0369a1'} 100%)`
        }}
      >
        <div className="container mx-auto text-center text-white">
          {basicInfo.profileImage && (
            <img
              src={basicInfo.profileImage}
              alt={basicInfo.name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg object-cover"
            />
          )}
          <h2 className="text-5xl font-bold mb-4">{basicInfo.name}</h2>
          {basicInfo.title && <p className="text-2xl mb-6">{basicInfo.title}</p>}
          {basicInfo.businessName && <p className="text-xl mb-8">{basicInfo.businessName}</p>}
          
          <div className="flex justify-center gap-4 flex-wrap">
            {basicInfo.phone && (
              <a
                href={`tel:${basicInfo.phone}`}
                className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center"
              >
                <FiPhone className="mr-2" />
                Call Now
              </a>
            )}
            {basicInfo.email && (
              <a
                href={`mailto:${basicInfo.email}`}
                className="bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center"
              >
                <FiMail className="mr-2" />
                Email Us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-8" style={{ color: theme.primaryColor }}>
            About Us
          </h2>
          {about.description && (
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">{about.description}</p>
          )}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {about.mission && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-3" style={{ color: theme.secondaryColor }}>
                  Our Mission
                </h3>
                <p className="text-gray-600">{about.mission}</p>
              </div>
            )}
            {about.vision && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-2xl font-bold mb-3" style={{ color: theme.secondaryColor }}>
                  Our Vision
                </h3>
                <p className="text-gray-600">{about.vision}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      {navItems.find(item => item.id === 'services') && (
        <section id="services" className="py-16 px-4">
          <div className="container mx-auto">
            <PublicServices card={card} />
          </div>
        </section>
      )}

      {/* Menu (Digital Menu for restaurants) */}
      {navItems.find(item => item.id === 'menu') && (
        <section id="menu" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-bold" style={{ color: theme.primaryColor }}>
                Our Menu
              </h2>
              {enabledFeatures.includes('Online Orders') && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center gap-2 font-medium"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                      {cart.length}
                    </span>
                  )}
                </button>
              )}
            </div>
            {card.products?.items && card.products.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {card.products.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold" style={{ color: theme.secondaryColor }}>
                          {item.name}
                        </h3>
                        {item.price && (
                          <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                            ${item.price}
                          </span>
                        )}
                      </div>
                      {item.category && (
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 mb-2">
                          {item.category}
                        </span>
                      )}
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      )}
                      {enabledFeatures.includes('Online Orders') && (
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 font-medium"
                        >
                          <FiPlus className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No menu items available yet.</p>
            )}
          </div>
        </section>
      )}

      {/* Products (Product Catalog, Property Listings) */}
      {navItems.find(item => item.id === 'products') && card.products?.items && card.products.items.length > 0 && (
        <section id="products" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
              {enabledFeatures.includes('Property Listings') ? 'Our Properties' : 'Our Products'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {card.products.items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold" style={{ color: theme.secondaryColor }}>
                        {item.name}
                      </h3>
                      {item.price && (
                        <span className="text-lg font-bold" style={{ color: theme.primaryColor }}>
                          ${item.price}
                        </span>
                      )}
                    </div>
                    {item.category && (
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700 mb-2">
                        {item.category}
                      </span>
                    )}
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rooms (Room Showcase) */}
      {navItems.find(item => item.id === 'rooms') && (
        <section id="rooms" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <PublicRooms card={card} />
          </div>
        </section>
      )}

      {/* Room Booking System */}
      {navItems.find(item => item.id === 'room-booking') && (
        <section id="room-booking" className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
              Book a Room
            </h2>
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <p className="text-center text-gray-600 mb-6">
                Select a room from our showcase above to make a booking, or contact us directly for assistance.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <FiPhone />
                    Call to Book
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    <FiMail />
                    Email Us
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking (Online Booking/Appointment Booking) */}
      {navItems.find(item => item.id === 'booking') && (
        <section id="booking" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <PublicOnlineBooking card={card} />
          </div>
        </section>
      )}

      {/* Table Booking */}
      {navItems.find(item => item.id === 'table-booking') && (
        <section id="table-booking" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <PublicTableBooking card={card} />
          </div>
        </section>
      )}

      {/* Online Orders */}
      {navItems.find(item => item.id === 'online-orders') && (
        <section id="online-orders" className="py-16 px-4">
          <div className="container mx-auto">
            <PublicOnlineOrders card={card} />
          </div>
        </section>
      )}

      {/* Team */}
      {navItems.find(item => item.id === 'team') && (
        <section id="team" className="py-16 px-4">
          <div className="container mx-auto">
            <PublicTeam card={card} />
          </div>
        </section>
      )}

      {/* Categories */}
      {navItems.find(item => item.id === 'categories') && (
        <section id="categories" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <PublicCategories card={card} />
          </div>
        </section>
      )}

      {/* Special Offers */}
      {navItems.find(item => item.id === 'special-offers') && (
        <section id="special-offers" className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <PublicSpecialOffers card={card} />
          </div>
        </section>
      )}

      {/* Store Location */}
      {navItems.find(item => item.id === 'store-location') && (
        <section id="store-location" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <PublicStoreLocation card={card} />
          </div>
        </section>
      )}

      {/* Virtual Tours */}
      {navItems.find(item => item.id === 'virtual-tours') && (
        <section id="virtual-tours" className="py-16 px-4">
          <div className="container mx-auto">
            <PublicVirtualTours card={card} />
          </div>
        </section>
      )}

      {/* Gallery */}
      {navItems.find(item => item.id === 'gallery') && (
        <section id="gallery" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <PublicGallery card={card} />
          </div>
        </section>
      )}

      {/* Before/After Gallery */}
      <section id="before-after" className="py-16 px-4">
        <div className="container mx-auto">
          <PublicBeforeAfterGallery card={card} />
        </div>
      </section>

      {/* Clinic Hours */}
      {navItems.find(item => item.id === 'clinic-hours') && card.contact?.businessHours && (
        <section id="clinic-hours" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
              Operating Hours
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                  const dayHours = card.contact.businessHours[day] || { open: '09:00', close: '18:00', closed: false };
                  
                  const formatTime = (time) => {
                    if (!time) return '';
                    const [hours, minutes] = time.split(':');
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? 'PM' : 'AM';
                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    return `${displayHour}:${minutes} ${ampm}`;
                  };

                  return (
                    <div key={day} className="flex items-center justify-between py-4 border-b last:border-b-0">
                      <span className="font-semibold capitalize text-lg" style={{ color: theme.secondaryColor }}>
                        {day}
                      </span>
                      <span className={`text-lg font-medium ${dayHours.closed ? 'text-red-600' : 'text-green-600'}`}>
                        {dayHours.closed ? 'Closed' : `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Admission Form */}
      {navItems.find(item => item.id === 'admission') && (
        <section id="admission" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <PublicAdmissionForm card={card} />
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primaryColor }}>
            Get In Touch
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6" style={{ color: theme.secondaryColor }}>
                Contact Information
              </h3>
              
              {(contact.email || basicInfo.email) && (
                <div className="flex items-start">
                  <FiMail className="text-2xl mr-4 mt-1 flex-shrink-0" style={{ color: theme.primaryColor }} />
                  <div>
                    <h4 className="font-bold mb-1">Email</h4>
                    <a href={`mailto:${contact.email || basicInfo.email}`} className="text-gray-600 hover:underline break-all">
                      {contact.email || basicInfo.email}
                    </a>
                  </div>
                </div>
              )}
              
              {(contact.phone || basicInfo.phone) && (
                <div className="flex items-start">
                  <FiPhone className="text-2xl mr-4 mt-1 flex-shrink-0" style={{ color: theme.primaryColor }} />
                  <div>
                    <h4 className="font-bold mb-1">Phone</h4>
                    <a href={`tel:${contact.phone || basicInfo.phone}`} className="text-gray-600 hover:underline">
                      {contact.phone || basicInfo.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {(contact.address || contact.city || contact.state || contact.country) && (
                <div className="flex items-start">
                  <FiMapPin className="text-2xl mr-4 mt-1 flex-shrink-0" style={{ color: theme.primaryColor }} />
                  <div>
                    <h4 className="font-bold mb-1">Address</h4>
                    <p className="text-gray-600">
                      {contact.address && <>{contact.address}<br /></>}
                      {contact.city && <>{contact.city}{contact.state && `, ${contact.state}`}<br /></>}
                      {contact.country && <>{contact.country} {contact.zipCode}</>}
                    </p>
                  </div>
                </div>
              )}
              
              {(contact.website || basicInfo.website) && (
                <div className="flex items-start">
                  <FiGlobe className="text-2xl mr-4 mt-1 flex-shrink-0" style={{ color: theme.primaryColor }} />
                  <div>
                    <h4 className="font-bold mb-1">Website</h4>
                    <a href={contact.website || basicInfo.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline break-all">
                      {contact.website || basicInfo.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Social Media & Business Hours */}
            <div className="space-y-8">
              {/* Social Media */}
              {contact.socialLinks && Object.values(contact.socialLinks).some(link => link) && (
                <div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: theme.secondaryColor }}>
                    Follow Us
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {contact.socialLinks.facebook && (
                      <a href={contact.socialLinks.facebook} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Facebook">
                        <FiFacebook className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.twitter && (
                      <a href={contact.socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Twitter/X">
                        <FiTwitter className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.instagram && (
                      <a href={contact.socialLinks.instagram} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Instagram">
                        <FiInstagram className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.linkedin && (
                      <a href={contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="LinkedIn">
                        <FiLinkedin className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.youtube && (
                      <a href={contact.socialLinks.youtube} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="YouTube">
                        <FiYoutube className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.whatsapp && (
                      <a href={`https://wa.me/${contact.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="WhatsApp">
                        <FaWhatsapp className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.telegram && (
                      <a href={contact.socialLinks.telegram} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Telegram">
                        <FaTelegram className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.tiktok && (
                      <a href={contact.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="TikTok">
                        <FaTiktok className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.pinterest && (
                      <a href={contact.socialLinks.pinterest} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Pinterest">
                        <FaPinterest className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                    {contact.socialLinks.snapchat && (
                      <a href={contact.socialLinks.snapchat} target="_blank" rel="noopener noreferrer" 
                         className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Snapchat">
                        <FaSnapchat className="text-2xl" style={{ color: theme.primaryColor }} />
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {/* Business Hours */}
              {contact.businessHours && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.secondaryColor }}>
                    <FiClock />
                    Business Hours
                  </h3>
                  <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                      const hours = contact.businessHours[day];
                      if (!hours) return null;
                      
                      return (
                        <div key={day} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span className="font-medium capitalize text-gray-700">{day}</span>
                          <span className="text-gray-600">
                            {hours.closed ? (
                              <span className="text-red-600 font-medium">Closed</span>
                            ) : (
                              `${hours.open} - ${hours.close}`
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">${item.price} each</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="font-bold text-lg">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Complete Your Order</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Table Number *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-bold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm mb-3">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary-600">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 text-center" style={{ backgroundColor: theme.primaryColor || '#0ea5e9' }}>
        <div className="container mx-auto text-white">
          <p>&copy; {new Date().getFullYear()} {basicInfo.businessName || basicInfo.name}. All rights reserved.</p>
          <p className="text-sm mt-2 opacity-75">Powered by Digital Visiting Cards</p>
        </div>
      </footer>
    </div>
  );
};

export default ViewCard;
