import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationConfig {
  title: string;
  body: string;
  hour: number;
  minute: number;
  sound: boolean;
  vibration: boolean;
  enabled: boolean;
}

export interface NotificationLog {
  timestamp: string;
  action: string;
  details: string;
  count?: number;
  nextNotification?: string;
  appVersion: string;
}

export interface SystemInfo {
  deviceName: string;
  osName: string;
  osVersion: string;
  appVersion: string;
}

export interface Analytics {
  totalSent: number;
  lastReceived: string | null;
  successRate: number;
  avgRescheduleTime: number;
  syncCount: number;
}

class MonthlyNotificationManager {
  private readonly STORAGE_KEYS = {
    LAST_SYNC: 'monthly-notifications-last-sync',
    CONFIG: 'monthly-notifications-config',
    LOGS: 'monthly-notifications-logs',
    ANALYTICS: 'monthly-notifications-analytics',
  };

  private readonly DEFAULT_CONFIG: NotificationConfig = {
    title: 'Relatório Mensal',
    body: 'Envie seu relatório do mês!',
    hour: 9,
    minute: 0,
    sound: true,
    vibration: true,
    enabled: true,
  };

  async initializeOnAppLaunch(): Promise<void> {
    try {
      const permissionStatus = await this.getPermissionStatus();
      if (permissionStatus !== Notifications.PermissionStatus.GRANTED) {
        console.log('❌ Permissões de notificação não concedidas');
        return;
      }
      await this.cancelAllMonthlyNotifications();
      await this.scheduleNext12Months();
      await this.persistLastSync();
      console.log(
        '✅ Sistema de notificações mensais inicializado com sucesso'
      );
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações mensais:', error);
    }
  }

  async cancelAllMonthlyNotifications(): Promise<void> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const monthlyNotifications = scheduledNotifications.filter(
        (notification) =>
          notification.identifier.startsWith('monthly-reminder-')
      );

      for (const notification of monthlyNotifications) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    } catch (error) {
      console.error('❌ Erro ao cancelar notificações:', error);
      throw error;
    }
  }

  async scheduleNext12Months(): Promise<void> {
    try {
      const config = await this.getConfig();
      if (!config.enabled) {
        console.log('⏸️ Notificações mensais desabilitadas');
        return;
      }

      const dates = this.getNext12MonthlyDates();

      for (const date of dates) {
        const identifier = `monthly-reminder-${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`;

        await Notifications.scheduleNotificationAsync({
          identifier,
          content: {
            title: config.title,
            body: config.body,
            sound: config.sound ? 'default' : undefined,
            priority: 'high',
            data: { type: 'monthly-reminder' },
          },
          trigger: {
            date,
            type: Notifications.SchedulableTriggerInputTypes.DATE,
          },
        });
      }
    } catch (error) {
      console.error('❌ Erro ao agendar notificações:', error);
      throw error;
    }
  }
  private getNext12MonthlyDates(): Date[] {
    const dates: Date[] = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const config = this.DEFAULT_CONFIG;
      targetDate.setHours(config.hour, config.minute, 0, 0);
      dates.push(targetDate);
    }

    return dates;
  }

  private async persistLastSync(): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, timestamp);
    } catch (error) {
      console.error('❌ Erro ao persistir última sincronização:', error);
    }
  }

  async getPermissionStatus(): Promise<Notifications.PermissionStatus> {
    const { status } = await Notifications.getPermissionsAsync();
    return status as Notifications.PermissionStatus;
  }
  async requestPermissions(): Promise<Notifications.PermissionStatus> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status as Notifications.PermissionStatus;
  }
  async getLastSync(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('❌ Erro ao obter última sincronização:', error);
      return null;
    }
  }
  async getScheduledCount(): Promise<number> {
    try {
      const notifications = await this.getMonthlyNotifications();
      return notifications.length;
    } catch (error) {
      console.error('❌ Erro ao obter contagem de notificações:', error);
      return 0;
    }
  }

  async getNextNotification(): Promise<Date | null> {
    try {
      const notifications = await this.getMonthlyNotifications();
      if (notifications.length > 0) {
        // Ordenar notificações por data para pegar a próxima
        const sortedNotifications = notifications.sort((a, b) => {
          const triggerA = a.trigger as {
            date?: string | number | Date;
            value?: string | number | Date;
          } | null;
          const triggerB = b.trigger as {
            date?: string | number | Date;
            value?: string | number | Date;
          } | null;

          if (!triggerA || !triggerB) {
            return 0;
          }

          let dateA: Date | null = null;
          let dateB: Date | null = null;

          // Extrair data do trigger A
          if ('date' in triggerA && triggerA.date) {
            dateA = new Date(triggerA.date);
          } else if ('value' in triggerA && triggerA.value) {
            dateA = new Date(triggerA.value);
          }

          // Extrair data do trigger B
          if ('date' in triggerB && triggerB.date) {
            dateB = new Date(triggerB.date);
          } else if ('value' in triggerB && triggerB.value) {
            dateB = new Date(triggerB.value);
          }

          if (!dateA || !dateB) {
            return 0;
          }

          return dateA.getTime() - dateB.getTime();
        });

        const nextNotification = sortedNotifications[0];
        const trigger = nextNotification.trigger as {
          date?: string | number | Date;
          value?: string | number | Date;
        } | null;

        if (trigger) {
          let triggerDate: string | number | Date | null = null;

          if ('date' in trigger && trigger.date) {
            triggerDate = trigger.date;
          } else if ('value' in trigger && trigger.value) {
            triggerDate = trigger.value;
          }

          if (triggerDate) {
            return new Date(triggerDate);
          }
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Erro ao obter próxima notificação:', error);
      return null;
    }
  }

  async getMonthlyNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      const allNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      const monthlyNotifications = allNotifications.filter((notification) =>
        notification.identifier.startsWith('monthly-reminder-')
      );
      return monthlyNotifications;
    } catch (error) {
      console.error('❌ Erro ao obter notificações mensais:', error);
      return [];
    }
  }

  async getConfig(): Promise<NotificationConfig> {
    try {
      const config = await AsyncStorage.getItem(this.STORAGE_KEYS.CONFIG);
      return config
        ? { ...this.DEFAULT_CONFIG, ...JSON.parse(config) }
        : this.DEFAULT_CONFIG;
    } catch (error) {
      console.error('❌ Erro ao obter configuração:', error);
      return this.DEFAULT_CONFIG;
    }
  }

  async updateConfig(config: Partial<NotificationConfig>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      await AsyncStorage.setItem(
        this.STORAGE_KEYS.CONFIG,
        JSON.stringify(newConfig)
      );
    } catch (error) {
      console.error('❌ Erro ao atualizar configuração:', error);
      throw error;
    }
  }

  async getAnalytics(): Promise<Analytics> {
    try {
      const analytics = await AsyncStorage.getItem(this.STORAGE_KEYS.ANALYTICS);
      return analytics
        ? JSON.parse(analytics)
        : {
            totalSent: 0,
            lastReceived: null,
            successRate: 100,
            avgRescheduleTime: 0,
            syncCount: 0,
          };
    } catch (error) {
      console.error('❌ Erro ao obter analytics:', error);
      return {
        totalSent: 0,
        lastReceived: null,
        successRate: 100,
        avgRescheduleTime: 0,
        syncCount: 0,
      };
    }
  }

  async resetAnalytics(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEYS.ANALYTICS);
    } catch (error) {
      console.error('❌ Erro ao resetar analytics:', error);
    }
  }

  async forceReschedule(): Promise<void> {
    await this.initializeOnAppLaunch();
  }

  async testNotification(): Promise<void> {
    try {
      const config = await this.getConfig();

      await Notifications.scheduleNotificationAsync({
        identifier: 'test-notification',
        content: {
          title: config.title,
          body: config.body,
          sound: config.sound ? 'default' : undefined,
          priority: 'high',
          data: { type: 'test' },
        },
        trigger: {
          seconds: 5,
          repeats: false,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });

      console.log('🧪 Notificação de teste agendada');
    } catch (error) {
      console.error('❌ Erro ao agendar notificação de teste:', error);
      throw error;
    }
  }
}

export const monthlyReportNotificationManager =
  new MonthlyNotificationManager();

export default monthlyReportNotificationManager;
