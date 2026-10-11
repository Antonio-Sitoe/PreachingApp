/**
 * Validação dos formulários de conta, com as mensagens do canvas
 * (artboards "Criar conta" e "Criar conta, campos com erro").
 */

export const PASSWORD_MIN_LENGTH = 8;

/** Devolve a mensagem de erro do email, ou `undefined` se estiver bem. */
export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (!email) return 'Escreve o teu email.';
  if (/\s/.test(email)) return 'O email não pode ter espaços.';
  const at = email.indexOf('@');
  if (at < 1) return 'Este email não parece completo. Falta o @.';
  const domain = email.slice(at + 1);
  if (!domain || domain.includes('@')) return 'Este email não parece completo.';
  if (!/^[^.]+(\.[^.]+)+$/.test(domain)) {
    return 'Este email não parece completo. Falta a parte depois do ponto.';
  }
  return undefined;
}

export type PasswordRules = {
  length: boolean;
  upperAndLower: boolean;
  number: boolean;
  special: boolean;
  match: boolean;
};

/** As cinco regras da senha, para a lista de verificação do ecrã "Criar conta". */
export function checkPasswordRules(password: string, repeat: string): PasswordRules {
  return {
    length: password.length >= PASSWORD_MIN_LENGTH,
    upperAndLower: /\p{Lu}/u.test(password) && /\p{Ll}/u.test(password),
    number: /\d/.test(password),
    special: /[^\p{L}\d\s]/u.test(password),
    match: password.length > 0 && password === repeat,
  };
}

export const PASSWORD_RULE_LABELS: { key: keyof PasswordRules; label: string }[] = [
  { key: 'length', label: `Pelo menos ${PASSWORD_MIN_LENGTH} caracteres` },
  { key: 'upperAndLower', label: 'Uma letra maiúscula e uma minúscula' },
  { key: 'number', label: 'Um número' },
  { key: 'special', label: 'Um carácter especial' },
  { key: 'match', label: 'As duas senhas iguais' },
];

/** "a", "a e b", "a, b e c". */
function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`;
}

/**
 * Diz o que falta à senha, numa frase:
 * "Faltam 1 carácter, uma maiúscula, um número e um carácter especial."
 */
export function validateNewPassword(password: string): string | undefined {
  if (!password) return 'Escolhe uma senha.';
  const missing: string[] = [];
  const short = PASSWORD_MIN_LENGTH - password.length;
  if (short > 0) missing.push(short === 1 ? '1 carácter' : `${short} caracteres`);
  if (!/\p{Lu}/u.test(password)) missing.push('uma maiúscula');
  if (!/\p{Ll}/u.test(password)) missing.push('uma minúscula');
  if (!/\d/.test(password)) missing.push('um número');
  if (!/[^\p{L}\d\s]/u.test(password)) missing.push('um carácter especial');
  if (missing.length === 0) return undefined;
  const verb = missing.length === 1 && short <= 1 ? 'Falta' : 'Faltam';
  return `${verb} ${joinList(missing)}.`;
}

export function validateRepeatPassword(password: string, repeat: string): string | undefined {
  if (!repeat) return 'Repete a senha.';
  if (password !== repeat) return 'As duas senhas não são iguais.';
  return undefined;
}
