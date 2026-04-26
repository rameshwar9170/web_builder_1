import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { COLLECTIONS, CARD_STATUS } from '../firebase/collections';
import { v4 as uuidv4 } from 'uuid';

export const cardService = {
  // Check if slug is available
  async isSlugAvailable(slug, excludeCardId = null) {
    const q = query(
      collection(db, COLLECTIONS.CARDS),
      where('slug', '==', slug)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return true;
    }
    
    // If excludeCardId is provided, check if the found card is the same one
    if (excludeCardId) {
      return snapshot.docs.every(doc => doc.id === excludeCardId);
    }
    
    return false;
  },

  // Generate unique slug
  async generateUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;
    
    while (!(await this.isSlugAvailable(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  },

  // Create new card
  async createCard(adminId, cardData) {
    const cardId = uuidv4();
    const cardRef = doc(db, COLLECTIONS.CARDS, cardId);
    
    const card = {
      id: cardId,
      adminId,
      slug: cardData.slug || cardId,
      status: CARD_STATUS.DRAFT,
      templateId: cardData.templateId || 'default',
      templateFeatures: cardData.templateFeatures || [], // All available features from template
      enabledFeatures: cardData.enabledFeatures || [], // Currently enabled features
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Basic Info
      basicInfo: {
        name: cardData.name || '',
        title: cardData.title || '',
        company: cardData.company || '',
        email: cardData.email || '',
        phone: cardData.phone || '',
        website: cardData.website || '',
        logo: cardData.logo || '',
        profileImage: cardData.profileImage || '',
        coverImage: cardData.coverImage || ''
      },
      
      // About Section
      about: {
        description: '',
        mission: '',
        vision: '',
        enabled: true
      },
      
      // Services Section
      services: {
        items: [],
        enabled: true
      },
      
      // Products Section
      products: {
        items: [],
        enabled: true
      },
      
      // Team Section
      team: {
        members: [],
        enabled: true
      },
      
      // Gallery Section
      gallery: {
        images: [],
        enabled: true
      },
      
      // Contact Section
      contact: {
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        socialLinks: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
          youtube: ''
        },
        enabled: true
      },
      
      // Theme & Customization
      theme: cardData.theme || {
        themeId: 'default',
        primaryColor: '#0ea5e9',
        secondaryColor: '#0369a1',
        fontFamily: 'Inter',
        layout: 'modern',
        customCSS: ''
      },
      
      // SEO
      seo: {
        title: cardData.name || '',
        description: '',
        keywords: [],
        ogImage: ''
      },
      
      // Analytics
      analytics: {
        views: 0,
        uniqueVisitors: 0,
        clicks: 0,
        shares: 0
      },
      
      // Settings
      settings: {
        isPublic: false,
        allowDownload: true,
        showAnalytics: true,
        customDomain: '',
        password: ''
      }
    };
    
    await setDoc(cardRef, card);
    return cardId;
  },

  // Get card by ID
  async getCard(cardId) {
    const cardDoc = await getDoc(doc(db, COLLECTIONS.CARDS, cardId));
    return cardDoc.exists() ? { id: cardDoc.id, ...cardDoc.data() } : null;
  },

  // Get card by slug
  async getCardBySlug(slug) {
    const q = query(
      collection(db, COLLECTIONS.CARDS),
      where('slug', '==', slug),
      where('status', '==', CARD_STATUS.PUBLISHED)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },

  // Get all cards for admin
  async getAdminCards(adminId) {
    const q = query(
      collection(db, COLLECTIONS.CARDS),
      where('adminId', '==', adminId),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update card
  async updateCard(cardId, updates) {
    const cardRef = doc(db, COLLECTIONS.CARDS, cardId);
    await updateDoc(cardRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Update enabled features
  async updateEnabledFeatures(cardId, features) {
    const cardRef = doc(db, COLLECTIONS.CARDS, cardId);
    await updateDoc(cardRef, {
      enabledFeatures: features,
      updatedAt: serverTimestamp()
    });
  },

  // Update specific section
  async updateCardSection(cardId, section, data) {
    console.log('cardService.updateCardSection called:', { cardId, section, data });
    const cardRef = doc(db, COLLECTIONS.CARDS, cardId);
    try {
      await updateDoc(cardRef, {
        [section]: data,
        updatedAt: serverTimestamp()
      });
      console.log('Firestore update successful');
    } catch (error) {
      console.error('Firestore update failed:', error);
      throw error;
    }
  },

  // Publish card
  async publishCard(cardId) {
    const cardRef = doc(db, COLLECTIONS.CARDS, cardId);
    await updateDoc(cardRef, {
      status: CARD_STATUS.PUBLISHED,
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  // Delete card
  async deleteCard(cardId) {
    await deleteDoc(doc(db, COLLECTIONS.CARDS, cardId));
  },

  // Upload image
  async uploadImage(file, path) {
    const storageRef = ref(storage, `${path}/${uuidv4()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  // Delete image
  async deleteImage(imageUrl) {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  },

  // Track view
  async trackView(cardId) {
    const cardRef = doc(db, COLLECTIONS.CARDS, cardId);
    await updateDoc(cardRef, {
      'analytics.views': increment(1)
    });
  },

  // Add service
  async addService(cardId, service) {
    const card = await this.getCard(cardId);
    const services = card.services.items || [];
    services.push({
      id: uuidv4(),
      ...service,
      createdAt: new Date().toISOString()
    });
    
    await this.updateCardSection(cardId, 'services', {
      ...card.services,
      items: services
    });
  },

  // Add product
  async addProduct(cardId, product) {
    const card = await this.getCard(cardId);
    const products = card.products.items || [];
    products.push({
      id: uuidv4(),
      ...product,
      createdAt: new Date().toISOString()
    });
    
    await this.updateCardSection(cardId, 'products', {
      ...card.products,
      items: products
    });
  },

  // Add team member
  async addTeamMember(cardId, member) {
    const card = await this.getCard(cardId);
    const team = card.team.members || [];
    team.push({
      id: uuidv4(),
      ...member,
      createdAt: new Date().toISOString()
    });
    
    await this.updateCardSection(cardId, 'team', {
      ...card.team,
      members: team
    });
  }
};
