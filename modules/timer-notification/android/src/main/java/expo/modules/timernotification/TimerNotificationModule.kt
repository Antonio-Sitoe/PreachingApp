package expo.modules.timernotification

import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class TimerNotificationModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  private fun stateMap(state: TimerStore.State = TimerStore.read(context)) = mapOf(
    "status" to state.status,
    "startedAt" to state.startedAt.toDouble(),
    "resumedAt" to state.resumedAt.toDouble(),
    "accumulatedMs" to state.accumulatedMs.toDouble(),
  )

  override fun definition() = ModuleDefinition {
    Name("TimerNotification")

    Events("onChange")

    OnCreate {
      TimerStore.listener = { sendEvent("onChange", stateMap()) }
    }

    OnDestroy {
      TimerStore.listener = null
    }

    Function("getState") { stateMap() }

    Function("start") { url: String? ->
      if (url != null) TimerStore.setOpenUrl(context, url)
      stateMap(TimerStore.start(context))
    }

    Function("pause") { stateMap(TimerStore.pause(context)) }

    Function("resume") { stateMap(TimerStore.resume(context)) }

    Function("finish") {
      val session = TimerStore.finish(context) ?: return@Function null
      mapOf("startedAt" to session.first.toDouble(), "elapsedMs" to session.second.toDouble())
    }

    Function("discard") { TimerStore.reset(context) }

    Function("refresh") { TimerStore.refresh(context) }

    Function("canNotify") { TimerStore.canNotify(context) }

    Function("takePending") {
      val pending = TimerStore.takePending(context)
      (0 until pending.length()).map { index ->
        val item = pending.getJSONObject(index)
        mapOf(
          "startedAt" to item.getLong("startedAt").toDouble(),
          "elapsedMs" to item.getLong("elapsedMs").toDouble(),
        )
      }
    }
  }
}
