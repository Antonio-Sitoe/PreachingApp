import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { SHADOWS } from '@/lib/theme';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';

const iconButtonVariants = cva('shrink-0 items-center justify-center rounded-full', {
  variants: {
    variant: {
      outline: 'size-11 border-[1.5px] border-border bg-transparent active:bg-secondary',
      ghost: 'size-11 bg-transparent active:bg-secondary',
      fab: 'size-[58px] bg-primary active:bg-primary/90',
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
});

const ICON_CLASS = {
  outline: 'text-primary',
  ghost: 'text-foreground',
  fab: 'text-primary-foreground',
} as const;

const ICON_SIZE = {
  outline: 20,
  ghost: 24,
  fab: 26,
} as const;

type IconButtonProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof iconButtonVariants> & {
    icon: AppIconName;

    accessibilityLabel: string;

    iconClassName?: string;
  };

function IconButton({ icon, variant, className, iconClassName, style, ...props }: IconButtonProps) {
  const resolved = variant ?? 'outline';
  return (
    <Pressable
      className={cn(props.disabled && 'opacity-50', iconButtonVariants({ variant }), className)}
      role="button"
      style={(state) => [
        resolved === 'fab' && { boxShadow: SHADOWS.fab },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}>
      <AppIcon
        name={icon}
        size={ICON_SIZE[resolved]}
        className={cn(ICON_CLASS[resolved], iconClassName)}
      />
    </Pressable>
  );
}

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
