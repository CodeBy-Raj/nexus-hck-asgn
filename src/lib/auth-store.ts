
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

interface AuthState {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  token: string | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (name: string, photoURL: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      setUser: (user) => {
        if (!user) {
          set({ user: null, token: null });
          return;
        }
        set({ 
          user: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          }
        });
      },
      setLoading: (loading) => set({ loading }),
      login: async (email, password) => {
        const { auth } = initializeFirebase();
        set({ loading: true });
        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
          const token = await res.user.getIdToken();
          set({ token });
        } finally {
          set({ loading: false });
        }
      },
      registerUser: async (name, email, password) => {
        const { auth, db } = initializeFirebase();
        set({ loading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          await updateProfile(user, { displayName: name });
          
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: name,
            email: email,
            photoURL: `https://picsum.photos/seed/${user.uid}/100/100`,
            createdAt: new Date().toISOString()
          });

          const token = await user.getIdToken();
          set({ token });
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        const { auth } = initializeFirebase();
        await signOut(auth);
        set({ user: null, token: null });
        localStorage.removeItem('auth-storage');
      },
      updateUser: async (name, photoURL) => {
        const { auth, db } = initializeFirebase();
        const user = auth.currentUser;
        if (!user) return;
        
        await updateProfile(user, { displayName: name, photoURL });
        await setDoc(doc(db, 'users', user.uid), {
          displayName: name,
          photoURL,
        }, { merge: true });

        set({ 
          user: {
            ...get().user!,
            displayName: name,
            photoURL,
          }
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
