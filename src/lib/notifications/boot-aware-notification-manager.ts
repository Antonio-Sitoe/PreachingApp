import { notificationManager } from './weekly-notification';
import ScheduleNotifieModule from '@/../modules/schedule-notifie';
import { Platform } from 'react-native';

/**
 * Wrapper que adiciona detecção de boot ao weekly-notification.ts existente
 * Mantém 100% da funcionalidade original + restauração após boot
 */
export class BootAwareNotificationManager {
  private static _instance: BootAwareNotificationManager | null = null;
  private isBootListenerConfigured = false;

  private constructor() {
    this.setupBootListener();
  }

  public static getInstance(): BootAwareNotificationManager {
    if (!BootAwareNotificationManager._instance) {
      BootAwareNotificationManager._instance =
        new BootAwareNotificationManager();
    }
    return BootAwareNotificationManager._instance;
  }

  /**
   * Configura listener para detectar boot e restaurar notificações
   */
  private setupBootListener(): void {
    if (Platform.OS !== 'android' || this.isBootListenerConfigured) {
      return;
    }

    try {
      // Escuta evento de boot do módulo nativo
      ScheduleNotifieModule.addListener('onBootCompleted', (event) => {
        console.log('📱 Boot detectado pelo módulo nativo:', event);

        // Chama o método existente do weekly-notification.ts
        this.restoreNotificationsAfterBoot();
      });

      this.isBootListenerConfigured = true;
      console.log('✅ Boot listener configurado com sucesso');
    } catch (error) {
      console.warn('⚠️ Falha ao configurar boot listener:', error);
    }
  }

  /**
   * Restaura notificações após boot usando o método existente
   */
  private async restoreNotificationsAfterBoot(): Promise<void> {
    try {
      console.log('🔄 Restaurando notificações após boot...');

      // Usar o método que JÁ EXISTE e FUNCIONA no weekly-notification.ts
      const restoredCount =
        await notificationManager.restoreNotificationsFromDatabase();

      console.log(`✅ ${restoredCount} notificações restauradas após boot`);
    } catch (error) {
      console.error('❌ Erro ao restaurar notificações após boot:', error);
    }
  }

  /**
   * Restaura notificações manualmente (para teste)
   */
  public async forceRestoreNotifications(): Promise<number> {
    try {
      if (Platform.OS === 'android') {
        // Dispara evento via módulo nativo
        await ScheduleNotifieModule.forceRestoreNotifications();
      }

      // Também chama diretamente o método existente
      return await notificationManager.restoreNotificationsFromDatabase();
    } catch (error) {
      console.error('❌ Erro ao forçar restauração:', error);
      return 0;
    }
  }

  // ===== MÉTODOS QUE DELEGAM PARA O WEEKLY-NOTIFICATION.TS ORIGINAL =====

  public setupNotificationListener(): void {
    notificationManager.setupNotificationListener();
  }

  public cleanup(): void {
    notificationManager.cleanup();
  }

  public async createWeeklyNotification(params: any): Promise<string | null> {
    return notificationManager.createWeeklyNotification(params);
  }

  public async updateNotification(id: string, params: any): Promise<boolean> {
    return notificationManager.updateNotification(id, params);
  }

  public async deleteNotification(id: string): Promise<boolean> {
    return notificationManager.deleteNotification(id);
  }

  public async deleteAllNotificationsByStudentId(
    studentId: string
  ): Promise<boolean> {
    return notificationManager.deleteAllNotificationsByStudentId(studentId);
  }

  public async deleteAllNotifications(): Promise<boolean> {
    return notificationManager.deleteAllNotifications();
  }

  public async restoreNotificationsFromDatabase(): Promise<number> {
    return notificationManager.restoreNotificationsFromDatabase();
  }

  public async createTestNotification(studentId: string): Promise<void> {
    return notificationManager.createTestNotification(studentId);
  }

  public async requestPermissions(): Promise<boolean> {
    return notificationManager.requestPermissions();
  }
}

export const bootAwareNotificationManager =
  BootAwareNotificationManager.getInstance();
