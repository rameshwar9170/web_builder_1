import {
    collection,
    doc,
    setDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp,
    increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS, CARD_STATUS } from '../firebase/collections';
import { v4 as uuidv4 } from 'uuid';

/**
 * Premium Service handles high-end "Experience" cards 
 * specifically designed for premium layouts.
 */
export const premiumService = {
    // Create a high-end premium experience
    async createPremiumExperience(adminId, experienceData) {
        const experienceId = uuidv4();
        const experienceRef = doc(db, COLLECTIONS.CARDS, experienceId);

        // Structure optimized for premium layouts
        const experience = {
            id: experienceId,
            adminId,
            slug: experienceData.slug,
            status: CARD_STATUS.PUBLISHED, // Premium cards often published immediately for demo
            isPremium: true,
            premiumLayout: experienceData.premiumLayout || 'glass',
            premiumWeb: experienceData.premiumWeb || null, // Store the 10-section layout data
            templateId: experienceData.templateId || 'premium-elite',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),

            // Core Content (Minimalist but high-end)
            basicInfo: {
                name: experienceData.name || '',
                title: experienceData.title || '',
                logo: experienceData.logo || '',
                profileImage: experienceData.profileImage || '',
                brandStatement: experienceData.brandStatement || 'Defining Excellence.'
            },

            about: experienceData.about || {
                description: 'A bespoke premium experience crafted for modern digital presence.',
                mission: 'To redefine standard visiting cards into digital experiences.',
                vision: 'Setting the gold standard for personal branding.',
                enabled: true
            },

            // Default Premium Theme Overrides
            theme: experienceData.theme || {
                primaryColor: '#0ea5e9',
                secondaryColor: '#0c4a6e',
                fontFamily: 'Playfair Display',
                layout: 'premium',
                glassEffect: true
            },

            // Contact & Social
            contact: experienceData.contact || {
                email: experienceData.email || '',
                phone: experienceData.phone || '',
                address: '',
                city: '',
                socialLinks: {
                    instagram: '',
                    linkedin: '',
                    twitter: ''
                },
                enabled: true
            },

            // Analytics specifically for premium engagement
            premiumAnalytics: {
                views: 0,
                layoutSwitchCount: 0,
                interactionHeatmap: []
            },

            // Merge any remaining data (like enabledFeatures)
            ...experienceData
        };

        // Ensure ID and timestamps are not overwritten by experienceData
        experience.id = experienceId;
        experience.createdAt = serverTimestamp();
        experience.updatedAt = serverTimestamp();

        await setDoc(experienceRef, experience);
        return experienceId;
    },

    // Get premium experience by slug
    async getExperienceBySlug(slug) {
        const q = query(
            collection(db, COLLECTIONS.CARDS),
            where('slug', '==', slug),
            where('isPremium', '==', true)
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    },

    // Track layout switches (Premium specific metric)
    async trackLayoutSwitch(experienceId, toLayout) {
        const experienceRef = doc(db, COLLECTIONS.CARDS, experienceId);
        await updateDoc(experienceRef, {
            'premiumAnalytics.layoutSwitchCount': increment(1),
            updatedAt: serverTimestamp()
        });
    }
};
