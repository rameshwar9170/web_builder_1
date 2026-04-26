import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { COLLECTIONS, ROLES } from '../firebase/collections';

export const authService = {
  // Register new user
  async register(email, password, userData) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: userData.name
    });

    await setDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      uid: user.uid,
      email: email,
      name: userData.name,
      role: userData.role || ROLES.USER,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      createdBy: userData.createdBy || null
    });

    return user;
  },

  // Login - check if user exists in Firestore first
  async login(email, password) {
    // First check if user exists in Firestore with temp password
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    let userDocData = null;
    let userDocId = null;
    
    if (!querySnapshot.empty) {
      userDocData = querySnapshot.docs[0].data();
      userDocId = querySnapshot.docs[0].id;
      
      // Check if user is active
      if (userDocData.isActive === false) {
        throw new Error('Account is inactive');
      }
      
      // If user has temp password and it matches, create auth account
      if (userDocData.tempPassword && userDocData.tempPassword === password) {
        try {
          // Create Firebase Auth account
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          // Update Firestore to remove temp password and link to auth UID
          await updateDoc(doc(db, COLLECTIONS.USERS, userDocId), {
            uid: userCredential.user.uid,
            tempPassword: null,
            needsPasswordReset: false,
            updatedAt: serverTimestamp()
          });
          
          // Update profile
          await updateProfile(userCredential.user, {
            displayName: userDocData.name
          });
          
          // Update the userDocData with new uid
          userDocData.uid = userCredential.user.uid;
          
          return { user: userCredential.user, userData: userDocData };
        } catch (authError) {
          // If account already exists, try to login
          if (authError.code === 'auth/email-already-in-use') {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            // Get the latest user data
            const updatedUserDoc = await getDoc(doc(db, COLLECTIONS.USERS, userDocId));
            if (updatedUserDoc.exists()) {
              return { user: userCredential.user, userData: updatedUserDoc.data() };
            }
            
            return { user: userCredential.user, userData: userDocData };
          }
          throw authError;
        }
      }
    }
    
    // Normal login flow - try Firebase Auth first
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Try to find user by UID first
      let userDoc = await getDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid));
      
      // If not found by UID, try to find by email
      if (!userDoc.exists()) {
        const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          
          // Update the document to use the correct UID
          await updateDoc(snapshot.docs[0].ref, {
            uid: userCredential.user.uid,
            updatedAt: serverTimestamp()
          });
          
          return { user: userCredential.user, userData };
        }
        
        await signOut(auth);
        throw new Error('Account does not exist in database');
      }
      
      if (!userDoc.data().isActive) {
        await signOut(auth);
        throw new Error('Account is inactive');
      }

      return { user: userCredential.user, userData: userDoc.data() };
    } catch (error) {
      // If auth fails, check if it's because account doesn't exist yet
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      }
      throw error;
    }
  },

  // Logout
  async logout() {
    await signOut(auth);
  },

  // Reset password
  async resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  },

  // Get current user data
  async getCurrentUserData(uid) {
    // First try to get by UID
    let userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    // If not found by UID, try to find by auth user email
    const user = auth.currentUser;
    if (user && user.email) {
      const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', user.email));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        
        // Update the document to use the correct UID
        await updateDoc(snapshot.docs[0].ref, {
          uid: uid,
          updatedAt: serverTimestamp()
        });
        
        return { ...userData, uid };
      }
    }
    
    return null;
  }
};
