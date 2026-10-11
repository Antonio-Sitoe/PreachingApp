/**
 * Conta do utilizador: entrar, criar conta, confirmar o email e recuperar a senha.
 *
 * POR FAZER: ainda não há servidor. Este ficheiro define o que os ecrãs de
 * src/app/auth precisam; quando o backend existir, só o corpo destas funções muda.
 *
 * Em desenvolvimento (`__DEV__`) há um simulador, só para rever os ecrãs:
 *   - Entrar: qualquer email com a senha `Caminho#2026` entra; outra senha dá "incorrectos".
 *   - Código: `1234` está certo, `0000` está expirado, qualquer outro está errado.
 * Fora de desenvolvimento, todas as funções falham com `unavailable`.
 */
export type AuthErrorCode =
  /** A conta ainda não existe nesta versão do app. */
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

/** Para que serve o código de 4 dígitos: confirmar a conta nova ou recuperar a senha. */
export type CodeFlow = 'sign-up' | 'reset';

/** Verdadeiro quando o app já falar com o servidor. */
export const AUTH_AVAILABLE = false;

export const UNAVAILABLE_MESSAGE = 'A conta ainda não está disponível nesta versão.';

const DEV_PASSWORD = 'Caminho#2026';
const DEV_CODE = '1234';
const DEV_EXPIRED_CODE = '0000';

/** Só o simulador de desenvolvimento passa daqui. */
async function simulate(): Promise<void> {
  if (!__DEV__) throw new AuthError('unavailable');
  await new Promise((resolve) => setTimeout(resolve, 400));
}

export async function signIn(email: string, password: string): Promise<void> {
  await simulate();
  if (!email || password !== DEV_PASSWORD) throw new AuthError('invalid-credentials');
}

export async function signInWithGoogle(): Promise<void> {
  // POR FAZER: precisa do SDK do Google e do servidor. Não há simulador.
  throw new AuthError('unavailable');
}

/** Cria a conta e envia o código de confirmação para o email. */
export async function signUp(_email: string, _password: string): Promise<void> {
  await simulate();
}

/** Envia para o email o código para escolher uma senha nova. */
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

/** O código de erro, ou `network` para falhas que não vieram do servidor. */
export function getAuthErrorCode(error: unknown): AuthErrorCode {
  return error instanceof AuthError ? error.code : 'network';
}
