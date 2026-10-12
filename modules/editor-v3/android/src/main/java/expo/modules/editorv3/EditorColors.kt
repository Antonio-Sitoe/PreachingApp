package expo.modules.editorv3

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color

/** Cores do tema da app (src/lib/theme.ts), vindas do JS como hexadecimal. */
@Immutable
data class EditorColors(
  val foreground: Color,
  val muted: Color,
  val primary: Color,
  val surface: Color,
  val card: Color,
  val border: Color,
  val destructive: Color,
)

internal fun parseColor(value: String?, fallback: Color): Color =
  try {
    if (value.isNullOrBlank()) fallback else Color(android.graphics.Color.parseColor(value))
  } catch (_: IllegalArgumentException) {
    fallback
  }
