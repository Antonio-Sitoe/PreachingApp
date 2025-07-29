package expo.modules.schedulenotifie

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.database.sqlite.SQLiteDatabase
import android.os.Build
import java.util.*

class BootReceiver : BroadcastReceiver() {
  
  override fun onReceive(context: Context, intent: Intent) {
    if (intent.action == Intent.ACTION_BOOT_COMPLETED || 
        intent.action == "android.intent.action.QUICKBOOT_POWERON") {
      
      android.util.Log.d("BootReceiver", "📱 Device booted - restoring notifications automatically")
      
      try {
        // Create notification channel first
        createNotificationChannel(context)
        
        // Restore all notifications from SQLite database
        restoreNotificationsFromDatabase(context)
        
      } catch (e: Exception) {
        android.util.Log.e("BootReceiver", "❌ Error restoring notifications: ${e.message}")
      }
    }
  }
  
  private fun createNotificationChannel(context: Context) {
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
      
      android.util.Log.d("BootReceiver", "✅ Notification channel created")
    }
  }
  
  private fun restoreNotificationsFromDatabase(context: Context) {
    try {
      // Path to the SQLite database used by Drizzle
      // Expo SQLite stores databases in: /data/data/{package}/databases/
      val dbPath = context.getDatabasePath("preachingDB.sqlite").absolutePath
      
      android.util.Log.d("BootReceiver", "🔍 Looking for database at: $dbPath")
      
      val db = SQLiteDatabase.openDatabase(dbPath, null, SQLiteDatabase.OPEN_READONLY)
      
      // Query student_availabilities table (same table used by Drizzle)
      val cursor = db.rawQuery(
        "SELECT id, studentId, weekday, hour, minute, title, body, isActive FROM student_availabilities WHERE isActive = 1",
        null
      )
      
      val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
      var restoredCount = 0
      
      if (cursor.moveToFirst()) {
        do {
          try {
            val id = cursor.getString(cursor.getColumnIndexOrThrow("id"))
            val studentId = cursor.getString(cursor.getColumnIndexOrThrow("studentId"))
            val weekday = cursor.getInt(cursor.getColumnIndexOrThrow("weekday"))
            val hour = cursor.getInt(cursor.getColumnIndexOrThrow("hour"))
            val minute = cursor.getInt(cursor.getColumnIndexOrThrow("minute"))
            val title = cursor.getString(cursor.getColumnIndexOrThrow("title"))
            val body = cursor.getString(cursor.getColumnIndexOrThrow("body"))
            
            // Calculate next trigger time
            val calendar = Calendar.getInstance().apply {
              set(Calendar.DAY_OF_WEEK, weekday)
              set(Calendar.HOUR_OF_DAY, hour)
              set(Calendar.MINUTE, minute)
              set(Calendar.SECOND, 0)
              set(Calendar.MILLISECOND, 0)
              
              // If the time has passed this week, schedule for next week
              if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.WEEK_OF_YEAR, 1)
              }
            }
            
            // Create intent for notification
            val notificationIntent = Intent(context, NotificationReceiver::class.java).apply {
              putExtra("notification_id", id)
              putExtra("student_id", studentId)
              putExtra("student_name", "Estudante") // We don't store student name in availabilities
              putExtra("title", title)
              putExtra("body", body)
            }
            
            val pendingIntent = PendingIntent.getBroadcast(
              context,
              id.hashCode(),
              notificationIntent,
              PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            
            // Schedule repeating alarm
            alarmManager.setRepeating(
              AlarmManager.RTC_WAKEUP,
              calendar.timeInMillis,
              AlarmManager.INTERVAL_DAY * 7, // Weekly
              pendingIntent
            )
            
            restoredCount++
            android.util.Log.d("BootReceiver", "✅ Restored notification: $id")
            
          } catch (e: Exception) {
            android.util.Log.e("BootReceiver", "❌ Error restoring individual notification: ${e.message}")
          }
          
        } while (cursor.moveToNext())
      }
      
      cursor.close()
      db.close()
      
      android.util.Log.d("BootReceiver", "🎉 Successfully restored $restoredCount notifications after boot!")
      
    } catch (e: Exception) {
      android.util.Log.e("BootReceiver", "❌ Error accessing database: ${e.message}")
      
      // If direct database access fails, we could try alternative approaches
      // like using SharedPreferences as backup
    }
  }
} 