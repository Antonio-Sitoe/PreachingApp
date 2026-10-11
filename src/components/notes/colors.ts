export const NOTE_COLORS = [
  { name: 'default', label: 'Padrão', color: '#A1CEDC' },
  { name: 'coral', label: 'Coral', color: '#FF6B6B' },
  { name: 'turquoise', label: 'Turquesa', color: '#4ECDC4' },
  { name: 'blue', label: 'Azul', color: '#45B7D1' },
  { name: 'mint', label: 'Menta', color: '#96CEB4' },
  { name: 'yellow', label: 'Amarelo', color: '#FFEAA7' },
  { name: 'purple', label: 'Roxo', color: '#DDA0DD' },
  { name: 'teal', label: 'Verde-azulado', color: '#98D8C8' },
  { name: 'peach', label: 'Pêssego', color: '#F7DC6F' },
  { name: 'lavender', label: 'Lavanda', color: '#BB8FCE' },
  { name: 'sky', label: 'Céu', color: '#85C1E9' },
  { name: 'green', label: 'Verde', color: '#328048' },
  { name: 'gray', label: 'Cinzento', color: '#687076' },
  { name: 'violet', label: 'Violeta', color: '#6979F8' },
] as const;

export function isColorDark(colorHex: string) {
  const hex = colorHex.replace('#', '');
  if (hex.length < 6) return false;

  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  if ([r, g, b].some((channel) => Number.isNaN(channel))) return false;

  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export function inkOn(colorHex: string) {
  return isColorDark(colorHex) ? '#FFFFFF' : '#1E1E1E';
}

export function adjustColorBrightness(color: string, amount: number) {
  if (!color.startsWith('#')) return color;

  const num = Number.parseInt(color.slice(1), 16);
  if (Number.isNaN(num)) return color;

  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
