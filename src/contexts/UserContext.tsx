import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';
import { ENV } from '@/lib/env';

export interface User {
  id: string;
  email?: string;
  [key: string]: any;
}

type GoogleSignInResponse = {
  data: {
    idToken: string | null;
    scopes: string[];
    serverAuthCode: string | null;
    user: {
      email: string;
      familyName?: string;
      givenName?: string;
      id: string;
      name?: string;
      photo?: string;
      [key: string]: any;
    };
  };
  type: 'success' | 'error';
};

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setProfileUser: (user: User) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

GoogleSignin.configure({
  webClientId: ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  offlineAccess: false,
});

export const useUser = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setProfileUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async () => {
    set({ isLoading: true });
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const user = (await GoogleSignin.signIn()) as GoogleSignInResponse;
      const idToken = user?.data?.idToken;
      console.log('idToken', user);
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
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      console.log('Login error:', error);
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      await GoogleSignin.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.log('Logout error:', error);
      throw error;
    }
  },
}));
