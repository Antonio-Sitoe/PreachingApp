import { Text } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { View, type ViewProps } from 'react-native';

const avatarVariants = cva('shrink-0 items-center justify-center rounded-full', {
  variants: {
    size: {
      md: 'size-10',
      lg: 'size-16',
      xl: 'size-[72px]',
    },
    tone: {
      soft: 'bg-secondary',
      brand: 'bg-primary',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'soft',
  },
});

const avatarTextVariants = cva('', {
  variants: {
    size: {
      md: 'font-display-medium text-title-s',
      lg: 'font-display text-title-l',
      xl: 'font-display text-title-xl',
    },
    tone: {
      soft: 'text-primary-strong',
      brand: 'text-primary-foreground',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'soft',
  },
});

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0];
  const last = words.length > 1 ? words[words.length - 1] : '';
  return (first.charAt(0) + last.charAt(0)).toLocaleUpperCase();
}

type AvatarProps = ViewProps &
  VariantProps<typeof avatarVariants> & {
    name: string;

    initials?: string;
  };

function Avatar({ name, initials, size, tone, className, ...props }: AvatarProps) {
  return (
    <View
      className={cn(avatarVariants({ size, tone }), className)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      {...props}>
      <Text className={avatarTextVariants({ size, tone })}>{initials ?? getInitials(name)}</Text>
    </View>
  );
}

export { Avatar, getInitials };
export type { AvatarProps };
