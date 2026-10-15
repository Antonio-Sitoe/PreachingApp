import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';

const buttonVariants = cva('group shrink-0 flex-row items-center justify-center gap-2 rounded-lg', {
  variants: {
    variant: {
      default: 'bg-primary active:bg-primary/90',
      outline: 'border border-primary bg-transparent active:bg-secondary',
      ghost: 'bg-transparent active:bg-secondary',
      destructive: 'border border-destructive bg-transparent active:bg-destructive-soft',
      neutral: 'bg-[#D9D9D9]/30 active:bg-[#D9D9D9]/50',

      secondary: 'bg-secondary active:bg-secondary/80',
      link: 'bg-transparent',
    },
    size: {
      default: 'min-h-[52px] px-5 py-3',
      sm: 'min-h-11 px-3 py-2',

      lg: 'min-h-[52px] px-5 py-3',
      icon: 'size-11',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const buttonTextVariants = cva('font-display-semibold text-button', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      outline: 'text-primary',
      ghost: 'text-primary',
      destructive: 'text-destructive',
      neutral: 'font-display-medium text-foreground',
      secondary: 'text-secondary-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: '',
      sm: 'font-sans-semibold text-label-m',
      lg: '',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
