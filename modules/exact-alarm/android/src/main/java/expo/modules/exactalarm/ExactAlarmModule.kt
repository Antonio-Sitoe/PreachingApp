package expo.modules.exactalarm

import android.app.AlarmManager
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Alarmes exatos (Android 12+). O expo-notifications só usa setExactAndAllowWhileIdle
 * quando canScheduleExactAlarms() é verdadeiro; sem isso o sistema pode atrasar o alarme.
 */
class ExactAlarmModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("ExactAlarm")

    Function("canScheduleExactAlarms") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return@Function true
      context.getSystemService(AlarmManager::class.java).canScheduleExactAlarms()
    }

    // Abre "Alarmes e lembretes" desta app. Não há diálogo: o resultado lê-se ao voltar.
    Function("openExactAlarmSettings") {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return@Function null
      val intent = Intent(
        Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM,
        Uri.parse("package:${context.packageName}")
      ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
    }
  }
}
