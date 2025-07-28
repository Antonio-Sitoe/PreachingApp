import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { v4 as uuid } from 'uuid';
import type { NewStudentAvailability } from '@/database/schemas/student-availabilities';
import { availabilitiesAction } from '@/database/actions/student-availabilities';
import { router } from 'expo-router';
import { NavigationDebouncer } from '@/utils/notification/navigation-debouncer';

type WeeklyNotificationParams = NewStudentAvailability & {
  name: string;
};

class WeeklyNotificationManager {
  private static _instance: WeeklyNotificationManager | null = null;

  private isListenerConfigured = false;
  private navigationDebouncer = new NavigationDebouncer();
  private responseSubscription?: Notifications.EventSubscription;

  private constructor() {
    this.initializeNotificationHandler();
  }

  public static getInstance(): WeeklyNotificationManager {
    if (!WeeklyNotificationManager._instance) {
      WeeklyNotificationManager._instance = new WeeklyNotificationManager();
    }
    return WeeklyNotificationManager._instance;
  }

  private initializeNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  public setupNotificationListener(): void {
    if (this.isListenerConfigured) {
      console.log('⚠️ Listener já configurado, ignorando...');
      return;
    }

    console.log('🔔 Configurando listener de notificações...');

    if (this.responseSubscription) {
      this.responseSubscription.remove();
    }

    this.responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('👆 Notificação clicada!', response);

        const { actionIdentifier, notification } = response;
        const notificationData = notification.request.content.data as any;

        console.log('📱 Dados da notificação:', notificationData);
        console.log('🎯 Action identifier:', actionIdentifier);

        if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          if (notificationData?.studentId) {
            console.log(
              '🚀 Tentando navegar para createVisit com studentId:',
              notificationData.studentId
            );

            if (!this.navigationDebouncer.canNavigate()) {
              return;
            }
            this.navigationDebouncer.startNavigation();
            this.navigateToCreateVisit(
              notificationData.studentId,
              notificationData.name || 'Estudante'
            );
          } else {
            console.warn(
              '⚠️ studentId não encontrado nos dados da notificação'
            );
          }
        }
      });

    this.isListenerConfigured = true;
    console.log('✅ Listener de notificações configurado com sucesso');
  }

  private navigateToCreateVisit(studentId: string, name: string): void {
    setTimeout(() => {
      try {
        router.replace({
          pathname: '/(drawer)/(tabs)/students/createVisit',
          params: {
            id: studentId,
            name,
          },
        });
        console.log('✅ Navegação executada com sucesso');
      } catch (navError) {
        console.error('❌ Erro na navegação:', navError);
      }
    }, 300);
  }

  public cleanup(): void {
    console.log('🧹 Limpando listeners de notificação...');

    if (this.responseSubscription) {
      this.responseSubscription.remove();
      this.responseSubscription = undefined;
    }

    this.isListenerConfigured = false;
    console.log('✅ Cleanup concluído');
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
          enableVibrate: true,
          enableLights: true,
          showBadge: true,
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
    name,
    isActive,
  }: WeeklyNotificationParams): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const notificationId = uuid();
      let systemId = '';

      if (isActive) {
        systemId = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: 'default',
            categoryIdentifier: 'weekly_reminder',
            data: {
              studentId,
              action: 'create_visit',
              screen: 'createVisit',
              notificationId,
              name,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour,
            minute,
          },
        });
      }

      await availabilitiesAction.create({
        id: notificationId,
        weekday,
        hour,
        minute,
        title,
        body,
        isActive,
        studentId,
        systemId,
      });

      console.log(
        `✅ Notificação criada: ${notificationId} (Sistema: ${systemId})`
      );
      return notificationId;
    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error);
      return null;
    }
  }

  public async createTestNotification(studentId: string): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      const testId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧪 Teste de Notificação',
          body: 'Clique para testar navegação (DB only)',
          sound: 'default',
          data: {
            studentId,
            action: 'create_visit',
            screen: 'createVisit',
            isTest: true,
            name: 'Teste',
            notificationId: uuid(),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3,
        },
      });

      console.log('🧪 Notificação de teste criada:', testId);
      Alert.alert(
        'Teste (DB Only)',
        'Notificação será exibida em 3 segundos.\n\n✅ Usando apenas banco de dados!'
      );
    } catch (error) {
      console.error('Erro ao criar notificação de teste:', error);
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
      name,
    }: WeeklyNotificationParams
  ): Promise<boolean> {
    try {
      console.log('🔄 Atualizando notificação:', id);
      const existing = await availabilitiesAction.getById(id);
      if (!existing) {
        console.error('Notificação não encontrada no banco:', id);
        return false;
      }

      await this.cancelNotificationByData(id);

      const updatedData: NewStudentAvailability = {
        ...existing,
        weekday: weekday ?? existing.weekday,
        hour: hour ?? existing.hour,
        minute: minute ?? existing.minute,
        title: title ?? existing.title,
        body: body ?? existing.body,
        isActive: isActive ?? existing.isActive,
        studentId: studentId ?? existing.studentId,
      };

      let newSystemId = '';
      if (updatedData.isActive) {
        newSystemId = await Notifications.scheduleNotificationAsync({
          content: {
            title: updatedData.title,
            body: updatedData.body,
            sound: 'default',
            categoryIdentifier: 'weekly_reminder',
            data: {
              studentId: updatedData.studentId,
              action: 'create_visit',
              screen: 'createVisit',
              notificationId: id,
              name: name || 'Estudante',
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday: updatedData.weekday,
            hour: updatedData.hour,
            minute: updatedData.minute,
          },
        });
      }

      await availabilitiesAction.update(id, {
        weekday: updatedData.weekday,
        hour: updatedData.hour,
        minute: updatedData.minute,
        title: updatedData.title,
        body: updatedData.body,
        isActive: updatedData.isActive,
        studentId: updatedData.studentId,
        systemId: newSystemId,
      });

      console.log(`✅ Notificação atualizada: ${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      return false;
    }
  }

  public async deleteNotification(id: string): Promise<boolean> {
    try {
      await this.cancelNotificationByData(id);
      await availabilitiesAction.delete(id);
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
      console.log(
        '🗑️ Deletando todas as notificações do estudante:',
        studentId
      );

      const studentNotifications = await availabilitiesAction.getByStudentId(
        studentId
      );

      for (const notification of studentNotifications) {
        await this.cancelNotificationByData(notification.id);
      }

      await availabilitiesAction.deleteAllForStudent(studentId);

      console.log(
        `✅ ${studentNotifications.length} notificações removidas para o estudante ${studentId}`
      );
      return true;
    } catch (error) {
      console.error('Erro ao remover notificações do estudante:', error);
      return false;
    }
  }

  public async deleteAllNotifications(): Promise<boolean> {
    try {
      console.log('🗑️ Deletando todas as notificações...');
      await Notifications.cancelAllScheduledNotificationsAsync();
      await availabilitiesAction.clear();
      console.log('✅ Todas as notificações foram removidas');
      return true;
    } catch (error) {
      console.error('Erro ao remover todas as notificações:', error);
      return false;
    }
  }

  public async restoreNotificationsFromDatabase(): Promise<number> {
    try {
      console.log('🔄 Iniciando restauração de notificações do banco...');

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permissões não concedidas');
      }

      // Primeiro, obter notificações existentes no sistema para evitar duplicatas
      const existingNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const existingIds = new Set(
        existingNotifications
          .map((n) => n.content.data?.notificationId)
          .filter(Boolean)
      );

      const dbNotifications = await availabilitiesAction.getAll();
      let restoredCount = 0;

      for (const notification of dbNotifications) {
        if (notification.isActive && !existingIds.has(notification.id)) {
          try {
            const systemId = await Notifications.scheduleNotificationAsync({
              content: {
                title: notification.title,
                body: notification.body,
                sound: 'default',
                categoryIdentifier: 'weekly_reminder',
                data: {
                  studentId: notification.studentId,
                  action: 'create_visit',
                  screen: 'createVisit',
                  notificationId: notification.id,
                  name: 'Estudante',
                },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: notification.weekday,
                hour: notification.hour,
                minute: notification.minute,
              },
            });

            // Tentar atualizar systemId no banco com tratamento de erro
            try {
              await availabilitiesAction.update(notification.id!, {
                weekday: notification.weekday,
                hour: notification.hour,
                minute: notification.minute,
                title: notification.title,
                body: notification.body,
                isActive: notification.isActive,
                studentId: notification.studentId,
                systemId,
              });
            } catch (updateError) {
              console.warn(
                `⚠️ Não foi possível atualizar systemId para ${notification.id}:`,
                updateError
              );
              // Continuar mesmo se não conseguir atualizar o systemId
            }

            restoredCount++;
            console.log(
              `✅ Notificação restaurada: ${notification.id} -> ${systemId}`
            );
          } catch (error) {
            console.error(
              `❌ Erro ao restaurar notificação ${notification.id}:`,
              error
            );
          }
        } else if (notification.isActive && existingIds.has(notification.id)) {
          console.log(`⏭️ Notificação ${notification.id} já existe no sistema`);
        }
      }

      console.log(`✅ ${restoredCount} notificações restauradas com sucesso`);

      if (restoredCount > 0) {
        Alert.alert(
          'Notificações Restauradas',
          `${restoredCount} lembretes foram restaurados do banco de dados.`,
          [{ text: 'OK', style: 'default' }]
        );
      }

      return restoredCount;
    } catch (error) {
      console.error('Erro ao restaurar notificações:', error);
      return 0;
    }
  }

  private async cancelNotificationByData(
    notificationId: string
  ): Promise<void> {
    try {
      console.log('🔍 Procurando notificação para cancelar:', notificationId);

      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();

      const notificationToCancel = scheduledNotifications.find(
        (n) => n.content.data?.notificationId === notificationId
      );

      if (notificationToCancel) {
        await Notifications.cancelScheduledNotificationAsync(
          notificationToCancel.identifier
        );
        console.log(
          '✅ Notificação cancelada do sistema:',
          notificationToCancel.identifier
        );
      } else {
        console.log(
          '⚠️ Notificação não encontrada no sistema (pode já ter sido disparada)'
        );
      }
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }
}

export const notificationManager = WeeklyNotificationManager.getInstance();
