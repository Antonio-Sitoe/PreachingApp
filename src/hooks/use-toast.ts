import type { AppIconName } from '@/components/ui/app-icon';
import { create } from 'zustand';

type ToastAction = {
  label: string;
  onPress: () => void;
  icon?: AppIconName;
};

type ToastOptions = {
  message: string;
  action?: ToastAction;
  duration?: number;
};

type ToastState = {
  current: (ToastOptions & { id: number }) | null;
  show: (options: ToastOptions) => void;
  hide: () => void;
};

let nextId = 0;

const useToastStore = create<ToastState>((set) => ({
  current: null,
  show: (options) => set({ current: { ...options, id: ++nextId } }),
  hide: () => set({ current: null }),
}));

function showToast(options: ToastOptions) {
  useToastStore.getState().show(options);
}

function hideToast() {
  useToastStore.getState().hide();
}

export { hideToast, showToast, useToastStore };
export type { ToastAction, ToastOptions };
