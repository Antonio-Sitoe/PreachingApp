package expo.modules.timernotification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.drawable.Icon
import android.net.Uri
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// Fonte de verdade em SharedPreferences, para a notificação pausar e terminar com a app fechada.
// setUsesChronometer faz o tempo avançar sem nenhum serviço em segundo plano.
object TimerStore {
  const val ACTION_PAUSE = "expo.modules.timernotification.PAUSE"
  const val ACTION_RESUME = "expo.modules.timernotification.RESUME"
  const val ACTION_FINISH = "expo.modules.timernotification.FINISH"

  private const val PREFS = "timer-notification"
  private const val CHANNEL_ID = "timer"
  private const val NOTIFICATION_ID = 4120

  var listener: (() -> Unit)? = null

  data class State(
    val status: String,
    val startedAt: Long,
    val resumedAt: Long,
    val accumulatedMs: Long,
  ) {
    fun elapsedMs(now: Long = System.currentTimeMillis()): Long =
      accumulatedMs + if (status == "running") now - resumedAt else 0L
  }

  private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

  fun read(context: Context): State {
    val prefs = prefs(context)
    return State(
      status = prefs.getString("status", "idle") ?: "idle",
      startedAt = prefs.getLong("startedAt", 0L),
      resumedAt = prefs.getLong("resumedAt", 0L),
      accumulatedMs = prefs.getLong("accumulatedMs", 0L),
    )
  }

  private fun write(context: Context, state: State) {
    prefs(context).edit()
      .putString("status", state.status)
      .putLong("startedAt", state.startedAt)
      .putLong("resumedAt", state.resumedAt)
      .putLong("accumulatedMs", state.accumulatedMs)
      .apply()
  }

  fun setOpenUrl(context: Context, url: String) {
    prefs(context).edit().putString("openUrl", url).apply()
  }

  fun start(context: Context): State {
    val current = read(context)
    if (current.status != "idle") return current
    val now = System.currentTimeMillis()
    return State("running", now, now, 0L).also { write(context, it); show(context, it) }
  }

  fun pause(context: Context): State {
    val current = read(context)
    if (current.status != "running") return current
    val now = System.currentTimeMillis()
    return current.copy(status = "paused", accumulatedMs = current.elapsedMs(now))
      .also { write(context, it); show(context, it) }
  }

  fun resume(context: Context): State {
    val current = read(context)
    if (current.status != "paused") return current
    return current.copy(status = "running", resumedAt = System.currentTimeMillis())
      .also { write(context, it); show(context, it) }
  }

  fun finish(context: Context): Pair<Long, Long>? {
    val current = read(context)
    if (current.status == "idle") return null
    val session = current.startedAt to current.elapsedMs()
    reset(context)
    return session
  }

  // Sem JS a correr: a sessão fica à espera que o app a grave ao abrir.
  fun finishToPending(context: Context) {
    val (startedAt, elapsedMs) = finish(context) ?: return
    val prefs = prefs(context)
    val pending = JSONArray(prefs.getString("pending", "[]"))
    pending.put(JSONObject().put("startedAt", startedAt).put("elapsedMs", elapsedMs))
    prefs.edit().putString("pending", pending.toString()).apply()
  }

  fun takePending(context: Context): JSONArray {
    val prefs = prefs(context)
    val pending = JSONArray(prefs.getString("pending", "[]"))
    prefs.edit().remove("pending").apply()
    return pending
  }

  fun reset(context: Context) {
    write(context, State("idle", 0L, 0L, 0L))
    manager(context).cancel(NOTIFICATION_ID)
  }

  // O Android 14+ deixa dispensar notificações ongoing.
  fun refresh(context: Context) {
    val current = read(context)
    if (current.status == "idle") manager(context).cancel(NOTIFICATION_ID) else show(context, current)
  }

  fun canNotify(context: Context): Boolean = manager(context).areNotificationsEnabled()

  private fun manager(context: Context) =
    context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

  private fun ensureChannel(context: Context) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val channel = NotificationChannel(CHANNEL_ID, "Cronómetro", NotificationManager.IMPORTANCE_LOW)
    channel.description = "Mostra o cronómetro enquanto conta"
    channel.setShowBadge(false)
    manager(context).createNotificationChannel(channel)
  }

  private fun clock(ms: Long): String {
    val seconds = ms / 1000
    return String.format(Locale.ROOT, "%02d:%02d:%02d", seconds / 3600, (seconds % 3600) / 60, seconds % 60)
  }

  private fun actionIntent(context: Context, action: String, code: Int): PendingIntent {
    val intent = Intent(context, TimerActionReceiver::class.java).setAction(action)
    return PendingIntent.getBroadcast(
      context, code, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )
  }

  private fun openIntent(context: Context): PendingIntent? {
    val url = prefs(context).getString("openUrl", null)
    val intent = if (url != null) {
      Intent(Intent.ACTION_VIEW, Uri.parse(url)).setPackage(context.packageName)
    } else {
      context.packageManager.getLaunchIntentForPackage(context.packageName)
    } ?: return null
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
    return PendingIntent.getActivity(
      context, 0, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )
  }

  private fun smallIcon(context: Context): Int {
    val id = context.resources.getIdentifier("notification_icon", "drawable", context.packageName)
    return if (id != 0) id else context.applicationInfo.icon
  }

  private fun action(context: Context, title: String, action: String, code: Int) =
    Notification.Action.Builder(Icon.createWithResource(context, smallIcon(context)), title, actionIntent(context, action, code)).build()

  private fun show(context: Context, state: State) {
    ensureChannel(context)
    val running = state.status == "running"
    val since = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date(state.startedAt))

    val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Notification.Builder(context, CHANNEL_ID)
    } else {
      @Suppress("DEPRECATION") Notification.Builder(context)
    }

    builder
      .setSmallIcon(smallIcon(context))
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setCategory(Notification.CATEGORY_STOPWATCH)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setContentIntent(openIntent(context))

    if (running) {
      builder
        .setContentTitle("Cronómetro a contar")
        .setContentText("Desde as $since. Continua com o app fechado.")
        .setShowWhen(true)
        .setUsesChronometer(true)
        .setWhen(System.currentTimeMillis() - state.elapsedMs())
        .addAction(action(context, "Pausar", ACTION_PAUSE, 1))
    } else {
      builder
        .setContentTitle("Cronómetro em pausa")
        .setContentText("Em pausa · ${clock(state.elapsedMs())}")
        .setShowWhen(false)
        .setUsesChronometer(false)
        .addAction(action(context, "Retomar", ACTION_RESUME, 2))
    }
    builder.addAction(action(context, "Terminar", ACTION_FINISH, 3))

    manager(context).notify(NOTIFICATION_ID, builder.build())
  }
}
