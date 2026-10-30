import {
  getLockBlockedUntil,
  getLockFailedAttempts,
  setBiometricEnabled,
  setLockBlockedUntil,
  setLockEnabled,
  setLockFailedAttempts,
} from '@/utils/storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

export const PIN_LENGTH = 4;
export const MAX_ATTEMPTS = 3;
export const BLOCK_MS = 60_000;

const PIN_KEY = 'app-lock.pin';

type StoredPin = { salt: string; hash: string };

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

function hashPin(salt: string, pin: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);
}

async function readPin(): Promise<StoredPin | null> {
  const raw = await SecureStore.getItemAsync(PIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredPin;
  } catch {
    return null;
  }
}

export async function hasPin(): Promise<boolean> {
  return (await readPin()) !== null;
}

// Só o hash sai daqui; o PIN nunca fica guardado em texto.
export async function savePin(pin: string): Promise<void> {
  const salt = toHex(Crypto.getRandomBytes(16));
  const hash = await hashPin(salt, pin);
  await SecureStore.setItemAsync(PIN_KEY, JSON.stringify({ salt, hash }));
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = await readPin();
  if (!stored) return false;
  return (await hashPin(stored.salt, pin)) === stored.hash;
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function disableLock(): Promise<void> {
  await clearPin();
  setLockEnabled(false);
  setBiometricEnabled(false);
  resetFailures();
}

export type FailureResult = { attemptsLeft: number; blockedUntil: number };

// À terceira falha seguida, espera de 1 minuto. Fica no MMKV para sobreviver a fechar o app.
export function registerFailure(now = Date.now()): FailureResult {
  const attempts = getLockFailedAttempts() + 1;
  if (attempts >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_MS;
    setLockFailedAttempts(0);
    setLockBlockedUntil(blockedUntil);
    return { attemptsLeft: MAX_ATTEMPTS, blockedUntil };
  }
  setLockFailedAttempts(attempts);
  return { attemptsLeft: MAX_ATTEMPTS - attempts, blockedUntil: 0 };
}

export function resetFailures(): void {
  setLockFailedAttempts(0);
  setLockBlockedUntil(0);
}

export function getBlockedUntil(now = Date.now()): number {
  const until = getLockBlockedUntil();
  return until > now ? until : 0;
}
