import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'title-xl',
        'title-l',
        'title-m',
        'title-s',
        'body-m',
        'body-s',
        'label-m',
        'label-s',
        'button',
      ],
      font: ['sans', 'sans-semibold', 'display', 'display-semibold', 'display-medium'],
      radius: ['sheet'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
