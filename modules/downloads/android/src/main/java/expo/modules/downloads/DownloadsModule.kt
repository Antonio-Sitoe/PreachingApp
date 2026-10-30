package expo.modules.downloads

import android.content.ContentValues
import android.os.Build
import android.provider.MediaStore
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

/**
 * Grava um ficheiro em Transferências pelo MediaStore (Android 10+), sem permissão nem selector.
 * O selector de pastas (SAF) não deixa escolher a pasta Download inteira desde o Android 11.
 */
class DownloadsModule : Module() {
  private val context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  override fun definition() = ModuleDefinition {
    Name("Downloads")

    // Devolve o URI do ficheiro criado, ou null antes do Android 10.
    AsyncFunction("saveText") { name: String, mimeType: String, content: String ->
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return@AsyncFunction null

      val resolver = context.contentResolver
      val values = ContentValues().apply {
        put(MediaStore.Downloads.DISPLAY_NAME, name)
        put(MediaStore.Downloads.MIME_TYPE, mimeType)
        put(MediaStore.Downloads.IS_PENDING, 1)
      }
      val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
        ?: throw IllegalStateException("Não foi possível criar o ficheiro em Transferências")

      try {
        resolver.openOutputStream(uri)?.use { it.write(content.toByteArray(Charsets.UTF_8)) }
          ?: throw IllegalStateException("Não foi possível escrever o ficheiro")
        values.clear()
        values.put(MediaStore.Downloads.IS_PENDING, 0)
        resolver.update(uri, values, null, null)
      } catch (error: Exception) {
        resolver.delete(uri, null, null)
        throw error
      }
      uri.toString()
    }
  }
}
