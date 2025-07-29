package expo.modules.schedulenotifie

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class NotificationReceiver : BroadcastReceiver() {
  private val CHANNEL_ID = "weekly_reminder_persistent"
  
  override fun onReceive(context: Context, intent: Intent) {
    val notificationId = intent.getStringExtra("notification_id") ?: return
    val studentId = intent.getStringExtra("student_id") ?: return
    val studentName = intent.getStringExtra("student_name") ?: "Estudante"
    val title = intent.getStringExtra("title") ?: "Lembrete de Visita"
    val body = intent.getStringExtra("body") ?: "Hora da sua visita!"
    
    // Create intent to open the app when notification is tapped
    val tapIntent = Intent().apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
      // Set the main activity of the app
      setClassName(context, "${context.packageName}.MainActivity")
      putExtra("student_id", studentId)
      putExtra("student_name", studentName)
      putExtra("notification_action", "create_visit")
    }
    
    val tapPendingIntent = PendingIntent.getActivity(
      context,
      notificationId.hashCode(),
      tapIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    
    // Build the notification
    val notification = NotificationCompat.Builder(context, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(body)
      .setSmallIcon(android.R.drawable.ic_dialog_alert)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setAutoCancel(true)
      .setVibrate(longArrayOf(0, 250, 250, 250))
      .setDefaults(NotificationCompat.DEFAULT_LIGHTS)
      .setContentIntent(tapPendingIntent)
      .addAction(
        android.R.drawable.ic_input_add,
        "Adicionar Visita",
        tapPendingIntent
      )
      .build()
    
    // Show the notification
    val notificationManager = NotificationManagerCompat.from(context)
    try {
      notificationManager.notify(notificationId.hashCode(), notification)
      android.util.Log.d("NotificationReceiver", "✅ Notification displayed: $notificationId")
    } catch (e: Exception) {
      android.util.Log.e("NotificationReceiver", "❌ Failed to show notification: ${e.message}")
    }
  }
} 