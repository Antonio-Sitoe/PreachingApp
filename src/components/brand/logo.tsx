import LogoColor from '@/assets/brand/logo-color.svg';
import LogoWhite from '@/assets/brand/logo-white.svg';
import { useColorScheme } from 'nativewind';
import type { SvgProps } from 'react-native-svg';

const ASPECT_RATIO = 513.53 / 591.59;

type LogoProps = Omit<SvgProps, 'width' | 'height'> & {

  variant?: 'auto' | 'color' | 'white';

  width?: number;
};

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
