import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  
  authDomain: "directed-osprey-wk91c.firebaseapp.com",
  projectId: "directed-osprey-wk91c",
  storageBucket: "directed-osprey-wk91c.firebasestorage.app",
  messagingSenderId: "194959398748",
  appId: "1:194959398748:web:abed092bf7e52942cd9399"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-cscareerguide-c0488003-09db-4ac8-99db-81a4741aa8d5");
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
      console.warn("Sign-in popup was cancelled or closed by the user.");
      return null;
    }
    if (error.code === 'auth/popup-blocked') {
      const msg = "Sign-in popup was blocked by your browser. Please allow popups for this site, or click the 'Open App in New Tab' button to sign in.";
      console.warn(msg);
      throw new Error(msg);
    }
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
