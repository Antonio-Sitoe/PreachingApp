import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { create } from 'zustand';

export interface VisitNotification {
  id: string; // id da notificação agendada
  studentId: string;
  weekDay: string; // ex: 'Segunda-feira'
  hour: number;
  minute: number;
  title: string;
  body: string;
}

interface NotificationStore {
  notifications: VisitNotification[];
  addNotification: (n: VisitNotification) => void;
  removeNotification: (id: string) => void;
  setNotifications: (n: VisitNotification[]) => void;
}

export const useVisitNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (n) =>
    set((state) => ({ notifications: [...state.notifications, n] })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  setNotifications: (n) => set({ notifications: n }),
}));

// Utilitário para converter string de dia para número (0=Domingo, 1=Segunda...)
const weekDayToNumber: Record<string, number> = {
  Domingo: 0,
  'Segunda-feira': 1,
  'Terça-feira': 2,
  'Quarta-feira': 3,
  'Quinta-feira': 4,
  'Sexta-feira': 5,
  Sábado: 6,
};

// Solicita permissão para notificações (deve ser chamado no início do app)
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de notificação não concedida');
  }
}

// Agenda uma notificação semanal recorrente
export async function scheduleVisitNotification({
  studentId,
  weekDay,
  hour,
  minute,
  title,
  body,
}: Omit<VisitNotification, 'id'>): Promise<string> {
  const trigger = {
    weekday: weekDayToNumber[weekDay],
    hour,
    minute,
    repeats: true,
  };
  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger,
  });
  return id;
}

// Cancela uma notificação agendada
export async function cancelVisitNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// Atualiza uma notificação (cancela e agenda novamente)
export async function updateVisitNotification(
  oldId: string,
  data: Omit<VisitNotification, 'id'>
): Promise<string> {
  await cancelVisitNotification(oldId);
  return scheduleVisitNotification(data);
}

// Cancela todas as notificações de um estudante
export async function cancelAllNotificationsForStudent(studentId: string) {
  const store = useVisitNotificationStore.getState();
  const toCancel = store.notifications.filter((n) => n.studentId === studentId);
  await Promise.all(toCancel.map((n) => cancelVisitNotification(n.id)));
  useVisitNotificationStore.setState({
    notifications: store.notifications.filter((n) => n.studentId !== studentId),
  });
}

// Recupera todas as notificações agendadas (útil para debug ou sincronização)
export async function getAllScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}
