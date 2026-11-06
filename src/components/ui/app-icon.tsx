import { TextClassContext } from '@/components/ui/text';
import { APP_ICONS, type AppIconName } from '@/constants/icons';
import { cn } from '@/utils/cn';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';

type AppIconProps = Omit<SvgProps, 'children'> & {
  name: AppIconName;

  size?: number;

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

function AppIcon({ className, ...props }: AppIconProps & { className?: string }) {
  const textClass = React.useContext(TextClassContext);
  return <AppIconImpl className={cn('text-foreground', textClass, className)} {...props} />;
}

export { AppIcon };
export type { AppIconProps };
