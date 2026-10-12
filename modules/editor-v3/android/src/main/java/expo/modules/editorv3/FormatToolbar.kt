package expo.modules.editorv3

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.editorv3.model.BlockType

private val BoldStyle = SpanStyle(fontWeight = FontWeight.Bold)
private val ItalicStyle = SpanStyle(fontStyle = FontStyle.Italic)
private val UnderlineStyle = SpanStyle(textDecoration = TextDecoration.Underline)
private val StrikeStyle = SpanStyle(textDecoration = TextDecoration.LineThrough)

/** Barra acima do teclado: formatação do texto no bloco com foco e ações sobre o bloco. */
@Composable
fun FormatToolbar(controller: EditorController, colors: EditorColors) {
  val block = controller.focused ?: return
  val index = controller.blocks.indexOf(block)

  Column(modifier = Modifier.fillMaxWidth().background(colors.card)) {
    HorizontalDivider(color = colors.border)
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .horizontalScroll(rememberScrollState())
        .padding(horizontal = 8.dp, vertical = 6.dp),
      horizontalArrangement = Arrangement.spacedBy(4.dp),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      if (block.type.isRich) {
        val state = block.rich
        // O histórico é de cada bloco (um RichTextState por bloco), não do documento.
        ToolButton("↶", colors, enabled = state.history.canUndo) { state.history.undo() }
        ToolButton("↷", colors, enabled = state.history.canRedo) { state.history.redo() }
        ToolbarSeparator(colors)

        val current = state.currentSpanStyle
        val decoration = current.textDecoration
        ToolButton("B", colors, active = current.fontWeight == FontWeight.Bold, style = TextStyle(fontWeight = FontWeight.Bold)) {
          state.toggleSpanStyle(BoldStyle)
        }
        ToolButton("I", colors, active = current.fontStyle == FontStyle.Italic, style = TextStyle(fontStyle = FontStyle.Italic)) {
          state.toggleSpanStyle(ItalicStyle)
        }
        ToolButton(
          "U",
          colors,
          active = decoration?.contains(TextDecoration.Underline) == true,
          style = TextStyle(textDecoration = TextDecoration.Underline),
        ) {
          state.toggleSpanStyle(UnderlineStyle)
        }
        ToolButton(
          "S",
          colors,
          active = decoration?.contains(TextDecoration.LineThrough) == true,
          style = TextStyle(textDecoration = TextDecoration.LineThrough),
        ) {
          state.toggleSpanStyle(StrikeStyle)
        }
        ToolbarSeparator(colors)
      }

      listOf(BlockType.HEADING, BlockType.CHECKLIST, BlockType.CODE).forEach { type ->
        ToolButton(type.glyph, colors, active = block.type == type, style = TextStyle(fontFamily = FontFamily.Monospace)) {
          controller.setType(block, type)
        }
      }
      ToolbarSeparator(colors)

      ToolButton("↑", colors, enabled = index > 0) { controller.moveBy(block, -1) }
      ToolButton("↓", colors, enabled = index in 0 until controller.blocks.lastIndex) { controller.moveBy(block, 1) }
      ToolButton("✕", colors, tint = colors.destructive) { controller.remove(block) }
    }
  }
}

@Composable
private fun ToolButton(
  label: String,
  colors: EditorColors,
  active: Boolean = false,
  enabled: Boolean = true,
  tint: Color = colors.foreground,
  style: TextStyle = TextStyle.Default,
  onClick: () -> Unit,
) {
  val shape = RoundedCornerShape(8.dp)
  Box(
    modifier = Modifier
      .size(40.dp)
      .clip(shape)
      .background(if (active) colors.primary.copy(alpha = 0.14f) else Color.Transparent, shape)
      .clickable(enabled = enabled, onClick = onClick),
    contentAlignment = Alignment.Center,
  ) {
    Text(
      text = label,
      style = style.copy(
        fontSize = 16.sp,
        color = when {
          !enabled -> colors.muted.copy(alpha = 0.4f)
          active -> colors.primary
          else -> tint
        },
      ),
    )
  }
}

@Composable
private fun ToolbarSeparator(colors: EditorColors) {
  Box(
    modifier = Modifier
      .padding(horizontal = 4.dp)
      .width(1.dp)
      .height(24.dp)
      .background(colors.border),
  )
}
