package expo.modules.schedulenotifie

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise

class ScheduleNotifieModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context is null")

  override fun definition() = ModuleDefinition {
    Name("ScheduleNotifie")

    Events("onBootCompleted")

    OnCreate {
      // Criar canal de notificação quando módulo é inicializado
      createNotificationChannel()
    }

    AsyncFunction("forceRestoreNotifications") { promise: Promise ->
      try {
        // Dispara evento para JS restaurar notificações
        sendEvent("onBootCompleted", mapOf(
          "restoredCount" to 0,
          "message" to "Forçando restauração de notificações..."
        ))
        promise.resolve(0)
      } catch (e: Exception) {
        promise.reject("FORCE_RESTORE_ERROR", "Failed to force restore: ${e.message}", e)
      }
    }
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "weekly_reminder_persistent"
      val name = "Lembretes Semanais"
      val descriptionText = "Notificações de lembretes semanais persistentes"
      val importance = NotificationManager.IMPORTANCE_HIGH
      
      val channel = NotificationChannel(channelId, name, importance).apply {
        description = descriptionText
        enableVibration(true)
        vibrationPattern = longArrayOf(0, 250, 250, 250)
        setShowBadge(true)
      }
      
      val notificationManager: NotificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      notificationManager.createNotificationChannel(channel)
    }
  }
}
