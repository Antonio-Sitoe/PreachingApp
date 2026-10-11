
export const NOTE_COLORS = [
  { name: 'blue', label: 'Cor azul', color: '#E3E7F8' },
  { name: 'pink', label: 'Cor rosa', color: '#FFE5F0' },
  { name: 'gray', label: 'Cor cinzento', color: '#F1F2F5' },
  { name: 'green', label: 'Cor verde', color: '#E6F6EE' },
  { name: 'yellow', label: 'Cor amarelo', color: '#FFF4E0' },
  { name: 'orange', label: 'Cor laranja', color: '#FFE5D0' },
  { name: 'purple', label: 'Cor roxa', color: '#F0E5FF' },
  { name: 'red', label: 'Cor vermelho', color: '#FFE5E5' },
  { name: 'brown', label: 'Cor marrom', color: '#F5E5D0' },
  { name: 'black', label: 'Cor preto', color: '#1E1E1E' },
  { name: 'white', label: 'Cor branco', color: '#FFFFFF' },
] as const;

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].color;

export const NOTE_INK = '#1E1E1E';
export const NOTE_INK_MUTED = '#484C52';
