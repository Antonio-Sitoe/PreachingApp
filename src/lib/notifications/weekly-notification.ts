import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import type { WeekDayEnum } from '@/@types/enums';
import { v4 as uuid } from 'uuid';
import type {
  NewStudentAvailability,
  StudentAvailability,
} from '@/database/schemas/student-availabilities';
import { availabilitiesAction } from '@/database/actions/student-availabilities';

type WeeklyNotificationData = NewStudentAvailability;

interface NotificationStorage {
  systemId: string;
  data: WeeklyNotificationData;
}

class WeeklyNotificationManager {
  private static readonly STORAGE_KEY = '@weekly_notifications';
  private notifications: Map<string, NotificationStorage> = new Map();

  constructor() {
    this.initializeNotificationHandler();
  }

  private initializeNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  public async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para notificações negada!');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('weekly_reminders', {
          name: 'Lembretes Semanais',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  public async createWeeklyNotification({
    studentId,
    weekday,
    hour,
    minute,
    title,
    body,
  }: NewStudentAvailability): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      if (!this.validateNotificationData(weekday, hour, minute, title, body)) {
        return null;
      }

      const notificationId = uuid();

      const systemId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          categoryIdentifier: 'weekly_reminder',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        },
      });

      const notificationData: WeeklyNotificationData = {
        id: notificationId,
        weekday,
        hour,
        minute,
        title,
        body,
        isActive: true,
        studentId,
      };

      const storageData: NotificationStorage = {
        systemId,
        data: notificationData,
      };

      await this.saveToStorage(notificationId, storageData);
      await availabilitiesAction.create(notificationData); // BASE DE DADOS
      console.log(
        `Notificação criada: ${notificationId} (Sistema: ${systemId})`
      );
      return notificationId;
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
      return null;
    }
  }

  public async getAllNotifications(): Promise<WeeklyNotificationData[]> {
    try {
      await this.loadFromStorage();
      return Array.from(this.notifications.values()).map((n) => n.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return [];
    }
  }

  public async getNotificationById(
    id: string
  ): Promise<WeeklyNotificationData | null> {
    try {
      await this.loadFromStorage();
      const notification = this.notifications.get(id);
      return notification ? notification.data : null;
    } catch (error) {
      console.error('Erro ao buscar notificação:', error);
      return null;
    }
  }

  public async updateNotification(
    id: string,
    {
      weekday,
      hour,
      minute,
      title,
      body,
      isActive,
      studentId,
    }: NewStudentAvailability
  ): Promise<boolean> {
    try {
      await this.loadFromStorage();
      const existing = this.notifications.get(id);

      if (!existing) {
        console.error('Notificação não encontrada:', id);
        return false;
      }

      await Notifications.cancelScheduledNotificationAsync(existing.systemId);

      const updatedData: WeeklyNotificationData = {
        ...existing.data,
        weekday: weekday ?? existing.data.weekday,
        hour: hour ?? existing.data.hour,
        minute: minute ?? existing.data.minute,
        title: title ?? existing.data.title,
        body: body ?? existing.data.body,
        isActive: isActive ?? existing.data.isActive,
        studentId: studentId ?? existing.data.studentId,
      };

      let newSystemId = '';
      if (updatedData.isActive) {
        newSystemId = await Notifications.scheduleNotificationAsync({
          content: {
            title: updatedData.title,
            body: updatedData.body,
            sound: 'default',
            categoryIdentifier: 'weekly_reminder',
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: updatedData.weekday,
            hour: updatedData.hour,
            minute: updatedData.minute,
          },
        });
      }

      const updatedStorage: NotificationStorage = {
        systemId: newSystemId,
        data: updatedData,
      };

      await this.saveToStorage(id, updatedStorage);
      await availabilitiesAction.update(id, updatedData);
      console.log(`Notificação atualizada: ${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      return false;
    }
  }

  public async deleteNotification(id: string): Promise<boolean> {
    try {
      console.log('Deletando notificação:', id);
      await this.loadFromStorage();
      const notification = this.notifications.get(id);

      if (!notification) {
        console.error('Notificação não encontrada:', id);
        return false;
      }

      await Notifications.cancelScheduledNotificationAsync(
        notification.systemId
      );

      this.notifications.delete(id);
      await this.saveAllToStorage();

      await availabilitiesAction.delete(id);

      console.log(`Notificação removida: ${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao remover notificação:', error);
      return false;
    }
  }

  public async deleteAllNotificationsByStudentId(
    studentId: string
  ): Promise<boolean> {
    try {
      const studentNotifications = await availabilitiesAction.getByStudentId(
        studentId
      );

      for (const notification of studentNotifications) {
        await this.loadFromStorage();
        const storageNotification = this.notifications.get(notification.id);
        if (storageNotification) {
          await Notifications.cancelScheduledNotificationAsync(
            storageNotification.systemId
          );
          this.notifications.delete(notification.id);
        }
      }

      await this.saveAllToStorage();
      await availabilitiesAction.deleteAllForStudent(studentId);

      return true;
    } catch (error) {
      console.error('Erro ao remover notificações do estudante:', error);
      return false;
    }
  }

  public async cleanupStudentNotifications(studentId: string): Promise<void> {
    try {
      console.log(
        `Limpando notificações do estudante ${studentId} do AsyncStorage...`
      );

      await this.loadFromStorage();
      let cleanedCount = 0;

      for (const [id, notification] of this.notifications.entries()) {
        if (notification.data.studentId === studentId) {
          await Notifications.cancelScheduledNotificationAsync(
            notification.systemId
          );
          this.notifications.delete(id);
          cleanedCount++;
        }
      }

      // Salvar o AsyncStorage atualizado
      await this.saveAllToStorage();

      console.log(
        `${cleanedCount} notificações limpas do AsyncStorage para o estudante ${studentId}`
      );
    } catch (error) {
      console.error('Erro ao limpar notificações do AsyncStorage:', error);
    }
  }

  public async deleteAllNotifications(): Promise<boolean> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      this.notifications.clear();
      await AsyncStorage.removeItem(WeeklyNotificationManager.STORAGE_KEY);
      await availabilitiesAction.clear();
      console.log('Todas as notificações foram removidas');
      return true;
    } catch (error) {
      console.error('Erro ao remover todas as notificações:', error);
      return false;
    }
  }

  public async restoreNotificationsFromDatabase(): Promise<number> {
    try {
      console.log('Iniciando restauração de notificações...');
      const dbNotifications = await this.loadFromDatabase();
      let restoredCount = 0;
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permissões não concedidas');
      }

      for (const notification of dbNotifications) {
        if (notification.isActive) {
          try {
            const systemId = await Notifications.scheduleNotificationAsync({
              content: {
                title: notification.title,
                body: notification.body,
                sound: 'default',
                categoryIdentifier: 'weekly_reminder',
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: notification.weekday,
                hour: notification.hour,
                minute: notification.minute,
              },
            });

            const storageData: NotificationStorage = {
              systemId,
              data: notification,
            };

            await this.saveToStorage(notification?.id!, storageData);
            restoredCount++;

            console.log(`Notificação restaurada: ${notification.id}`);
          } catch (error) {
            console.error(
              `Erro ao restaurar notificação ${notification.id}:`,
              error
            );
          }
        }
      }

      console.log(`${restoredCount} notificações restauradas com sucesso`);

      // Mostrar alerta ao usuário
      if (restoredCount > 0) {
        Alert.alert(
          'Notificações Restauradas',
          `${restoredCount} lembretes foram restaurados automaticamente.`,
          [{ text: 'OK', style: 'default' }]
        );
      }

      return restoredCount;
    } catch (error) {
      console.error('Erro ao restaurar notificações:', error);
      return 0;
    }
  }

  public async syncWithSystem(): Promise<void> {
    try {
      const systemNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const systemIds = new Set(systemNotifications.map((n) => n.identifier));

      await this.loadFromStorage();

      // Verificar notificações órfãs (no storage mas não no sistema)
      for (const [id, notification] of this.notifications.entries()) {
        if (
          notification.data.isActive &&
          !systemIds.has(notification.systemId)
        ) {
          console.log(`Reagendando notificação órfã: ${id}`);
          await this.updateNotification(id, {
            ...notification.data,
            isActive: true,
            studentId: notification.data.studentId,
          });
        }
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }

  private validateNotificationData(
    weekday: number,
    hour: number,
    minute: number,
    title: string,
    body: string
  ): boolean {
    if (weekday < 1 || weekday > 7) {
      Alert.alert(
        'Erro',
        'Dia da semana deve ser entre 1 (Domingo) e 7 (Sábado)'
      );
      return false;
    }
    if (hour < 0 || hour > 23) {
      Alert.alert('Erro', 'Hora deve ser entre 0 e 23');
      return false;
    }
    if (minute < 0 || minute > 59) {
      Alert.alert('Erro', 'Minuto deve ser entre 0 e 59');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return false;
    }
    if (!body.trim()) {
      Alert.alert('Erro', 'Mensagem é obrigatória');
      return false;
    }
    return true;
  }
  private async loadFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(
        WeeklyNotificationManager.STORAGE_KEY
      );
      if (stored) {
        const data = JSON.parse(stored);
        this.notifications = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Erro ao carregar do AsyncStorage:', error);
    }
  }
  private async saveToStorage(
    id: string,
    data: NotificationStorage
  ): Promise<void> {
    this.notifications.set(id, data);
    await this.saveAllToStorage();
  }
  private async saveAllToStorage(): Promise<void> {
    try {
      const data = Object.fromEntries(this.notifications);
      await AsyncStorage.setItem(
        WeeklyNotificationManager.STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage:', error);
    }
  }
  private async loadFromDatabase(): Promise<WeeklyNotificationData[]> {
    try {
      const records = await availabilitiesAction.getAll();
      return records.map((record: StudentAvailability) => ({
        id: record.id,
        weekday: Number(record.weekday) as WeekDayEnum,
        hour: record.hour,
        minute: record.minute,
        title: record.title,
        body: record.body,
        isActive: record.isActive,
        studentId: record.studentId,
      }));
    } catch (error) {
      console.error('Erro ao carregar do banco:', error);
      return [];
    }
  }
}

export { WeeklyNotificationManager };
