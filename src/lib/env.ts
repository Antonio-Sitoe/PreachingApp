import { z } from 'zod';
import Constants from 'expo-constants';

export const envSchema = z.object({}).passthrough();

export const ENV = envSchema.parse(Constants.expoConfig?.extra ?? {});
