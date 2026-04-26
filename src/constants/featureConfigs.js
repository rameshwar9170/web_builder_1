// Feature configurations with dynamic form fields
export const FEATURE_CONFIGS = {
  'Online Booking': {
    title: 'Online Booking',
    description: 'Manage customer bookings with full booking system',
    dataKey: 'onlineBooking',
    useCustomEditor: 'OnlineBookingEditor',
    defaultData: {
      settings: {
        enabled: true,
        allowBooking: true,
        maxBookingsPerDay: 10,
        bookingDuration: 60,
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        advanceBookingDays: 30,
        requireApproval: false
      },
      bookings: [],
      statistics: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        thisMonth: 0
      }
    }
  },
  
  'Service Menu': {
    title: 'Service Menu',
    description: 'Display your services with prices and descriptions',
    dataKey: 'services',
    useExistingEditor: true // Use ServicesEditor component
  },
  
  'Before/After Gallery': {
    title: 'Before/After Gallery',
    description: 'Showcase transformation results with before/after comparisons',
    dataKey: 'beforeAfter',
    useCustomEditor: 'BeforeAfterGalleryEditor',
    defaultData: {
      enabled: true,
      title: 'Our Results',
      description: 'See the amazing transformations',
      items: []
    }
  },
  
  'Team Profiles': {
    title: 'Team Profiles',
    description: 'Showcase your team members',
    dataKey: 'team',
    useExistingEditor: true // Use TeamEditor component
  },
  
  'Digital Menu': {
    title: 'Digital Menu',
    description: 'Display your food menu with prices',
    dataKey: 'products',
    useExistingEditor: true // Use ProductsEditor component
  },
  
  'Food Gallery': {
    title: 'Food Gallery',
    description: 'Showcase your delicious dishes',
    dataKey: 'gallery',
    useExistingEditor: true // Use GalleryEditor component
  },
  
  'Online Orders': {
    title: 'Online Orders',
    description: 'Accept online food orders with full order management',
    dataKey: 'onlineOrders',
    useCustomEditor: 'OnlineOrdersEditor',
    defaultData: {
      enabled: true,
      settings: {
        allowOrders: true,
        minOrderAmount: 10,
        deliveryFee: 5,
        estimatedDeliveryTime: '30-45 minutes',
        acceptingOrders: true,
        paymentMethods: ['Cash on Delivery', 'Card', 'Online Payment'],
        enableTableSelection: true,
        enableDelivery: true,
        enablePickup: true
      },
      orders: [],
      statistics: {
        total: 0,
        pending: 0,
        preparing: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0,
        todayOrders: 0,
        todayRevenue: 0
      }
    }
  },
  
  'Table Booking': {
    title: 'Table Booking',
    description: 'Restaurant table reservation system',
    dataKey: 'tableBooking',
    useCustomEditor: 'TableBookingEditor',
    defaultData: {
      settings: {
        enabled: true,
        maxTables: 20,
        maxGuestsPerTable: 8,
        bookingDuration: 120,
        workingHours: { start: '11:00', end: '23:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        advanceBookingDays: 30,
        requireDeposit: false,
        depositAmount: 0
      },
      bookings: [],
      statistics: {
        total: 0,
        today: 0,
        thisWeek: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        totalGuests: 0
      }
    }
  },
  
  'Appointment Booking': {
    title: 'Appointment Booking',
    description: 'Schedule appointments with patients - full booking management system',
    dataKey: 'onlineBooking',
    useCustomEditor: 'OnlineBookingEditor',
    defaultData: {
      settings: {
        enabled: true,
        allowBooking: true,
        maxBookingsPerDay: 10,
        bookingDuration: 60,
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        advanceBookingDays: 30,
        requireApproval: false
      },
      bookings: [],
      statistics: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        thisMonth: 0
      }
    }
  },
  
  'Doctor Profiles': {
    title: 'Doctor Profiles',
    description: 'Showcase medical professionals',
    dataKey: 'team',
    useExistingEditor: true
  },
  
  'Services List': {
    title: 'Services List',
    description: 'List all your services',
    dataKey: 'services',
    useExistingEditor: true
  },
  
  'Clinic Hours': {
    title: 'Clinic Hours',
    description: 'Display operating hours (uses business hours from Contact tab)',
    dataKey: 'clinicHours',
    useReadOnly: true, // This is a read-only display feature
    defaultData: { enabled: true },
    fields: []
  },
  
  'Product Catalog': {
    title: 'Product Catalog',
    description: 'Display your products',
    dataKey: 'products',
    useExistingEditor: true
  },
  
  'Categories': {
    title: 'Product Categories',
    description: 'Organize products by category with images',
    dataKey: 'categories',
    useCustomEditor: 'CategoriesEditor',
    defaultData: {
      enabled: true,
      items: []
    }
  },
  
  'Special Offers': {
    title: 'Special Offers',
    description: 'Promote special deals and discounts with images',
    dataKey: 'offers',
    useCustomEditor: 'SpecialOffersEditor',
    defaultData: {
      enabled: true,
      items: []
    }
  },
  
  'Store Location': {
    title: 'Store Location',
    description: 'Show your store address and map (uses address from Contact tab)',
    dataKey: 'location',
    useReadOnly: true,
    defaultData: { mapUrl: '' },
    fields: [
      {
        name: 'mapUrl',
        label: 'Google Maps URL',
        type: 'url',
        placeholder: 'https://maps.google.com/...'
      }
    ]
  },
  
  'Room Showcase': {
    title: 'Room Showcase',
    description: 'Display hotel rooms with details and facilities',
    dataKey: 'rooms',
    useCustomEditor: 'RoomsEditor',
    defaultData: {
      enabled: true,
      items: []
    }
  },
  
  'Amenities': {
    title: 'Amenities',
    description: 'List available facilities',
    dataKey: 'amenities',
    defaultData: { items: [] },
    fields: [
      {
        name: 'amenitiesList',
        label: 'Amenities (comma-separated)',
        type: 'textarea',
        placeholder: 'WiFi, Pool, Gym, Spa, Restaurant...',
        rows: 3
      }
    ]
  },
  
  'Photo Gallery': {
    title: 'Photo Gallery',
    description: 'Showcase photos',
    dataKey: 'gallery',
    useExistingEditor: true
  },
  
  'Booking System': {
    title: 'Booking System',
    description: 'Room booking system for hotels',
    dataKey: 'roomBooking',
    useCustomEditor: 'RoomBookingEditor',
    defaultData: {
      enabled: true,
      bookings: [],
      statistics: {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      }
    }
  },
  
  'Training Programs': {
    title: 'Training Programs',
    description: 'List fitness programs',
    dataKey: 'services',
    useExistingEditor: true,
    customLabels: {
      singular: 'Training Program',
      plural: 'Training Programs',
      addButton: 'Add Training Program'
    }
  },
  
  'Trainer Profiles': {
    title: 'Trainer Profiles',
    description: 'Showcase fitness trainers',
    dataKey: 'team',
    useExistingEditor: true,
    customLabels: {
      singular: 'Trainer',
      plural: 'Trainers',
      addButton: 'Add Trainer'
    }
  },
  
  'Membership Plans': {
    title: 'Membership Plans',
    description: 'Display membership options with pricing and features',
    dataKey: 'products',
    useExistingEditor: true,
    customLabels: {
      singular: 'Membership Plan',
      plural: 'Membership Plans',
      addButton: 'Add Membership Plan'
    }
  },
  
  'Course Catalog': {
    title: 'Course Catalog',
    description: 'List educational courses',
    dataKey: 'services',
    useExistingEditor: true,
    customLabels: {
      singular: 'Course',
      plural: 'Courses',
      addButton: 'Add Course'
    }
  },
  
  'Faculty Profiles': {
    title: 'Faculty Profiles',
    description: 'Showcase teachers and faculty',
    dataKey: 'team',
    useExistingEditor: true,
    customLabels: {
      singular: 'Faculty Member',
      plural: 'Faculty Members',
      addButton: 'Add Faculty Member'
    }
  },
  
  'Achievements': {
    title: 'Achievements',
    description: 'Display awards and accomplishments with images',
    dataKey: 'achievements',
    useExistingEditor: true,
    customLabels: {
      singular: 'Achievement',
      plural: 'Achievements',
      addButton: 'Add Achievement'
    }
  },
  
  'Admission Info': {
    title: 'Admission Form',
    description: 'Manage admission applications',
    dataKey: 'admissionForm',
    useCustomEditor: 'AdmissionFormEditor',
    defaultData: {
      enabled: true,
      settings: {
        allowApplications: true,
        requireApproval: true
      },
      applications: [],
      statistics: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      }
    }
  },
  
  'Property Listings': {
    title: 'Property Listings',
    description: 'Showcase properties',
    dataKey: 'products',
    useExistingEditor: true
  },
  
  'Agent Profile': {
    title: 'Agent Profile',
    description: 'Real estate agent information with AI generation',
    dataKey: 'team',
    useExistingEditor: true // Use TeamEditor component with AI
  },
  
  'Virtual Tours': {
    title: 'Virtual Tours',
    description: 'Property video tours and walkthroughs',
    dataKey: 'virtualTours',
    useCustomEditor: 'VirtualToursEditor',
    defaultData: {
      enabled: true,
      items: []
    }
  },
  
  'Contact Form': {
    title: 'Contact Form',
    description: 'Contact information',
    dataKey: 'contact',
    defaultData: { email: '', phone: '' },
    fields: [
      {
        name: 'email',
        label: 'Contact Email',
        type: 'email',
        placeholder: 'contact@example.com',
        required: true
      },
      {
        name: 'phone',
        label: 'Contact Phone',
        type: 'tel',
        placeholder: '+1 234 567 8900',
        required: true
      }
    ]
  },
  
  'Portfolio Gallery': {
    title: 'Portfolio Gallery',
    description: 'Showcase your work',
    dataKey: 'gallery',
    useExistingEditor: true
  },
  
  'Service Packages': {
    title: 'Service Packages',
    description: 'Photography packages',
    dataKey: 'services',
    useExistingEditor: true
  },
  
  'Client Reviews': {
    title: 'Client Reviews',
    description: 'Customer testimonials',
    dataKey: 'reviews',
    defaultData: { items: [] },
    fields: [
      {
        name: 'reviewsInfo',
        label: 'Client Reviews',
        type: 'textarea',
        placeholder: 'Add client testimonials...',
        rows: 5
      }
    ]
  },
  
  'Service Details': {
    title: 'Service Details',
    description: 'Detailed service information',
    dataKey: 'services',
    useExistingEditor: true
  },
  
  'Experience Timeline': {
    title: 'Experience Timeline',
    description: 'Professional experience history',
    dataKey: 'experience',
    defaultData: { timeline: '' },
    fields: [
      {
        name: 'timeline',
        label: 'Experience Timeline',
        type: 'textarea',
        placeholder: '2020-Present: Senior Consultant\n2015-2020: Associate...',
        rows: 6
      }
    ]
  },
  
  'Certifications': {
    title: 'Certifications',
    description: 'Professional certifications',
    dataKey: 'certifications',
    defaultData: { items: [] },
    fields: [
      {
        name: 'certificationsList',
        label: 'Certifications',
        type: 'textarea',
        placeholder: 'List your certifications...',
        rows: 5
      }
    ]
  },
  
  'Consultation Booking': {
    title: 'Consultation Booking',
    description: 'Book consultation appointments',
    dataKey: 'consultation',
    defaultData: { bookingUrl: '', consultationFee: '' },
    fields: [
      {
        name: 'bookingUrl',
        label: 'Booking URL',
        type: 'url',
        placeholder: 'https://your-consultation-booking.com'
      },
      {
        name: 'consultationFee',
        label: 'Consultation Fee',
        type: 'text',
        placeholder: 'e.g., $100 per hour'
      }
    ]
  }
};

// Get feature config by name
export const getFeatureConfig = (featureName) => {
  return FEATURE_CONFIGS[featureName] || null;
};

// Check if feature uses existing editor
export const usesExistingEditor = (featureName) => {
  const config = FEATURE_CONFIGS[featureName];
  return config?.useExistingEditor === true;
};
