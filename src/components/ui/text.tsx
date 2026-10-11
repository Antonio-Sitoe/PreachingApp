import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Text as RNText, type Role } from 'react-native';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      display: 'font-display text-display',
      titleXl: 'font-display text-title-xl',
      titleL: 'font-display text-title-l',
      titleM: 'font-display-semibold text-title-m',
      titleS: 'font-display-medium text-title-s',
      bodyM: 'font-sans text-body-m',
      bodyS: 'font-sans text-body-s',
      labelM: 'font-sans-semibold text-label-m',
      labelS: 'font-display-medium text-label-s',
      button: 'font-display-semibold text-button',

      default: 'font-sans text-body-m',
      h1: 'font-display text-title-xl',
      h2: 'font-display text-title-l',
      h3: 'font-display-semibold text-title-m',
      h4: 'font-display-medium text-title-s',
      p: 'font-sans text-body-m',
      blockquote: 'border-l-2 border-border pl-3 font-sans text-body-m',
      code: 'rounded bg-muted px-1 py-0.5 font-mono text-body-s',
      lead: 'font-sans text-body-m text-muted-foreground',
      large: 'font-display-semibold text-title-m',
      small: 'font-sans-semibold text-label-m',
      muted: 'font-sans text-body-s text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'bodyM',
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  titleXl: 'heading',
  titleL: 'heading',
  titleM: 'heading',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  titleXl: '1',
  titleL: '2',
  titleM: '3',
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = React.ComponentProps<typeof RNText> &
  React.RefAttributes<typeof RNText> &
  TextVariantProps & {
    asChild?: boolean;
  };

function Text({ className, asChild = false, variant = 'bodyM', ...props }: TextProps) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot : RNText;
  return (
    <Component
      className={cn(textVariants({ variant }), textClass, className)}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
export type { TextProps, TextVariant };
