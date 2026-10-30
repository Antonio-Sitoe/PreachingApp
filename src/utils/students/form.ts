/** Mensagem de erro do telefone, ou `undefined` se estiver vazio ou certo. Aceita o indicativo 258. */
export function validatePhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  const local = digits.length === 12 && digits.startsWith('258') ? digits.slice(3) : digits;
  if (local.length < 9) return 'Faltam dígitos. Um número tem 9.';
  if (local.length > 9) return 'Há dígitos a mais. Um número tem 9.';
  return undefined;
}

/** "15:00" a partir de um Date. */
export function toTimeString(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** Um Date com a hora de "15:00", para o selector de hora. */
export function fromTimeString(time: string | null): Date {
  const [hours, minutes] = (time ?? '15:00').split(':').map(Number);
  return new Date(2020, 0, 1, hours || 0, minutes || 0, 0, 0);
}
