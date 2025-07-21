import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';

export interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setProfileUser: (user: User) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  setProfileUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // Type assertion is used here because the return type from GoogleSignin.signIn()
      // is not correctly typed in the package, but the docs confirm idToken exists.
      const user = (await GoogleSignin.signIn()) as { idToken?: string };
      const idToken = user?.idToken;
      if (!idToken) throw new Error('No Google ID token');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (error) throw error;
      const supaUser = data.user;
      set({
        user: supaUser ? { id: supaUser.id, email: supaUser.email } : null,
        isAuthenticated: !!supaUser,
      });
    } catch (error) {
      console.log('Login error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();
      await GoogleSignin.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.log('Logout error:', error);
      throw error;
    }
  },
}));
