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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

const TEMPLATES_COLLECTION = 'templates';

export const templateService = {
  // Get all templates
  async getAllTemplates() {
    try {
      const snapshot = await getDocs(collection(db, TEMPLATES_COLLECTION));
      const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return templates.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  },

  // Get active templates (for admins)
  async getActiveTemplates() {
    try {
      const q = query(
        collection(db, TEMPLATES_COLLECTION),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by order in JavaScript if order field exists
      return templates.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Error fetching active templates:', error);
      // If query fails, try without where clause
      const snapshot = await getDocs(collection(db, TEMPLATES_COLLECTION));
      const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return templates.filter(t => t.isActive !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  },

  // Get template by ID
  async getTemplate(templateId) {
    try {
      const docRef = doc(db, TEMPLATES_COLLECTION, templateId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('Template loaded:', templateId, data);
        return { id: docSnap.id, ...data };
      } else {
        console.log('Template not found:', templateId);
        return null;
      }
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Create template
  async createTemplate(templateData) {
    try {
      // If template has an ID, use it; otherwise generate one
      const templateId = templateData.id || doc(collection(db, TEMPLATES_COLLECTION)).id;
      const templateRef = doc(db, TEMPLATES_COLLECTION, templateId);
      
      const dataToSave = {
        ...templateData,
        id: templateId, // Ensure ID is in the document
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      console.log('Creating template with ID:', templateId);
      await setDoc(templateRef, dataToSave);
      console.log('Template created successfully:', templateId);
      return templateId;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  async updateTemplate(templateId, updates) {
    const templateRef = doc(db, TEMPLATES_COLLECTION, templateId);
    await updateDoc(templateRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Delete template
  async deleteTemplate(templateId) {
    await deleteDoc(doc(db, TEMPLATES_COLLECTION, templateId));
  },

  // Toggle template status
  async toggleTemplateStatus(templateId, isActive) {
    await this.updateTemplate(templateId, { isActive });
  }
};
