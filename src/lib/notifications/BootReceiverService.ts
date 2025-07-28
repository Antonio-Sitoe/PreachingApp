import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { notificationManager } from './weekly-notification';
import { availabilitiesAction } from '@/database/actions/student-availabilities';

export class BootReceiverService {
  private static instance: BootReceiverService;
  private isInitialized = false;

  public static getInstance(): BootReceiverService {
    if (!BootReceiverService.instance) {
      BootReceiverService.instance = new BootReceiverService();
    }
    return BootReceiverService.instance;
  }

  private constructor() {
    this.initializeBootReceiver();
  }

  private initializeBootReceiver(): void {
    if (this.isInitialized || Platform.OS !== 'android') {
      return;
    }

    console.log('🚀 Inicializando Boot Receiver Service...');

    // Listener para detectar quando o app é aberto após boot
    this.setupBootDetection();

    this.isInitialized = true;
    console.log('✅ Boot Receiver Service inicializado');
  }

  private setupBootDetection(): void {
    this.checkIfBootRecent().then((isRecentBoot) => {
      if (isRecentBoot) {
        console.log('📱 Detectado boot recente - restaurando notificações...');
        this.handleBootCompleted();
      }
    });
  }

  private async checkIfBootRecent(): Promise<boolean> {
    try {
      const scheduledNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      const dbNotifications = await availabilitiesAction.getAll();
      const activeDbNotifications = dbNotifications.filter((n) => n.isActive);

      // Se tem notificações no banco mas nenhuma agendada, provavelmente foi boot
      const hasDbNotifications = activeDbNotifications.length > 0;

      // Verificar se as notificações do sistema correspondem às do banco
      const systemNotificationIds = new Set(
        scheduledNotifications
          .map((n) => n.content.data?.notificationId)
          .filter(Boolean)
      );

      // Boot detectado se há notificações ativas no banco mas nenhuma correspondente no sistema
      const missingInSystem = activeDbNotifications.filter(
        (dbNotif) => !systemNotificationIds.has(dbNotif.id)
      );

      const possibleBoot = hasDbNotifications && missingInSystem.length > 0;

      console.log('🔍 Verificação de boot:', {
        dbActive: activeDbNotifications.length,
        systemScheduled: scheduledNotifications.length,
        missingInSystem: missingInSystem.length,
        possibleBoot,
      });

      return possibleBoot;
    } catch (error) {
      console.error('❌ Erro ao verificar boot recente:', error);
      return false;
    }
  }

  public async handleBootCompleted(): Promise<void> {
    try {
      console.log('🔄 Processando boot completed...');

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Permissões de notificação não concedidas');
        return;
      }

      try {
        await notificationManager.cleanupDuplicateNotifications();
      } catch (cleanupError) {
        console.warn('⚠️ Erro na limpeza de duplicatas:', cleanupError);
      }

      await notificationManager.syncWithSystem();

      console.log('✅ Boot Completed: Notificações sincronizadas');
    } catch (error) {
      console.error('❌ Erro ao processar boot completed:', error);
    }
  }

  public async testBootReceiver(): Promise<void> {
    console.log('🧪 Testando Boot Receiver...');
    await this.handleBootCompleted();
  }
}
