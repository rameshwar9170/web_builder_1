// AI Content Generation Service
// This service generates professional content based on business type and template

export const aiService = {
  // Generate content for different sections
  async generateContent(businessType, section, businessInfo = {}) {
    // Simulate AI generation with professional templates
    // In production, this would call an AI API like OpenAI
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    // Map template IDs to business types
    const templateMapping = {
      'salon-spa': 'Salon & Spa',
      'restaurant-cafe': 'Restaurant & Cafe',
      'medical-clinic': 'Medical & Clinic',
      'retail-store': 'Retail Store',
      'hotel-resort': 'Hotel & Resort',
      'gym-fitness': 'Gym & Fitness',
      'education-coaching': 'Education & Coaching',
      'real-estate': 'Real Estate',
      'photography': 'Photography Studio',
      'professional-services': 'Professional Services'
    };
    
    // Convert template ID to business type name
    const mappedBusinessType = templateMapping[businessType] || businessType;
    
    const templates = {
      'Salon & Spa': {
        description: `Welcome to ${businessInfo.name || 'our salon'}, where beauty meets relaxation. We are a premier ${businessType.toLowerCase()} dedicated to providing exceptional services in a luxurious and comfortable environment. Our team of experienced professionals is committed to helping you look and feel your best. With years of expertise and a passion for beauty, we offer personalized treatments tailored to your unique needs.`,
        
        mission: `Our mission is to provide world-class beauty and wellness services that enhance your natural beauty and boost your confidence. We strive to create a welcoming atmosphere where every client feels valued and pampered.`,
        
        vision: `To be the leading ${businessType.toLowerCase()} in the region, known for exceptional service, innovative treatments, and a commitment to client satisfaction. We envision a space where beauty, wellness, and relaxation come together seamlessly.`,
        
        services: [
          {
            name: 'Hair Styling & Cut',
            description: 'Professional haircuts and styling for all hair types. Our expert stylists will create the perfect look for you.',
            price: '$45 - $85',
            duration: '60 minutes'
          },
          {
            name: 'Hair Coloring',
            description: 'Full color, highlights, balayage, and color correction services using premium products.',
            price: '$80 - $200',
            duration: '120 minutes'
          },
          {
            name: 'Facial Treatment',
            description: 'Rejuvenating facial treatments customized to your skin type for a radiant glow.',
            price: '$65 - $120',
            duration: '60 minutes'
          },
          {
            name: 'Manicure & Pedicure',
            description: 'Complete nail care services including classic, gel, and spa treatments.',
            price: '$35 - $75',
            duration: '45 minutes'
          },
          {
            name: 'Massage Therapy',
            description: 'Relaxing massage treatments to relieve stress and tension.',
            price: '$70 - $130',
            duration: '60-90 minutes'
          },
          {
            name: 'Bridal Package',
            description: 'Complete bridal beauty package including hair, makeup, and skincare.',
            price: '$250 - $500',
            duration: '3-4 hours'
          }
        ],
        
        team: [
          {
            name: 'Sarah Johnson',
            role: 'Master Stylist',
            bio: 'With over 15 years of experience, Sarah specializes in modern cuts and color techniques.',
            specialization: 'Hair Styling & Color'
          },
          {
            name: 'Emily Chen',
            role: 'Esthetician',
            bio: 'Licensed esthetician with expertise in skincare and facial treatments.',
            specialization: 'Skincare & Facials'
          },
          {
            name: 'Michael Rodriguez',
            role: 'Massage Therapist',
            bio: 'Certified massage therapist specializing in therapeutic and relaxation massage.',
            specialization: 'Massage Therapy'
          }
        ]
      },
      
      'Restaurant & Cafe': {
        description: `Welcome to ${businessInfo.name || 'our restaurant'}, where culinary excellence meets warm hospitality. We are passionate about serving delicious, freshly prepared meals using the finest ingredients. Our menu features a perfect blend of traditional favorites and innovative dishes, all crafted with care by our talented chefs. Whether you're joining us for a casual lunch, romantic dinner, or special celebration, we promise an unforgettable dining experience.`,
        
        mission: `To deliver exceptional dining experiences through quality food, outstanding service, and a welcoming atmosphere. We are committed to using fresh, locally-sourced ingredients and creating memorable moments for every guest.`,
        
        vision: `To become the most beloved dining destination in our community, known for culinary innovation, sustainable practices, and genuine hospitality that keeps guests coming back.`,
        
        services: [
          {
            name: 'Signature Dishes',
            description: 'Our chef\'s special creations featuring seasonal ingredients and bold flavors.',
            price: '$18 - $35'
          },
          {
            name: 'Appetizers & Starters',
            description: 'Perfect for sharing or starting your meal with delicious small plates.',
            price: '$8 - $16'
          },
          {
            name: 'Main Courses',
            description: 'Hearty entrees including steaks, seafood, pasta, and vegetarian options.',
            price: '$22 - $45'
          },
          {
            name: 'Desserts',
            description: 'Indulgent sweet treats and house-made desserts to complete your meal.',
            price: '$7 - $12'
          },
          {
            name: 'Beverages',
            description: 'Curated wine list, craft cocktails, and specialty coffee drinks.',
            price: '$5 - $15'
          },
          {
            name: 'Catering Services',
            description: 'Full-service catering for events, parties, and corporate functions.',
            price: 'Custom pricing'
          }
        ],
        
        team: [
          {
            name: 'Chef Marco Rossi',
            role: 'Executive Chef',
            bio: 'Award-winning chef with 20 years of culinary experience in fine dining.',
            specialization: 'Italian & Mediterranean Cuisine'
          },
          {
            name: 'Lisa Martinez',
            role: 'Pastry Chef',
            bio: 'Creative pastry chef known for innovative desserts and beautiful presentations.',
            specialization: 'Desserts & Baking'
          },
          {
            name: 'David Thompson',
            role: 'Restaurant Manager',
            bio: 'Experienced hospitality professional dedicated to exceptional guest service.',
            specialization: 'Operations & Service'
          }
        ]
      },
      
      'Medical & Clinic': {
        description: `Welcome to ${businessInfo.name || 'our medical clinic'}, your trusted partner in health and wellness. We provide comprehensive medical care with a focus on patient-centered treatment and preventive medicine. Our state-of-the-art facility is equipped with modern technology, and our experienced medical team is dedicated to delivering the highest quality healthcare services. We believe in treating the whole person, not just symptoms, and building lasting relationships with our patients.`,
        
        mission: `To provide accessible, high-quality healthcare services with compassion and professionalism. We are committed to improving the health and well-being of our community through excellent medical care and patient education.`,
        
        vision: `To be the leading healthcare provider in our region, recognized for clinical excellence, innovative treatments, and patient satisfaction. We strive to make quality healthcare accessible to all.`,
        
        services: [
          {
            name: 'General Consultation',
            description: 'Comprehensive medical examinations and health assessments.',
            price: '$80 - $150',
            duration: '30 minutes'
          },
          {
            name: 'Preventive Care',
            description: 'Regular check-ups, screenings, and vaccinations to maintain optimal health.',
            price: '$60 - $120',
            duration: '20 minutes'
          },
          {
            name: 'Chronic Disease Management',
            description: 'Ongoing care for diabetes, hypertension, and other chronic conditions.',
            price: '$100 - $200',
            duration: '45 minutes'
          },
          {
            name: 'Laboratory Services',
            description: 'On-site lab testing for quick and accurate diagnostic results.',
            price: '$30 - $150'
          },
          {
            name: 'Minor Procedures',
            description: 'In-office procedures including wound care, sutures, and minor surgeries.',
            price: '$150 - $500',
            duration: '30-60 minutes'
          },
          {
            name: 'Telemedicine',
            description: 'Virtual consultations for convenient access to medical care.',
            price: '$50 - $100',
            duration: '15-30 minutes'
          }
        ],
        
        team: [
          {
            name: 'Dr. James Wilson',
            role: 'Medical Director',
            bio: 'Board-certified physician with 25 years of experience in family medicine.',
            specialization: 'Family Medicine',
            experience: '25 years'
          },
          {
            name: 'Dr. Priya Patel',
            role: 'Internal Medicine Specialist',
            bio: 'Experienced internist specializing in chronic disease management.',
            specialization: 'Internal Medicine',
            experience: '15 years'
          },
          {
            name: 'Nurse Sarah Brown',
            role: 'Nurse Practitioner',
            bio: 'Certified nurse practitioner providing comprehensive primary care.',
            specialization: 'Primary Care',
            experience: '10 years'
          }
        ]
      },
      
      'Retail Store': {
        description: `Welcome to ${businessInfo.name || 'our store'}, your premier shopping destination for quality products and exceptional service. We take pride in offering a carefully curated selection of products that meet the highest standards of quality and value. Our knowledgeable staff is dedicated to helping you find exactly what you need, whether you're shopping for everyday essentials or something special. With competitive prices and a commitment to customer satisfaction, we strive to make every shopping experience memorable.`,
        
        mission: `To provide our customers with high-quality products, competitive prices, and outstanding service. We are committed to being a trusted retail partner in our community.`,
        
        vision: `To become the preferred shopping destination in our area, known for product quality, customer service, and community engagement.`,
        
        services: [
          {
            name: 'Product Selection',
            description: 'Wide range of quality products across multiple categories.',
            price: 'Competitive pricing'
          },
          {
            name: 'Personal Shopping',
            description: 'Expert assistance to help you find the perfect products.',
            price: 'Complimentary'
          },
          {
            name: 'Gift Wrapping',
            description: 'Professional gift wrapping services for special occasions.',
            price: '$5 - $15'
          },
          {
            name: 'Home Delivery',
            description: 'Convenient delivery service to your doorstep.',
            price: 'Starting at $10'
          },
          {
            name: 'Loyalty Program',
            description: 'Earn rewards and exclusive discounts on your purchases.',
            price: 'Free to join'
          }
        ],
        
        team: [
          {
            name: 'Rajesh Kumar',
            role: 'Store Manager',
            bio: 'Experienced retail professional with a passion for customer service.',
            specialization: 'Store Operations'
          },
          {
            name: 'Priya Sharma',
            role: 'Sales Associate',
            bio: 'Friendly and knowledgeable staff member ready to assist you.',
            specialization: 'Customer Service'
          },
          {
            name: 'Amit Patel',
            role: 'Product Specialist',
            bio: 'Expert in product knowledge and recommendations.',
            specialization: 'Product Consultation'
          }
        ]
      },
      
      'Hotel & Resort': {
        description: `Welcome to ${businessInfo.name || 'our hotel'}, where luxury meets comfort in an unforgettable hospitality experience. Our property offers elegantly appointed rooms, world-class amenities, and exceptional service that caters to both leisure and business travelers. Whether you're here for a relaxing getaway or an important business trip, our dedicated team ensures every moment of your stay is perfect. Experience the perfect blend of modern convenience and timeless elegance.`,
        
        mission: `To provide exceptional hospitality experiences that exceed guest expectations through outstanding service, luxurious accommodations, and attention to detail.`,
        
        vision: `To be recognized as the premier hospitality destination, known for creating memorable experiences and setting new standards in guest satisfaction.`,
        
        services: [
          {
            name: 'Luxury Accommodations',
            description: 'Elegantly furnished rooms and suites with modern amenities.',
            price: '$150 - $500 per night'
          },
          {
            name: 'Fine Dining',
            description: 'Multi-cuisine restaurant serving delicious meals throughout the day.',
            price: '$20 - $60 per person'
          },
          {
            name: 'Spa & Wellness',
            description: 'Rejuvenating spa treatments and wellness facilities.',
            price: '$50 - $200'
          },
          {
            name: 'Conference Facilities',
            description: 'State-of-the-art meeting rooms and event spaces.',
            price: 'Custom packages'
          },
          {
            name: 'Concierge Services',
            description: 'Personalized assistance for tours, bookings, and recommendations.',
            price: 'Complimentary'
          }
        ],
        
        team: [
          {
            name: 'Vikram Singh',
            role: 'General Manager',
            bio: 'Hospitality veteran with 20 years of experience in luxury hotels.',
            specialization: 'Hotel Management'
          },
          {
            name: 'Anjali Desai',
            role: 'Guest Relations Manager',
            bio: 'Dedicated to ensuring every guest has an exceptional experience.',
            specialization: 'Guest Services'
          },
          {
            name: 'Rahul Mehta',
            role: 'Executive Chef',
            bio: 'Award-winning chef creating culinary masterpieces.',
            specialization: 'Culinary Arts'
          }
        ]
      },
      
      'Gym & Fitness': {
        description: `Welcome to ${businessInfo.name || 'our fitness center'}, where your fitness journey begins. We are a state-of-the-art fitness facility dedicated to helping you achieve your health and wellness goals. With cutting-edge equipment, expert trainers, and a motivating environment, we provide everything you need to transform your body and mind. Whether you're a beginner or an experienced athlete, our personalized approach ensures you get the results you deserve.`,
        
        mission: `To empower individuals to achieve their fitness goals through expert guidance, quality equipment, and a supportive community atmosphere.`,
        
        vision: `To be the leading fitness center in our region, known for transforming lives through health, fitness, and wellness programs.`,
        
        services: [
          {
            name: 'Personal Training',
            description: 'One-on-one training sessions customized to your fitness goals.',
            price: '$50 - $100 per session',
            duration: '60 minutes'
          },
          {
            name: 'Group Classes',
            description: 'Energizing group fitness classes including yoga, Zumba, and HIIT.',
            price: '$15 - $25 per class',
            duration: '45-60 minutes'
          },
          {
            name: 'Strength Training',
            description: 'Access to premium strength training equipment and free weights.',
            price: 'Included in membership'
          },
          {
            name: 'Cardio Zone',
            description: 'Modern cardio equipment with entertainment systems.',
            price: 'Included in membership'
          },
          {
            name: 'Nutrition Counseling',
            description: 'Expert nutrition guidance to complement your fitness routine.',
            price: '$40 - $80 per session',
            duration: '45 minutes'
          }
        ],
        
        team: [
          {
            name: 'Arjun Kapoor',
            role: 'Head Trainer',
            bio: 'Certified fitness expert with 15 years of experience in strength and conditioning.',
            specialization: 'Strength Training'
          },
          {
            name: 'Neha Reddy',
            role: 'Yoga Instructor',
            bio: 'Experienced yoga teacher specializing in Hatha and Vinyasa yoga.',
            specialization: 'Yoga & Flexibility'
          },
          {
            name: 'Karan Malhotra',
            role: 'Nutritionist',
            bio: 'Certified nutritionist helping clients achieve optimal health through diet.',
            specialization: 'Sports Nutrition'
          }
        ]
      },
      
      'Education & Coaching': {
        description: `Welcome to ${businessInfo.name || 'our coaching center'}, where education meets excellence. We are committed to providing high-quality education and personalized coaching that helps students achieve their academic goals. Our experienced faculty, proven teaching methodologies, and student-centric approach have helped thousands of students succeed. Whether you're preparing for competitive exams or seeking to improve your skills, we provide the guidance and support you need.`,
        
        mission: `To provide quality education and personalized coaching that empowers students to achieve academic excellence and reach their full potential.`,
        
        vision: `To be the most trusted educational institution in our region, known for outstanding results, innovative teaching methods, and student success.`,
        
        services: [
          {
            name: 'Competitive Exam Coaching',
            description: 'Comprehensive preparation for JEE, NEET, UPSC, and other competitive exams.',
            price: '$200 - $500 per month'
          },
          {
            name: 'School Tuition',
            description: 'Subject-wise coaching for students from Class 6 to 12.',
            price: '$100 - $300 per month'
          },
          {
            name: 'Test Series',
            description: 'Regular mock tests and assessments to track progress.',
            price: '$50 - $150'
          },
          {
            name: 'Doubt Clearing Sessions',
            description: 'Dedicated sessions to resolve student queries and doubts.',
            price: 'Included in course'
          },
          {
            name: 'Study Material',
            description: 'Comprehensive study materials and practice questions.',
            price: 'Included in course'
          }
        ],
        
        team: [
          {
            name: 'Dr. Suresh Iyer',
            role: 'Director & Physics Faculty',
            bio: 'PhD in Physics with 25 years of teaching experience.',
            specialization: 'Physics',
            experience: '25 years'
          },
          {
            name: 'Prof. Meera Joshi',
            role: 'Mathematics Faculty',
            bio: 'Expert mathematics teacher with proven track record of student success.',
            specialization: 'Mathematics',
            experience: '18 years'
          },
          {
            name: 'Dr. Anil Verma',
            role: 'Chemistry Faculty',
            bio: 'Experienced chemistry educator passionate about making concepts clear.',
            specialization: 'Chemistry',
            experience: '20 years'
          }
        ]
      },
      
      'Real Estate': {
        description: `Welcome to ${businessInfo.name || 'our real estate services'}, your trusted partner in property solutions. With years of experience in the real estate market, we specialize in helping clients buy, sell, and invest in properties. Our deep market knowledge, extensive network, and commitment to client satisfaction set us apart. Whether you're looking for your dream home, a commercial property, or an investment opportunity, we provide expert guidance every step of the way.`,
        
        mission: `To provide exceptional real estate services that help clients make informed property decisions and achieve their real estate goals with confidence.`,
        
        vision: `To be the most trusted real estate consultancy in our region, known for integrity, market expertise, and client-focused service.`,
        
        services: [
          {
            name: 'Property Buying',
            description: 'Expert assistance in finding and purchasing your ideal property.',
            price: 'Commission-based'
          },
          {
            name: 'Property Selling',
            description: 'Professional marketing and sales services for your property.',
            price: '1-2% commission'
          },
          {
            name: 'Property Rental',
            description: 'Rental property management and tenant placement services.',
            price: 'One month rent'
          },
          {
            name: 'Investment Consulting',
            description: 'Strategic advice on real estate investment opportunities.',
            price: '$100 - $500'
          },
          {
            name: 'Property Valuation',
            description: 'Accurate property valuation and market analysis.',
            price: '$50 - $200'
          }
        ],
        
        team: [
          {
            name: 'Sanjay Gupta',
            role: 'Senior Property Consultant',
            bio: 'Real estate expert with 15 years of experience in residential and commercial properties.',
            specialization: 'Property Sales',
            experience: '15 years'
          },
          {
            name: 'Kavita Nair',
            role: 'Investment Advisor',
            bio: 'Specialist in real estate investment and portfolio management.',
            specialization: 'Investment Consulting',
            experience: '12 years'
          },
          {
            name: 'Rohit Sharma',
            role: 'Property Manager',
            bio: 'Experienced in rental property management and tenant relations.',
            specialization: 'Property Management',
            experience: '10 years'
          }
        ]
      },
      
      'Photography Studio': {
        description: `Welcome to ${businessInfo.name || 'our photography studio'}, where moments become timeless memories. We are passionate photographers dedicated to capturing the beauty, emotion, and essence of every moment. With a keen eye for detail, creative vision, and state-of-the-art equipment, we deliver stunning photographs that tell your unique story. Whether it's a wedding, portrait, or commercial shoot, we bring artistry and professionalism to every project.`,
        
        mission: `To create beautiful, authentic photographs that capture genuine emotions and preserve precious memories for generations to come.`,
        
        vision: `To be recognized as the premier photography studio in our region, known for artistic excellence, creative innovation, and exceptional client experiences.`,
        
        services: [
          {
            name: 'Wedding Photography',
            description: 'Comprehensive wedding coverage capturing every precious moment.',
            price: '$1,000 - $3,000',
            duration: 'Full day'
          },
          {
            name: 'Portrait Photography',
            description: 'Professional portraits for individuals, families, and professionals.',
            price: '$150 - $500',
            duration: '1-2 hours'
          },
          {
            name: 'Event Photography',
            description: 'Coverage for corporate events, parties, and special occasions.',
            price: '$300 - $1,000',
            duration: '3-8 hours'
          },
          {
            name: 'Product Photography',
            description: 'High-quality product images for e-commerce and marketing.',
            price: '$50 - $200 per product'
          },
          {
            name: 'Photo Editing',
            description: 'Professional retouching and enhancement services.',
            price: '$20 - $100 per image'
          }
        ],
        
        team: [
          {
            name: 'Aditya Khanna',
            role: 'Lead Photographer',
            bio: 'Award-winning photographer with 12 years of experience in wedding and portrait photography.',
            specialization: 'Wedding Photography'
          },
          {
            name: 'Riya Sen',
            role: 'Portrait Specialist',
            bio: 'Creative photographer specializing in capturing authentic emotions and personalities.',
            specialization: 'Portrait Photography'
          },
          {
            name: 'Manish Tiwari',
            role: 'Commercial Photographer',
            bio: 'Expert in product and commercial photography for brands and businesses.',
            specialization: 'Commercial Photography'
          }
        ]
      },
      
      'Professional Services': {
        description: `Welcome to ${businessInfo.name || 'our professional services'}, where expertise meets excellence. We are seasoned professionals committed to providing high-quality consulting and advisory services. With deep industry knowledge, proven methodologies, and a client-first approach, we help individuals and businesses navigate complex challenges and achieve their objectives. Our personalized service and attention to detail ensure that every client receives the expert guidance they deserve.`,
        
        mission: `To deliver exceptional professional services that add value to our clients through expert advice, strategic thinking, and unwavering commitment to their success.`,
        
        vision: `To be the most trusted professional services firm in our domain, recognized for expertise, integrity, and outstanding client outcomes.`,
        
        services: [
          {
            name: 'Business Consulting',
            description: 'Strategic advice and solutions for business growth and optimization.',
            price: '$150 - $500 per hour'
          },
          {
            name: 'Legal Advisory',
            description: 'Expert legal counsel and representation for various matters.',
            price: '$200 - $600 per hour'
          },
          {
            name: 'Financial Planning',
            description: 'Comprehensive financial planning and wealth management services.',
            price: '$100 - $400 per hour'
          },
          {
            name: 'Tax Consultation',
            description: 'Tax planning, compliance, and advisory services.',
            price: '$150 - $400 per hour'
          },
          {
            name: 'Audit Services',
            description: 'Professional audit and assurance services.',
            price: 'Project-based pricing'
          }
        ],
        
        team: [
          {
            name: 'Adv. Ramesh Kumar',
            role: 'Senior Partner',
            bio: 'Experienced legal professional with 20 years of practice in corporate and civil law.',
            specialization: 'Legal Services',
            experience: '20 years'
          },
          {
            name: 'CA Pooja Agarwal',
            role: 'Chartered Accountant',
            bio: 'Expert in taxation, audit, and financial advisory services.',
            specialization: 'Finance & Taxation',
            experience: '15 years'
          },
          {
            name: 'Deepak Malhotra',
            role: 'Business Consultant',
            bio: 'Strategic consultant helping businesses achieve growth and efficiency.',
            specialization: 'Business Strategy',
            experience: '18 years'
          }
        ]
      }
    };
    
    const template = templates[mappedBusinessType] || templates['Salon & Spa'];
    
    if (section === 'all') {
      return template;
    }
    
    return template[section] || '';
  },
  
  // Generate business name suggestions
  async generateBusinessNames(businessType, keywords = []) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const prefixes = ['Elite', 'Premium', 'Royal', 'Golden', 'Modern', 'Classic', 'Urban', 'Luxury'];
    const suffixes = ['Studio', 'Lounge', 'Haven', 'Spa', 'Clinic', 'Center', 'House', 'Place'];
    
    const suggestions = [];
    for (let i = 0; i < 5; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      suggestions.push(`${prefix} ${businessType.split('&')[0].trim()} ${suffix}`);
    }
    
    return suggestions;
  },
  
  // Generate SEO content
  async generateSEO(businessInfo) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      title: `${businessInfo.name} - ${businessInfo.title || 'Professional Services'}`,
      description: `Visit ${businessInfo.name} for exceptional ${businessInfo.category || 'services'}. Book your appointment today and experience the difference.`,
      keywords: [
        businessInfo.name,
        businessInfo.category,
        businessInfo.city || 'local',
        'professional services',
        'book appointment',
        'best rated'
      ]
    };
  },

  // Helper method to generate About section content
  async generateAboutContent(businessType, businessName) {
    const content = await this.generateContent(businessType, 'all', { name: businessName });
    return {
      description: content.description,
      mission: content.mission,
      vision: content.vision,
      services: content.services || [],
      team: content.team || []
    };
  }
};
