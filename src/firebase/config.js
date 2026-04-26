import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDSA9eYdtVzF-8OhVQ0kK2kP8oZLSOMNFs",
  authDomain: "digital-cards-38a1d.firebaseapp.com",
  projectId: "digital-cards-38a1d",
  storageBucket: "digital-cards-38a1d.firebasestorage.app",
  messagingSenderId: "73437948325",
  appId: "1:73437948325:web:3c928b689022beeea8604c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
