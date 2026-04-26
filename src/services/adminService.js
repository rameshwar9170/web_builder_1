import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS, ROLES } from '../firebase/collections';

export const adminService = {
  // Create admin by super admin
  async createAdmin(adminData, superAdminId) {
    const adminRef = doc(collection(db, COLLECTIONS.USERS));
    
    await setDoc(adminRef, {
      uid: adminRef.id,
      email: adminData.email,
      name: adminData.name,
      role: ROLES.ADMIN,
      phone: adminData.phone || '',
      company: adminData.company || '',
      isActive: true,
      createdBy: superAdminId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Store temporary password (in production, use email verification)
      tempPassword: adminData.password,
      needsPasswordReset: true,
      subscription: {
        plan: adminData.plan || 'basic',
        startDate: serverTimestamp(),
        endDate: null,
        isActive: true
      },
      limits: {
        maxCards: adminData.maxCards || 5,
        maxStorage: adminData.maxStorage || 100, // MB
        customDomain: adminData.customDomain || false
      }
    });

    return adminRef.id;
  },

  // Get all admins (for super admin)
  async getAllAdmins() {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      where('role', '==', ROLES.ADMIN)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update admin
  async updateAdmin(adminId, updates) {
    const adminRef = doc(db, COLLECTIONS.USERS, adminId);
    await updateDoc(adminRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Toggle admin status
  async toggleAdminStatus(adminId, isActive) {
    const adminRef = doc(db, COLLECTIONS.USERS, adminId);
    await updateDoc(adminRef, {
      isActive,
      updatedAt: serverTimestamp()
    });
  },

  // Delete admin
  async deleteAdmin(adminId) {
    await deleteDoc(doc(db, COLLECTIONS.USERS, adminId));
  },

  // Get admin stats
  async getAdminStats(adminId) {
    const cardsQuery = query(
      collection(db, COLLECTIONS.CARDS),
      where('adminId', '==', adminId)
    );
    const cardsSnapshot = await getDocs(cardsQuery);
    
    return {
      totalCards: cardsSnapshot.size,
      publishedCards: cardsSnapshot.docs.filter(doc => doc.data().status === 'published').length,
      draftCards: cardsSnapshot.docs.filter(doc => doc.data().status === 'draft').length
    };
  }
};
