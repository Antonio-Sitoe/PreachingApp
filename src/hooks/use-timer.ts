import { queryKeys } from '@/constants/query-keys';
import { monthPlansActions, timeEntriesActions, usersActions } from '@/database/actions';
import { showToast } from '@/hooks/use-toast';
import { formatHours, formatMonthName } from '@/utils/hours/format';
import { isPioneer, monthHourGoal } from '@/utils/hours/profile';
import {
  cancelForgottenTimerReminder,
  scheduleForgottenTimerReminder,
} from '@/utils/notifications/timer-reminder';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { create } from 'zustand';
import {
  addTimerListener,
  discardTimer,
  elapsedMs,
  finishTimer,
  getTimerState,
  pauseTimer,
  refreshTimerNotification,
  resumeTimer,
  setTimerProgress,
  startTimer,
  takePendingSessions,
  type TimerSession,
  type TimerState,
} from '../../modules/timer-notification';

type TimerStore = {
  state: TimerState;
  setState: (state: TimerState) => void;
};

// Espelho do estado nativo; a verdade está no módulo timer-notification.
const useTimerStore = create<TimerStore>((set) => ({
  state: getTimerState(),
  setState: (state) => set({ state }),
}));

const sessionMinutes = (session: TimerSession) => Math.round(session.elapsedMs / 60000);

async function saveSession(session: TimerSession) {
  const minutes = sessionMinutes(session);
  if (minutes <= 0) return undefined;
  return timeEntriesActions.create({
    startedAt: new Date(session.startedAt).toISOString(),
    minutes,
    source: 'timer',
  });
}

const invalidateHours = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries.all });

// "Outubro: 28 h 30 de 30 h", só para quem tem meta de horas.
async function syncTimerProgress() {
  try {
    const today = dayjs();
    const [year, month] = [today.year(), today.month() + 1];
    const [user, plan, stats] = await Promise.all([
      usersActions.getCurrent(),
      monthPlansActions.getForMonth(year, month),
      timeEntriesActions.getMonthStats(year, month),
    ]);
    const goal = user && isPioneer(user.publisherType) ? monthHourGoal(user, plan) : null;
    if (!goal) {
      setTimerProgress(null, 0);
      return;
    }
    const minutes = stats.minutes + Math.floor(elapsedMs(getTimerState()) / 60_000);
    setTimerProgress(
      `${formatMonthName(year, month)}: ${formatHours(minutes)} de ${goal} h`,
      Math.min(100, (minutes / (goal * 60)) * 100)
    );
  } catch (error) {
    console.error('Error syncing timer progress:', error);
  }
}

async function syncTimer(queryClient: QueryClient) {
  const sessions = takePendingSessions();
  for (const session of sessions) await saveSession(session);
  if (sessions.length > 0) await invalidateHours(queryClient);

  const state = getTimerState();
  useTimerStore.getState().setState(state);
  if (state.status === 'idle') {
    await cancelForgottenTimerReminder();
    return;
  }
  refreshTimerNotification();
  await syncTimerProgress();
}

function useTimerSync(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    void syncTimer(queryClient);

    const appState = AppState.addEventListener('change', (next) => {
      if (next === 'active') void syncTimer(queryClient);
    });
    const native = addTimerListener(() => void syncTimer(queryClient));
    return () => {
      appState.remove();
      native.remove();
    };
  }, [enabled, queryClient]);
}

function useTimer() {
  const queryClient = useQueryClient();
  const { state, setState } = useTimerStore();

  const start = () => {
    const next = startTimer(Linking.createURL('/hours'));
    setState(next);
    void scheduleForgottenTimerReminder(elapsedMs(next));
    void syncTimerProgress();
  };

  const pause = () => {
    setState(pauseTimer());
    void cancelForgottenTimerReminder();
  };

  const resume = () => {
    const next = resumeTimer();
    setState(next);
    void scheduleForgottenTimerReminder(elapsedMs(next));
  };

  const finish = async () => {
    const session = finishTimer();
    setState(getTimerState());
    void cancelForgottenTimerReminder();
    if (!session) return;

    const entry = await saveSession(session);
    await invalidateHours(queryClient);
    if (!entry) {
      showToast({ message: 'Menos de um minuto: não entrou nas horas.' });
      return;
    }
    showToast({
      message: 'Tempo guardado nas horas do mês',
      action: {
        label: 'Desfazer',
        icon: 'undo',
        onPress: async () => {
          await timeEntriesActions.remove(entry.id);
          await invalidateHours(queryClient);
        },
      },
    });
  };

  const discard = () => {
    discardTimer();
    setState(getTimerState());
    void cancelForgottenTimerReminder();
  };

  return { state, start, pause, resume, finish, discard };
}

function useElapsed(state: TimerState) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setNow(Date.now());
    if (state.status !== 'running') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [state]);

  return elapsedMs(state, now);
}

export { useElapsed, useTimer, useTimerSync };
