import { AppIcon, type AppIconName } from '@/components/ui/app-icon';
import { SHADOWS } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

/**
 * Botão só com ícone. Precisa sempre de `accessibilityLabel`, porque não tem texto.
 *
 * - `outline`: círculo de 44 px com contorno, como o "visto" do cartão de pessoa.
 * - `ghost`: 44 px sem fundo, para cabeçalhos (voltar, fechar).
 * - `fab`: botão de 58 px com sombra. Para o botão flutuante usa o `Fab` de '@/components/ui/fab'.
 */
const iconButtonVariants = cva(
  cn(
    'shrink-0 items-center justify-center rounded-full',
    Platform.select({
      web: 'outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    })
  ),
  {
    variants: {
      variant: {
        outline: cn(
          'size-11 border-[1.5px] border-border bg-transparent active:bg-secondary',
          Platform.select({ web: 'hover:bg-secondary' })
        ),
        ghost: cn(
          'size-11 bg-transparent active:bg-secondary',
          Platform.select({ web: 'hover:bg-secondary' })
        ),
        fab: cn(
          'size-[58px] bg-primary active:bg-primary/90',
          Platform.select({ web: 'hover:bg-primary/90' })
        ),
      },
    },
    defaultVariants: {
      variant: 'outline',
    },
  }
);

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
    /** Obrigatório: o que o botão faz, para leitores de ecrã. */
    accessibilityLabel: string;
    /** Classe do ícone, para mudar a cor. */
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
