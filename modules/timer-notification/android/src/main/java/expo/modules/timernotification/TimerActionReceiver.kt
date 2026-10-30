package expo.modules.timernotification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/** Botões da notificação. Funciona com a app fechada: só mexe no TimerStore. */
class TimerActionReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      TimerStore.ACTION_PAUSE -> TimerStore.pause(context)
      TimerStore.ACTION_RESUME -> TimerStore.resume(context)
      TimerStore.ACTION_FINISH -> TimerStore.finishToPending(context)
      else -> return
    }
    TimerStore.listener?.invoke()
  }
}
