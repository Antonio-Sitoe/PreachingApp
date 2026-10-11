import LogoColor from '@/assets/brand/logo-color.svg';
import LogoWhite from '@/assets/brand/logo-white.svg';
import { useColorScheme } from 'nativewind';
import type { SvgProps } from 'react-native-svg';

/** Proporção do logótipo do kit da marca: 513,53 × 591,59. */
const ASPECT_RATIO = 513.53 / 591.59;

type LogoProps = Omit<SvgProps, 'width' | 'height'> & {
  /**
   * - `auto` (por omissão): a cores no tema claro, branco no tema escuro.
   * - `color`: roxo #4A5385, para fundos claros.
   * - `white`: para o roxo da marca e para fundos escuros.
   */
  variant?: 'auto' | 'color' | 'white';
  /** Largura em px; a altura segue a proporção. No canvas: 181 (× 207 de altura). */
  width?: number;
};

/** Logótipo do Preaching Assistant (canvas, artboard "Marca e logótipo"). */
function Logo({ variant = 'auto', width = 181, ...props }: LogoProps) {
  const { colorScheme } = useColorScheme();
  const white = variant === 'white' || (variant === 'auto' && colorScheme === 'dark');
  const Component = white ? LogoWhite : LogoColor;

  return (
    <Component
      width={width}
      height={Math.round(width / ASPECT_RATIO)}
      role="img"
      aria-label="Preaching Assistant"
      {...props}
    />
  );
}

export { Logo };
export type { LogoProps };
