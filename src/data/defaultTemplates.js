// Default templates for Indian businesses
export const DEFAULT_TEMPLATES = [
  {
    id: 'salon-spa',
    name: 'Salon & Spa',
    category: 'Beauty & Wellness',
    description: 'Perfect for beauty salons, spas, and wellness centers',
    icon: '💇',
    order: 1,
    isActive: true,
    preview: '/templates/salon-preview.jpg',
    theme: {
      primaryColor: '#E91E63',
      secondaryColor: '#F06292',
      accentColor: '#C2185B',
      fontFamily: 'Playfair Display',
      layout: 'elegant',
      headerStyle: 'centered',
      cardStyle: 'rounded',
      buttonStyle: 'rounded-full'
    },
    sections: {
      hero: { enabled: true, style: 'image-overlay' },
      about: { enabled: true, style: 'two-column' },
      services: { enabled: true, style: 'grid-cards', columns: 3 },
      gallery: { enabled: true, style: 'masonry' },
      team: { enabled: true, style: 'circular-photos' },
      testimonials: { enabled: true, style: 'carousel' },
      contact: { enabled: true, style: 'map-sidebar' }
    },
    features: ['Online Booking', 'Service Menu', 'Before/After Gallery', 'Team Profiles']
  },
  {
    id: 'restaurant-cafe',
    name: 'Restaurant & Cafe',
    category: 'Food & Beverage',
    description: 'Ideal for restaurants, cafes, and food businesses',
    icon: '🍽️',
    order: 2,
    isActive: true,
    preview: '/templates/restaurant-preview.jpg',
    theme: {
      primaryColor: '#FF6B35',
      secondaryColor: '#F7931E',
      accentColor: '#C1502E',
      fontFamily: 'Poppins',
      layout: 'modern',
      headerStyle: 'sticky',
      cardStyle: 'shadow',
      buttonStyle: 'rounded'
    },
    sections: {
      hero: { enabled: true, style: 'full-screen' },
      about: { enabled: true, style: 'centered' },
      menu: { enabled: true, style: 'categorized' },
      gallery: { enabled: true, style: 'grid' },
      specialties: { enabled: true, style: 'featured' },
      contact: { enabled: true, style: 'inline' }
    },
    features: ['Digital Menu', 'Food Gallery', 'Online Orders', 'Table Booking']
  },
  {
    id: 'medical-clinic',
    name: 'Medical & Clinic',
    category: 'Healthcare',
    description: 'For doctors, clinics, and healthcare professionals',
    icon: '🏥',
    order: 3,
    isActive: true,
    preview: '/templates/medical-preview.jpg',
    theme: {
      primaryColor: '#2196F3',
      secondaryColor: '#64B5F6',
      accentColor: '#1976D2',
      fontFamily: 'Roboto',
      layout: 'professional',
      headerStyle: 'clean',
      cardStyle: 'minimal',
      buttonStyle: 'square'
    },
    sections: {
      hero: { enabled: true, style: 'professional' },
      about: { enabled: true, style: 'credentials' },
      services: { enabled: true, style: 'list-detailed' },
      team: { enabled: true, style: 'professional-cards' },
      timings: { enabled: true, style: 'schedule' },
      contact: { enabled: true, style: 'appointment' }
    },
    features: ['Appointment Booking', 'Doctor Profiles', 'Services List', 'Clinic Hours']
  },
  {
    id: 'retail-store',
    name: 'Retail Store',
    category: 'Retail',
    description: 'Perfect for general stores, boutiques, and retail shops',
    icon: '🛍️',
    order: 4,
    isActive: true,
    preview: '/templates/retail-preview.jpg',
    theme: {
      primaryColor: '#9C27B0',
      secondaryColor: '#BA68C8',
      accentColor: '#7B1FA2',
      fontFamily: 'Montserrat',
      layout: 'modern',
      headerStyle: 'bold',
      cardStyle: 'elevated',
      buttonStyle: 'rounded'
    },
    sections: {
      hero: { enabled: true, style: 'banner' },
      about: { enabled: true, style: 'story' },
      products: { enabled: true, style: 'grid-shop' },
      categories: { enabled: true, style: 'tiles' },
      offers: { enabled: true, style: 'banner' },
      contact: { enabled: true, style: 'store-locator' }
    },
    features: ['Product Catalog', 'Categories', 'Special Offers', 'Store Location']
  },
  {
    id: 'hotel-resort',
    name: 'Hotel & Resort',
    category: 'Hospitality',
    description: 'For hotels, resorts, and accommodation services',
    icon: '🏨',
    order: 5,
    isActive: true,
    preview: '/templates/hotel-preview.jpg',
    theme: {
      primaryColor: '#00796B',
      secondaryColor: '#4DB6AC',
      accentColor: '#00695C',
      fontFamily: 'Lora',
      layout: 'luxury',
      headerStyle: 'transparent',
      cardStyle: 'elegant',
      buttonStyle: 'outlined'
    },
    sections: {
      hero: { enabled: true, style: 'video-background' },
      about: { enabled: true, style: 'luxury' },
      rooms: { enabled: true, style: 'showcase' },
      amenities: { enabled: true, style: 'icons-grid' },
      gallery: { enabled: true, style: 'lightbox' },
      contact: { enabled: true, style: 'booking' }
    },
    features: ['Room Showcase', 'Amenities', 'Photo Gallery', 'Booking System']
  },
  {
    id: 'gym-fitness',
    name: 'Gym & Fitness',
    category: 'Fitness',
    description: 'For gyms, fitness centers, and personal trainers',
    icon: '💪',
    order: 6,
    isActive: true,
    preview: '/templates/gym-preview.jpg',
    theme: {
      primaryColor: '#FF5722',
      secondaryColor: '#FF8A65',
      accentColor: '#E64A19',
      fontFamily: 'Oswald',
      layout: 'energetic',
      headerStyle: 'bold',
      cardStyle: 'angular',
      buttonStyle: 'sharp'
    },
    sections: {
      hero: { enabled: true, style: 'motivational' },
      about: { enabled: true, style: 'mission' },
      programs: { enabled: true, style: 'cards' },
      trainers: { enabled: true, style: 'profiles' },
      pricing: { enabled: true, style: 'plans' },
      contact: { enabled: true, style: 'membership' }
    },
    features: ['Training Programs', 'Trainer Profiles', 'Membership Plans', 'Online Booking']
  },
  {
    id: 'education-coaching',
    name: 'Education & Coaching',
    category: 'Education',
    description: 'For coaching centers, tutors, and educational institutes',
    icon: '📚',
    order: 7,
    isActive: true,
    preview: '/templates/education-preview.jpg',
    theme: {
      primaryColor: '#3F51B5',
      secondaryColor: '#7986CB',
      accentColor: '#303F9F',
      fontFamily: 'Open Sans',
      layout: 'academic',
      headerStyle: 'professional',
      cardStyle: 'clean',
      buttonStyle: 'rounded'
    },
    sections: {
      hero: { enabled: true, style: 'educational' },
      about: { enabled: true, style: 'institution' },
      courses: { enabled: true, style: 'detailed-list' },
      faculty: { enabled: true, style: 'academic' },
      achievements: { enabled: true, style: 'stats' },
      contact: { enabled: true, style: 'admission' }
    },
    features: ['Course Catalog', 'Faculty Profiles', 'Achievements', 'Admission Info']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    category: 'Property',
    description: 'For real estate agents and property consultants',
    icon: '🏠',
    order: 8,
    isActive: true,
    preview: '/templates/realestate-preview.jpg',
    theme: {
      primaryColor: '#607D8B',
      secondaryColor: '#90A4AE',
      accentColor: '#455A64',
      fontFamily: 'Raleway',
      layout: 'professional',
      headerStyle: 'modern',
      cardStyle: 'property',
      buttonStyle: 'rounded'
    },
    sections: {
      hero: { enabled: true, style: 'search' },
      about: { enabled: true, style: 'agent-profile' },
      properties: { enabled: true, style: 'listings' },
      services: { enabled: true, style: 'icons' },
      testimonials: { enabled: true, style: 'reviews' },
      contact: { enabled: true, style: 'inquiry' }
    },
    features: ['Property Listings', 'Agent Profile', 'Virtual Tours', 'Contact Form']
  },
  {
    id: 'photography',
    name: 'Photography Studio',
    category: 'Creative',
    description: 'For photographers and creative professionals',
    icon: '📸',
    order: 9,
    isActive: true,
    preview: '/templates/photography-preview.jpg',
    theme: {
      primaryColor: '#212121',
      secondaryColor: '#424242',
      accentColor: '#FFC107',
      fontFamily: 'Playfair Display',
      layout: 'portfolio',
      headerStyle: 'minimal',
      cardStyle: 'borderless',
      buttonStyle: 'minimal'
    },
    sections: {
      hero: { enabled: true, style: 'fullscreen-slider' },
      about: { enabled: true, style: 'creative' },
      portfolio: { enabled: true, style: 'masonry-full' },
      services: { enabled: true, style: 'packages' },
      testimonials: { enabled: true, style: 'minimal' },
      contact: { enabled: true, style: 'booking' }
    },
    features: ['Portfolio Gallery', 'Service Packages', 'Booking System', 'Client Reviews']
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    category: 'Business',
    description: 'For consultants, lawyers, CAs, and professionals',
    icon: '💼',
    order: 10,
    isActive: true,
    preview: '/templates/professional-preview.jpg',
    theme: {
      primaryColor: '#1A237E',
      secondaryColor: '#3949AB',
      accentColor: '#0D47A1',
      fontFamily: 'Merriweather',
      layout: 'corporate',
      headerStyle: 'executive',
      cardStyle: 'formal',
      buttonStyle: 'professional'
    },
    sections: {
      hero: { enabled: true, style: 'corporate' },
      about: { enabled: true, style: 'expertise' },
      services: { enabled: true, style: 'professional-list' },
      experience: { enabled: true, style: 'timeline' },
      certifications: { enabled: true, style: 'badges' },
      contact: { enabled: true, style: 'consultation' }
    },
    features: ['Service Details', 'Experience Timeline', 'Certifications', 'Consultation Booking']
  }
];
