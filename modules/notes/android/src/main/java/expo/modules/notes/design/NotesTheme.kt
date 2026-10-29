package expo.modules.notes.design

import android.content.res.AssetManager
import android.graphics.Typeface
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.LineHeightStyle
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.facebook.react.common.assets.ReactFontManager
import org.json.JSONObject

/**
 * Tokens do design system do PreachingApp (src/lib/theme.ts), vindos do JS como JSON
 * (`THEME[colorScheme]` + `backdrop`). Os nomes seguem os do tema.
 */
@Immutable
data class DsColors(
  val background: Color,
  val foreground: Color,
  val card: Color,
  val primary: Color,
  val primaryForeground: Color,
  val primaryStrong: Color,
  val secondary: Color,
  val muted: Color,
  val mutedForeground: Color,
  val subtle: Color,
  val border: Color,
  val success: Color,
  val destructive: Color,
  val destructiveForeground: Color,
  val destructiveSoft: Color,
  val backdrop: Color,
  private val all: Map<String, Color>,
) {
  /** Cor e fundo de um estágio de estudante (`stageRevisit` / `stageRevisitSoft`…). */
  fun stage(stage: String?): Pair<Color, Color> {
    val key = "stage" + (stage ?: "contact").replaceFirstChar { it.uppercase() }
    return (all[key] ?: mutedForeground) to (all["${key}Soft"] ?: muted)
  }

  companion object {
    fun parse(json: String?): DsColors {
      val values = mutableMapOf<String, Color>()
      try {
        val obj = JSONObject(json?.takeIf { it.isNotBlank() } ?: "{}")
        obj.keys().forEach { key -> parseCssColor(obj.optString(key))?.let { values[key] = it } }
      } catch (_: Exception) {
      }
      fun c(key: String, fallback: Long) = values[key] ?: Color(fallback)
      return DsColors(
        background = c("background", 0xFFFAFAFA),
        foreground = c("foreground", 0xFF1E1E1E),
        card = c("card", 0xFFFFFFFF),
        primary = c("primary", 0xFF5D6CB2),
        primaryForeground = c("primaryForeground", 0xFFFFFFFF),
        primaryStrong = c("primaryStrong", 0xFF4A5385),
        secondary = c("secondary", 0xFFF2F5FF),
        muted = c("muted", 0xFFF1F2F5),
        mutedForeground = c("mutedForeground", 0xFF484C52),
        subtle = c("subtle", 0xFF6B7080),
        border = c("border", 0xFFE4E4E4),
        success = c("success", 0xFF17704A),
        destructive = c("destructive", 0xFFC7256B),
        destructiveForeground = c("destructiveForeground", 0xFFFFFFFF),
        destructiveSoft = c("destructiveSoft", 0xFFFFE5F0),
        backdrop = values["backdrop"] ?: Color(0x6610121C),
        all = values,
      )
    }
  }
}

/** `#RRGGBB`, `#AARRGGBB` ou `rgba(r, g, b, a)`. */
internal fun parseCssColor(value: String?): Color? {
  if (value.isNullOrBlank()) return null
  val rgba = Regex("""rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)""").matchEntire(value.trim())
  if (rgba != null) {
    val (r, g, b) = rgba.destructured
    val a = rgba.groupValues[4].ifBlank { "1" }
    return Color(r.toFloat() / 255f, g.toFloat() / 255f, b.toFloat() / 255f, a.toFloat())
  }
  return try {
    Color(android.graphics.Color.parseColor(value.trim()))
  } catch (_: IllegalArgumentException) {
    null
  }
}

/** As famílias do projeto (src/lib/fonts.ts), registadas pelo expo-font no ReactFontManager. */
@Immutable
data class DsFonts(
  val sans: FontFamily,
  val sansSemibold: FontFamily,
  val display: FontFamily,
  val displaySemibold: FontFamily,
  val displayMedium: FontFamily,
) {
  companion object {
    fun load(assets: AssetManager?): DsFonts {
      fun family(name: String): FontFamily = try {
        FontFamily(androidx.compose.ui.text.font.Typeface(ReactFontManager.getInstance().getTypeface(name, Typeface.NORMAL, assets)))
      } catch (_: Exception) {
        FontFamily.Default
      }
      return DsFonts(
        sans = family("Sen_400Regular"),
        sansSemibold = family("Sen_600SemiBold"),
        display = family("RedHatDisplay_700Bold"),
        displaySemibold = family("RedHatDisplay_600SemiBold"),
        displayMedium = family("RedHatDisplay_500Medium"),
      )
    }
  }
}

/** O tema completo que os componentes leem de [LocalDs]. */
@Immutable
data class Ds(val colors: DsColors, val fonts: DsFonts, val icons: AppIcons) {
  private fun style(family: FontFamily, size: TextUnit, lineHeight: TextUnit, color: Color = colors.foreground) =
    TextStyle(
      fontFamily = family,
      fontSize = size,
      lineHeight = lineHeight,
      color = color,
      // Como no RN: a altura de linha é distribuída por igual acima e abaixo do texto.
      lineHeightStyle = LineHeightStyle(LineHeightStyle.Alignment.Center, LineHeightStyle.Trim.None),
    )

  // Escala tipográfica (tailwind.config.js) e variantes de components/ui/text.tsx.
  val titleXl get() = style(fonts.display, 25.sp, 32.sp)
  val titleL get() = style(fonts.display, 20.sp, 26.sp)
  val titleM get() = style(fonts.displaySemibold, 17.sp, 22.sp)
  val titleS get() = style(fonts.displayMedium, 15.sp, 20.sp)
  val bodyM get() = style(fonts.sans, 14.sp, 20.sp)
  val bodyS get() = style(fonts.sans, 12.sp, 16.sp)
  val labelM get() = style(fonts.sansSemibold, 13.5.sp, 16.sp)
  val labelS get() = style(fonts.displayMedium, 12.sp, 16.sp)
  val button get() = style(fonts.displaySemibold, 16.sp, 20.sp)

  /** Tamanhos livres usados no editor antigo (ex.: `text-[13px] leading-[18px]`). */
  fun sans(size: Float, lineHeight: Float, color: Color = colors.foreground) = style(fonts.sans, size.sp, lineHeight.sp, color)
  fun display(size: Float, lineHeight: Float, color: Color = colors.foreground) = style(fonts.display, size.sp, lineHeight.sp, color)
  fun displayMedium(size: Float, lineHeight: Float, color: Color = colors.foreground) =
    style(fonts.displayMedium, size.sp, lineHeight.sp, color)
  fun displaySemibold(size: Float, lineHeight: Float, color: Color = colors.foreground) =
    style(fonts.displaySemibold, size.sp, lineHeight.sp, color)
}

/** `rounded-*` do tailwind.config.js (--radius = 10). */
object DsRadius {
  val lg = 10.dp
  val md = 8.dp
  val sm = 6.dp
  val sheet = 24.dp
}

val LocalDs = staticCompositionLocalOf<Ds> { error("Ds não definido") }

/** Ícones do projeto (APP_ICONS em components/ui/app-icon.tsx), já convertidos para vetores. */
@Immutable
class AppIcons(private val paths: Map<String, String>) {
  private val cache = mutableMapOf<Pair<String, Float>, ImageVector?>()

  fun vector(name: String, strokeWidth: Float): ImageVector? =
    cache.getOrPut(name to strokeWidth) { paths[name]?.let { buildIconVector(it, strokeWidth) } }

  companion object {
    fun parse(json: String?): AppIcons = try {
      val obj = JSONObject(json?.takeIf { it.isNotBlank() } ?: "{}")
      AppIcons(obj.keys().asSequence().associateWith { obj.optString(it) })
    } catch (_: Exception) {
      AppIcons(emptyMap())
    }
  }
}
