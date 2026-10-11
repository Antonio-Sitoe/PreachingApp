import { cn } from '@/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role } from 'react-native';

/**
 * Escala tipográfica do Design 2.0 (canvas, artboard "Tipografia").
 * Títulos e rótulos pequenos em Red Hat Display, texto em Sen.
 *
 * | variant  | canvas     | letra                       |
 * | -------- | ---------- | --------------------------- |
 * | display  | Destaque   | Red Hat Display Bold 45/48  |
 * | titleXl  | Título XL  | Red Hat Display Bold 25/32  |
 * | titleL   | Título L   | Red Hat Display Bold 20/26  |
 * | titleM   | Título M   | Red Hat Display SemiBold 17/22 |
 * | titleS   | Título S   | Red Hat Display Medium 15/20 |
 * | bodyM    | Corpo M    | Sen 14/20 (por omissão)     |
 * | bodyS    | Corpo S    | Sen 12/16                   |
 * | labelM   | Rótulo M   | Sen SemiBold 13.5/16        |
 * | labelS   | Rótulo S   | Red Hat Display Medium 12/16 |
 * | button   | Botão      | Red Hat Display SemiBold 16/20 |
 */
const textVariants = cva(
  cn(
    'text-foreground',
    Platform.select({
      web: 'select-text',
    })
  ),
  {
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

        // Nomes do react-native-reusables, para os componentes instalados com o CLI
        // continuarem a funcionar. No código novo usa os nomes de cima.
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
  }
);

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

/** Classes de texto que um componente pai (por exemplo o Button) impõe aos filhos. */
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
