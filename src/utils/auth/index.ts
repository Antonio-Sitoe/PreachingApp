export type AuthErrorCode =
  | 'unavailable'
  | 'invalid-credentials'
  | 'email-in-use'
  | 'incorrect-code'
  | 'expired-code'
  | 'network';

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = 'AuthError';
    this.code = code;
  }
}

export type CodeFlow = 'sign-up' | 'reset';

export const AUTH_AVAILABLE = false;

export const UNAVAILABLE_MESSAGE = 'A conta ainda não está disponível nesta versão.';

const DEV_PASSWORD = 'Caminho#2026';
const DEV_CODE = '1234';
const DEV_EXPIRED_CODE = '0000';

async function simulate(): Promise<void> {
  if (!__DEV__) throw new AuthError('unavailable');
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export async function signIn(email: string, password: string): Promise<void> {
  await simulate();
  if (!email || password !== DEV_PASSWORD) throw new AuthError('invalid-credentials');
}

export async function signInWithGoogle(): Promise<void> {
  throw new AuthError('unavailable');
}

export async function signUp(_email: string, _password: string): Promise<void> {
  await simulate();
}

export async function requestPasswordReset(_email: string): Promise<void> {
  await simulate();
}

export async function confirmCode(_email: string, code: string, _flow: CodeFlow): Promise<void> {
  await simulate();
  if (code === DEV_EXPIRED_CODE) throw new AuthError('expired-code');
  if (code !== DEV_CODE) throw new AuthError('incorrect-code');
}

export async function resendCode(_email: string, _flow: CodeFlow): Promise<void> {
  await simulate();
}

export function getAuthErrorCode(error: unknown): AuthErrorCode {
  return error instanceof AuthError ? error.code : 'network';
}
