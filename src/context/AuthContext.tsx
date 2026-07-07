import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth'; // kept for typing

export interface User {
  _id?: string;
  uid?: string; // fallback
  email: string;
  name?: string;
  fullName?: string;
  displayName?: string;
  photoURL?: string;
  profileImage?: string;
  collegeName?: string;
  department?: string;
  year?: number | string;
  registerNumber?: string;
  skills?: string[];
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  role: 'student' | 'admin';
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: Omit<User, 'uid' | '_id'>) => Promise<void>;
  loginWithGoogle: (firebaseUser: FirebaseUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  updateUser: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('techpath_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser.token) {
            // Verify with backend
            const res = await fetch('/api/users/profile', {
              headers: { Authorization: `Bearer ${parsedUser.token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setUser({ ...data, token: parsedUser.token });
            } else {
              localStorage.removeItem('techpath_user');
              setUser(null);
            }
          } else {
            setUser(parsedUser); // fallback for legacy google auth
          }
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const loginWithGoogle = async (firebaseUser: FirebaseUser) => {
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      displayName: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || '',
      role: 'student' // default role
    };
    setUser(userData);
    localStorage.setItem('techpath_user', JSON.stringify(userData));
  };

  const login = async (userData: any) => {
    if (userData.token) {
      try {
        const res = await fetch('/api/users/profile', {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        if (res.ok) {
          const fullProfile = await res.json();
          const userWithToken = { ...fullProfile, token: userData.token };
          setUser(userWithToken);
          localStorage.setItem('techpath_user', JSON.stringify(userWithToken));
          return;
        }
      } catch (err) {
        console.error("Error fetching full profile on login", err);
      }
    }
    
    // Fallback if no token or fetch fails
    setUser(userData);
    localStorage.setItem('techpath_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('techpath_user');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      localStorage.setItem('techpath_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
