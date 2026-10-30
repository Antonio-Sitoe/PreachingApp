package expo.modules.notes.design

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import kotlinx.coroutines.launch

/**
 * Como o `active:bg-*` do RN: sem ripple, o fundo muda enquanto se carrega.
 * [background] é o fundo normal; [pressed] o fundo enquanto se carrega.
 */
@Composable
fun Modifier.pressable(
  shape: Shape,
  pressed: Color,
  background: Color = Color.Transparent,
  enabled: Boolean = true,
  role: Role = Role.Button,
  onClick: () -> Unit,
): Modifier {
  val interaction = remember { MutableInteractionSource() }
  val isPressed by interaction.collectIsPressedAsState()
  return this
    .clip(shape)
    .background(if (isPressed && enabled) pressed else background, shape)
    .clickable(interactionSource = interaction, indication = null, enabled = enabled, role = role, onClick = onClick)
}

enum class ButtonVariant { Default, Outline, Ghost, Destructive, Secondary }

@Composable
fun DsButton(
  label: String,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  variant: ButtonVariant = ButtonVariant.Default,
  small: Boolean = false,
  enabled: Boolean = true,
) {
  val ds = LocalDs.current
  val c = ds.colors
  val shape = RoundedCornerShape(DsRadius.lg)
  val (background, pressed, text) = when (variant) {
    ButtonVariant.Default -> Triple(c.primary, c.primary.copy(alpha = 0.9f), c.primaryForeground)
    ButtonVariant.Outline -> Triple(Color.Transparent, c.secondary, c.primary)
    ButtonVariant.Ghost -> Triple(Color.Transparent, c.secondary, c.primary)
    ButtonVariant.Destructive -> Triple(Color.Transparent, c.destructiveSoft, c.destructive)
    ButtonVariant.Secondary -> Triple(c.secondary, c.secondary.copy(alpha = 0.8f), c.primaryStrong)
  }
  val border = when (variant) {
    ButtonVariant.Outline -> c.primary
    ButtonVariant.Destructive -> c.destructive
    else -> null
  }
  Box(
    modifier = modifier
      .alpha(if (enabled) 1f else 0.5f)
      .heightIn(min = if (small) 44.dp else 52.dp)
      .then(if (border != null) Modifier.border(1.dp, border, shape) else Modifier)
      .pressable(shape, pressed, background, enabled, onClick = onClick)
      .padding(horizontal = if (small) 12.dp else 20.dp, vertical = if (small) 8.dp else 12.dp),
    contentAlignment = Alignment.Center,
  ) {
    Text(label, style = ds.button.copy(color = text), maxLines = 1)
  }
}

@Composable
fun DsIconButton(
  icon: String,
  contentDescription: String,
  tint: Color,
  onClick: () -> Unit,
  modifier: Modifier = Modifier,
  size: Dp = 44.dp,
  iconSize: Dp = 24.dp,
  strokeWidth: Float = 2f,
  shape: Shape = CircleShape,
  pressed: Color = LocalDs.current.colors.muted,
  background: Color = Color.Transparent,
  enabled: Boolean = true,
) {
  Box(
    modifier = modifier
      .size(size)
      .alpha(if (enabled) 1f else 0.5f)
      .pressable(shape, pressed, background, enabled, onClick = onClick),
    contentAlignment = Alignment.Center,
  ) {
    AppIcon(icon, tint = tint, size = iconSize, strokeWidth = strokeWidth, contentDescription = contentDescription)
  }
}

@Composable
fun TagChip(label: String, active: Boolean, onClick: () -> Unit, modifier: Modifier = Modifier) {
  val ds = LocalDs.current
  val c = ds.colors
  Box(
    modifier = modifier
      .height(36.dp)
      .border(1.dp, if (active) c.primary else c.border, CircleShape)
      .pressable(CircleShape, c.secondary, if (active) c.secondary else c.card, onClick = onClick)
      .padding(horizontal = 14.dp),
    contentAlignment = Alignment.Center,
  ) {
    Text(
      label,
      style = if (active) ds.displaySemibold(13f, 18f, c.primaryStrong) else ds.displayMedium(13f, 18f),
      maxLines = 1,
    )
  }
}

fun initials(name: String): String {
  val words = name.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }
  if (words.isEmpty()) return ""
  val last = if (words.size > 1) words.last() else ""
  return (words.first().take(1) + last.take(1)).uppercase()
}

@Composable
fun StageInitials(name: String, stage: String?, size: Dp = 24.dp) {
  val ds = LocalDs.current
  val (text, background) = ds.colors.stage(stage)
  Box(modifier = Modifier.size(size).background(background, CircleShape), contentAlignment = Alignment.Center) {
    Text(initials(name), style = ds.display(if (size > 30.dp) 15f else 10f, if (size > 30.dp) 20f else 24f, text))
  }
}

@Composable
fun Avatar(name: String) {
  val ds = LocalDs.current
  Box(modifier = Modifier.size(40.dp).background(ds.colors.secondary, CircleShape), contentAlignment = Alignment.Center) {
    Text(initials(name), style = ds.titleS.copy(color = ds.colors.primaryStrong))
  }
}

@Composable
fun StageBadge(stage: String?, label: String) {
  val ds = LocalDs.current
  val (text, background) = ds.colors.stage(stage)
  Box(modifier = Modifier.background(background, CircleShape).padding(horizontal = 8.dp, vertical = 3.dp)) {
    Text(label, style = ds.labelS.copy(color = text))
  }
}

enum class Tone { Brand, Destructive, Success, Neutral }

@Composable
private fun toneColors(tone: Tone): Pair<Color, Color> {
  val c = LocalDs.current.colors
  return when (tone) {
    Tone.Brand -> c.secondary to c.primary
    Tone.Destructive -> c.destructiveSoft to c.destructive
    Tone.Success -> c.secondary to c.success
    Tone.Neutral -> c.muted to c.mutedForeground
  }
}

@Composable
fun SheetOption(icon: String, title: String, description: String?, onClick: () -> Unit, tone: Tone = Tone.Brand) {
  val ds = LocalDs.current
  val shape = RoundedCornerShape(DsRadius.lg)
  val (circle, iconColor) = toneColors(tone)
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .border(1.dp, ds.colors.border, shape)
      .pressable(shape, ds.colors.secondary, onClick = onClick)
      .padding(horizontal = 16.dp, vertical = 14.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(12.dp),
  ) {
    Box(modifier = Modifier.size(40.dp).background(circle, CircleShape), contentAlignment = Alignment.Center) {
      AppIcon(icon, tint = iconColor, size = 20.dp)
    }
    Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
      Text(title, style = ds.titleS)
      if (description != null) Text(description, style = ds.bodyS.copy(color = ds.colors.mutedForeground))
    }
    AppIcon("chevron-right", tint = ds.colors.subtle, size = 20.dp)
  }
}

/**
 * O conteúdo recebe `close`, que fecha com animação antes de chamar [onDismiss].
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DsBottomSheet(
  onDismiss: () -> Unit,
  title: String? = null,
  content: @Composable ColumnScope.(close: () -> Unit) -> Unit,
) {
  val ds = LocalDs.current
  val state = rememberModalBottomSheetState(skipPartiallyExpanded = true)
  val scope = rememberCoroutineScope()
  val close: () -> Unit = {
    scope.launch { state.hide() }.invokeOnCompletion { if (!state.isVisible) onDismiss() }
  }
  ModalBottomSheet(
    onDismissRequest = onDismiss,
    sheetState = state,
    shape = RoundedCornerShape(topStart = DsRadius.sheet, topEnd = DsRadius.sheet),
    containerColor = ds.colors.card,
    contentColor = ds.colors.foreground,
    tonalElevation = 0.dp,
    scrimColor = ds.colors.backdrop,
    dragHandle = {
      Box(
        modifier = Modifier
          .padding(top = 12.dp, bottom = 16.dp)
          .size(width = 36.dp, height = 4.dp)
          .background(ds.colors.border, CircleShape),
      )
    },
  ) {
    Column(
      modifier = Modifier
        .fillMaxWidth()
        .windowInsetsPadding(WindowInsets.navigationBars)
        .padding(start = 20.dp, end = 20.dp, bottom = 24.dp),
      verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
      if (title != null) Text(title, style = ds.titleL)
      content(close)
    }
  }
}

@Composable
fun DsAlertDialog(
  icon: String,
  title: String,
  description: String?,
  onDismiss: () -> Unit,
  tone: Tone = Tone.Destructive,
  actions: @Composable ColumnScope.() -> Unit,
) {
  val ds = LocalDs.current
  val (circle, iconColor) = toneColors(tone)
  Dialog(onDismissRequest = onDismiss) {
    Column(
      modifier = Modifier
        .widthIn(max = 420.dp)
        .fillMaxWidth()
        .background(ds.colors.card, RoundedCornerShape(DsRadius.lg))
        .padding(start = 22.dp, end = 22.dp, top = 32.dp, bottom = 24.dp),
      horizontalAlignment = Alignment.CenterHorizontally,
      verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
      Box(modifier = Modifier.size(56.dp).background(circle, CircleShape), contentAlignment = Alignment.Center) {
        AppIcon(icon, tint = iconColor, size = 28.dp)
      }
      Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(title, style = ds.titleM, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth())
        if (description != null) {
          Text(
            description,
            style = ds.bodyM.copy(color = ds.colors.mutedForeground),
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth(),
          )
        }
      }
      Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp), content = actions)
    }
  }
}

@Composable
fun DsTextField(
  value: String,
  onValueChange: (String) -> Unit,
  placeholder: String,
  modifier: Modifier = Modifier,
  maxLength: Int = Int.MAX_VALUE,
  autoFocus: Boolean = false,
  onDone: () -> Unit = {},
) {
  val ds = LocalDs.current
  val shape = RoundedCornerShape(DsRadius.lg)
  val style: TextStyle = ds.sans(14f, 20f)
  val focus = remember { FocusRequester() }
  if (autoFocus) LaunchedEffect(focus) { runCatching { focus.requestFocus() } }
  BasicTextField(
    value = value,
    onValueChange = { onValueChange(it.take(maxLength)) },
    singleLine = true,
    textStyle = style,
    cursorBrush = SolidColor(ds.colors.primary),
    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
    keyboardActions = KeyboardActions(onDone = { onDone() }),
    modifier = modifier
      .height(48.dp)
      .border(1.dp, ds.colors.border, shape)
      .background(ds.colors.card, shape)
      .focusRequester(focus),
    decorationBox = { inner ->
      Box(modifier = Modifier.padding(horizontal = 12.dp), contentAlignment = Alignment.CenterStart) {
        if (value.isEmpty()) Text(placeholder, style = style.copy(color = ds.colors.subtle))
        inner()
      }
    },
  )
}

@Composable
fun RowScope.EllipsizedText(text: String, style: TextStyle) {
  Text(text, style = style, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f, fill = false))
}

