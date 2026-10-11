const { hairlineWidth } = require('nativewind/theme');

/** Cor ligada a uma variável de src/app/global.css, com suporte a opacidade. */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** Etapas da pessoa: `text-stage-revisit` sobre `bg-stage-revisit-soft`. */
const stages = ['contact', 'revisit', 'started', 'regular', 'publisher', 'baptized', 'paused'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: token('border'),
        input: token('input'),
        ring: token('ring'),
        background: token('background'),
        foreground: token('foreground'),
        subtle: token('subtle'),
        primary: {
          DEFAULT: token('primary'),
          foreground: token('primary-foreground'),
          strong: token('primary-strong'),
        },
        secondary: {
          DEFAULT: token('secondary'),
          foreground: token('secondary-foreground'),
        },
        destructive: {
          DEFAULT: token('destructive'),
          foreground: token('destructive-foreground'),
          soft: token('destructive-soft'),
        },
        warning: {
          DEFAULT: token('warning'),
          soft: token('warning-soft'),
        },
        success: {
          DEFAULT: token('success'),
          soft: token('success-soft'),
        },
        muted: {
          DEFAULT: token('muted'),
          foreground: token('muted-foreground'),
        },
        accent: {
          DEFAULT: token('accent'),
          foreground: token('accent-foreground'),
        },
        popover: {
          DEFAULT: token('popover'),
          foreground: token('popover-foreground'),
        },
        card: {
          DEFAULT: token('card'),
          foreground: token('card-foreground'),
        },
        toast: {
          DEFAULT: token('toast'),
          foreground: token('toast-foreground'),
          action: token('toast-action'),
        },
        stage: Object.fromEntries(
          stages.flatMap((stage) => [
            [stage, token(`stage-${stage}`)],
            [`${stage}-soft`, token(`stage-${stage}-soft`)],
          ])
        ),
        // Paleta do kit da marca. Só para material da marca, não para a interface.
        brand: {
          purple: '#6775B8',
          'purple-dark': '#4A5385',
          terracotta: '#C47A5D',
          sand: '#E8D9C5',
        },
      },
      // No React Native cada peso é uma família própria: não uses font-bold nem
      // font-semibold, escolhe a família certa. Os nomes vêm de src/lib/fonts.ts.
      fontFamily: {
        sans: ['Sen_400Regular'],
        'sans-semibold': ['Sen_600SemiBold'],
        display: ['RedHatDisplay_700Bold'],
        'display-semibold': ['RedHatDisplay_600SemiBold'],
        'display-medium': ['RedHatDisplay_500Medium'],
      },
      // Escala tipográfica do canvas: [tamanho, altura de linha].
      // Se acrescentares um nome aqui, regista-o também em src/lib/utils.ts.
      fontSize: {
        display: ['45px', '48px'],
        'title-xl': ['25px', '32px'],
        'title-l': ['20px', '26px'],
        'title-m': ['17px', '22px'],
        'title-s': ['15px', '20px'],
        'body-m': ['14px', '20px'],
        'body-s': ['12px', '16px'],
        'label-m': ['13.5px', '16px'],
        'label-s': ['12px', '16px'],
        button: ['16px', '20px'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        sheet: '24px',
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
