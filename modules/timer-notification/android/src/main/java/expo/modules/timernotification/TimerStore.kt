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
import android.os.SystemClock
import android.text.format.DateUtils
import android.view.View
import android.widget.RemoteViews
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// Fonte de verdade em SharedPreferences, para a notificação pausar e terminar com a app fechada.
// O Chronometer do RemoteViews faz o tempo avançar sem nenhum serviço em segundo plano.
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
    val pausedAt: Long = 0L,
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
      pausedAt = prefs.getLong("pausedAt", 0L),
    )
  }

  private fun write(context: Context, state: State) {
    prefs(context).edit()
      .putString("status", state.status)
      .putLong("startedAt", state.startedAt)
      .putLong("resumedAt", state.resumedAt)
      .putLong("accumulatedMs", state.accumulatedMs)
      .putLong("pausedAt", state.pausedAt)
      .apply()
  }

  fun setOpenUrl(context: Context, url: String) {
    prefs(context).edit().putString("openUrl", url).apply()
  }

  @Synchronized
  fun setProgress(context: Context, label: String?, percent: Int) {
    val prefs = prefs(context)
    val clamped = percent.coerceIn(0, 100)
    if (prefs.getString("progressLabel", null) == label && prefs.getInt("progressPercent", 0) == clamped) return
    prefs.edit()
      .putString("progressLabel", label)
      .putInt("progressPercent", clamped)
      .apply()
    val current = read(context)
    if (current.status != "idle") show(context, current)
  }

  @Synchronized
  fun start(context: Context): State {
    val current = read(context)
    if (current.status != "idle") return current
    val now = System.currentTimeMillis()
    return State("running", now, now, 0L).also { write(context, it); show(context, it) }
  }

  @Synchronized
  fun pause(context: Context): State {
    val current = read(context)
    if (current.status != "running") return current
    val now = System.currentTimeMillis()
    return current.copy(status = "paused", accumulatedMs = current.elapsedMs(now), pausedAt = now)
      .also { write(context, it); show(context, it) }
  }

  @Synchronized
  fun resume(context: Context): State {
    val current = read(context)
    if (current.status != "paused") return current
    return current.copy(status = "running", resumedAt = System.currentTimeMillis())
      .also { write(context, it); show(context, it) }
  }

  @Synchronized
  fun finish(context: Context): Pair<Long, Long>? {
    val current = read(context)
    if (current.status == "idle") return null
    val session = current.startedAt to current.elapsedMs()
    reset(context)
    return session
  }

  // Sem JS a correr: a sessão fica à espera que o app a grave ao abrir.
  @Synchronized
  fun finishToPending(context: Context) {
    val (startedAt, elapsedMs) = finish(context) ?: return
    val prefs = prefs(context)
    val pending = JSONArray(prefs.getString("pending", "[]"))
    pending.put(JSONObject().put("startedAt", startedAt).put("elapsedMs", elapsedMs))
    prefs.edit().putString("pending", pending.toString()).apply()
  }

  @Synchronized
  fun takePending(context: Context): JSONArray {
    val prefs = prefs(context)
    val pending = JSONArray(prefs.getString("pending", "[]"))
    prefs.edit().remove("pending").apply()
    return pending
  }

  @Synchronized
  fun reset(context: Context) {
    write(context, State("idle", 0L, 0L, 0L))
    prefs(context).edit().remove("progressLabel").remove("progressPercent").apply()
    manager(context).cancel(NOTIFICATION_ID)
  }

  // O Android 14+ deixa dispensar notificações ongoing.
  @Synchronized
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

  // O mesmo formato do Chronometer, para o relógio não mudar de forma ao pausar.
  private fun clock(ms: Long): String = DateUtils.formatElapsedTime(ms / 1000)

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

  private fun timeOfDay(timestamp: Long): String =
    SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date(timestamp))

  // Sessões pausadas antes de existir `pausedAt` têm o valor 0.
  private fun pausedText(state: State): String =
    if (state.pausedAt > 0L) "Pausado às ${timeOfDay(state.pausedAt)}" else "Em pausa"

  private fun content(context: Context, layout: Int, state: State, body: String): RemoteViews {
    val running = state.status == "running"
    val elapsed = state.elapsedMs()
    return RemoteViews(context.packageName, layout).apply {
      setTextViewText(R.id.timer_body, body)
      setViewVisibility(R.id.timer_clock, if (running) View.VISIBLE else View.GONE)
      setViewVisibility(R.id.timer_paused_clock, if (running) View.GONE else View.VISIBLE)
      if (running) {
        setChronometer(R.id.timer_clock, SystemClock.elapsedRealtime() - elapsed, null, true)
      } else {
        setChronometer(R.id.timer_clock, SystemClock.elapsedRealtime(), null, false)
        setTextViewText(R.id.timer_paused_clock, "Em pausa · ${clock(elapsed)}")
      }
    }
  }

  private fun expanded(context: Context, state: State): RemoteViews {
    val running = state.status == "running"
    val body = if (running) {
      "A contar desde as ${timeOfDay(state.startedAt)}. Continua com o app fechado."
    } else {
      "${pausedText(state)}. Toca em Retomar para continuar a contar."
    }
    val prefs = prefs(context)
    val progressLabel = prefs.getString("progressLabel", null)

    return content(context, R.layout.timer_notification_expanded, state, body).apply {
      setViewVisibility(R.id.timer_progress_group, if (progressLabel == null) View.GONE else View.VISIBLE)
      if (progressLabel != null) {
        setProgressBar(R.id.timer_progress, 100, prefs.getInt("progressPercent", 0), false)
        setTextViewText(R.id.timer_progress_label, progressLabel)
      }
    }
  }

  private fun collapsed(context: Context, state: State): RemoteViews {
    val body = if (state.status == "running") {
      "A contar desde as ${timeOfDay(state.startedAt)}"
    } else {
      pausedText(state)
    }
    return content(context, R.layout.timer_notification_collapsed, state, body)
  }

  private fun action(context: Context, icon: Int, title: String, action: String, code: Int) =
    Notification.Action.Builder(
      Icon.createWithResource(context, icon), title, actionIntent(context, action, code)
    ).build()

  private fun toggleAction(context: Context, running: Boolean) = if (running) {
    action(context, R.drawable.timer_action_pause, "Pausar", ACTION_PAUSE, 1)
  } else {
    action(context, R.drawable.timer_action_resume, "Retomar", ACTION_RESUME, 2)
  }

  private fun show(context: Context, state: State) {
    ensureChannel(context)
    val running = state.status == "running"
    val accent = context.getColor(
      if (running) R.color.timer_notification_running else R.color.timer_notification_paused
    )

    val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Notification.Builder(context, CHANNEL_ID)
    } else {
      @Suppress("DEPRECATION") Notification.Builder(context)
    }

    builder
      .setSmallIcon(R.drawable.timer_notification_icon)
      .setColor(accent)
      .setSubText("Cronómetro")
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      // O Wear OS ignora as vistas personalizadas: só este relógio do sistema avança lá.
      .setShowWhen(running)
      .setUsesChronometer(running)
      .setWhen(System.currentTimeMillis() - state.elapsedMs())
      .setCategory(Notification.CATEGORY_STOPWATCH)
      .setVisibility(Notification.VISIBILITY_PUBLIC)
      .setContentIntent(openIntent(context))
      .setContentTitle(if (running) "Cronómetro a contar" else "Cronómetro em pausa · ${clock(state.elapsedMs())}")
      .setContentText(if (running) "Desde as ${timeOfDay(state.startedAt)}" else pausedText(state))
      .setStyle(Notification.DecoratedCustomViewStyle())
      .setCustomContentView(collapsed(context, state))
      .setCustomBigContentView(expanded(context, state))
      .addAction(toggleAction(context, running))
      .addAction(action(context, R.drawable.timer_action_finish, "Terminar", ACTION_FINISH, 3))

    manager(context).notify(NOTIFICATION_ID, builder.build())
  }
}
