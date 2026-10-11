import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

/**
 * Os ícones do Design 2.0 (canvas, artboard "Ícones", mais os dos ecrãs), com os traços do canvas.
 * Grelha de 24, traço de 2, pontas e uniões redondas. O nome do canvas vem em comentário.
 * Para um ícone que não esteja aqui, usa o `Icon` (lucide) de '@/components/ui/icon'.
 */
export const APP_ICONS = {
  today: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10', // hoje
  people:
    'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', // pessoas
  notes: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8', // notas
  more: 'M12 12h.01M19 12h.01M5 12h.01', // mais
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0', // sino
  check: 'M20 6L9 17l-5-5', // visto
  clock: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 6v6l4 2', // relógio
  'chevron-right': 'M9 18l6-6-6-6', // seguinte
  'chevron-down': 'M6 9l6 6 6-6', // abrir
  'chevron-left': 'M15 18l-6-6 6-6', // voltar
  plus: 'M12 5v14M5 12h14', // adicionar
  'map-pin': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6z', // local
  calendar:
    'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18', // calendário
  alert: 'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM12 8v4M12 16h.01', // alerta
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z', // pausa
  close: 'M18 6L6 18M6 6l12 12', // fechar
  book: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', // livro
  question:
    'M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01', // dúvida
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z', // levar
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z', // conversa
  undo: 'M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4', // desfazer
  play: 'M5 3l14 9-14 9V3z', // iniciar
  'not-home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9.5 11.5l5 5M14.5 11.5l-5 5', // ausente
  rhythm: 'M22 12h-4l-3 9L9 3l-3 9H2', // ritmo
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z', // publicador
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6', // ficheiro
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z', // mostrar senha
  'eye-off':
    'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22', // esconder senha
} as const;

export type AppIconName = keyof typeof APP_ICONS;

export const APP_ICON_NAMES = Object.keys(APP_ICONS) as AppIconName[];

type AppIconProps = Omit<SvgProps, 'children'> & {
  name: AppIconName;
  /** Lado do ícone em px. Por omissão 24. */
  size?: number;
  /** Espessura do traço. Por omissão 2. */
  strokeWidth?: number;
};

function AppIconImpl({ name, size = 24, strokeWidth = 2, ...props }: AppIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}>
      <Path d={APP_ICONS[name]} />
    </Svg>
  );
}

cssInterop(AppIconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
    },
  },
});

/**
 * Ícone do app. Herda a cor do texto do pai (por exemplo dentro de um Button)
 * ou recebe-a por `className`.
 *
 * @example
 * <AppIcon name="people" className="text-primary" />
 * <AppIcon name="check" size={20} />
 */
function AppIcon({ className, ...props }: AppIconProps & { className?: string }) {
  const textClass = React.useContext(TextClassContext);
  return <AppIconImpl className={cn('text-foreground', textClass, className)} {...props} />;
}

export { AppIcon };
export type { AppIconProps };
