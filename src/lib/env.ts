import { z } from 'zod';
import Constants from 'expo-constants';

export const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
});

export const ENV = envSchema.parse(Constants.expoConfig?.extra);
