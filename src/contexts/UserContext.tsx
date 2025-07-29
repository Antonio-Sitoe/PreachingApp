import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import { create } from 'zustand';
import { ENV } from '@/lib/env';
import { usersActions, type User } from '@/database/actions';

interface UserSession {
  email: string;
  familyName?: string;
  givenName?: string;
  id: string;
  name?: string;
  photo?: string;
  [key: string]: any;
}
type GoogleSignInResponse = {
  data: {
    idToken: string | null;
    scopes: string[];
    serverAuthCode: string | null;
    user: UserSession;
  };
  type: 'success' | 'error';
};

interface UserState {
  user: User | null;
  userSession: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setProfileUser: (user: User) => void;
  autoSignIn: () => Promise<void>;
  autoGetUser: () => Promise<void>;
  autoLogin: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

if (ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID) {
  GoogleSignin.configure({
    webClientId: ENV.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    offlineAccess: false,
  });
}

export const useUser = create<UserState>((set, get) => ({
  user: null,
  userSession: null,
  isAuthenticated: false,
  isLoading: false,
  setProfileUser: (user) => set({ user, isAuthenticated: !!user }),
  autoSignIn: async () => {
    await get().autoLogin();
    await get().autoGetUser();
  },

  autoGetUser: async () => {
    set({ isLoading: true });
    try {
      const user = await usersActions.findFirstUser();
      if (user) {
        set({
          user: user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.log('AutoSignIn error:', error);
    }
  },
  autoLogin: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const session = data.session;
      if (session?.user) {
        set({
          userSession: {
            id: session.user.id,
            email: session.user.email || '',
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name,
            avatarImage:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture,
            provider: session.user.app_metadata?.provider,
            role: session.user.role,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ userSession: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ userSession: null, isAuthenticated: false, isLoading: false });
      console.log('AutoSignIn error:', error);
    }
  },
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
      const supaUser = data.user as UserSession;
      set({
        userSession: supaUser
          ? {
              ...supaUser,
              username: supaUser.user_metadata?.full_name || '',
              avatarImage:
                supaUser.user_metadata?.avatar_url ||
                supaUser.user_metadata?.picture ||
                '',
              profile: 'publisher',
            }
          : null,
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
      set({ userSession: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.log('Logout error:', error);
      throw error;
    }
  },
}));
