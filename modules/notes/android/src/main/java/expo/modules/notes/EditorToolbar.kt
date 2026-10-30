package expo.modules.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.notes.design.AppIcon
import expo.modules.notes.design.DsRadius
import expo.modules.notes.design.LocalDs
import expo.modules.notes.design.pressable
import expo.modules.notes.model.BlockType

private val BoldStyle = SpanStyle(fontWeight = FontWeight.Bold)
private val ItalicStyle = SpanStyle(fontStyle = FontStyle.Italic)
private val UnderlineStyle = SpanStyle(textDecoration = TextDecoration.Underline)
private val StrikeStyle = SpanStyle(textDecoration = TextDecoration.LineThrough)

@Composable
fun EditorToolbar(controller: EditorController, onInsert: () -> Unit) {
  val ds = LocalDs.current
  val block = controller.focused ?: return
  val rich = block.type.isRich
  val current = if (rich) block.rich.currentSpanStyle else SpanStyle()
  val decoration = current.textDecoration

  Column(modifier = Modifier.fillMaxWidth().background(ds.colors.card)) {
    Box(Modifier.fillMaxWidth().height(1.dp).background(ds.colors.border))
    Row(
      modifier = Modifier
        .fillMaxWidth()
        .horizontalScroll(rememberScrollState())
        .padding(start = 12.dp, end = 12.dp, top = 6.dp, bottom = 12.dp),
      horizontalArrangement = Arrangement.spacedBy(2.dp),
      verticalAlignment = Alignment.CenterVertically,
    ) {
      ToolButton("Inserir", onClick = onInsert) {
        Box(modifier = Modifier.size(32.dp).background(ds.colors.primary, CircleShape), contentAlignment = Alignment.Center) {
          AppIcon("plus", tint = ds.colors.primaryForeground, size = 18.dp, strokeWidth = 2.4f)
        }
      }
      ToolIcon("heading", "Título", block.type.isHeading) { controller.setType(block, BlockType.HEADING1) }
      ToolLetter("B", "Negrito", current.fontWeight == FontWeight.Bold, rich, TextStyle(fontFamily = ds.fonts.display)) {
        block.rich.toggleSpanStyle(BoldStyle)
      }
      ToolLetter(
        "I",
        "Itálico",
        current.fontStyle == FontStyle.Italic,
        rich,
        TextStyle(fontFamily = FontFamily.Serif, fontStyle = FontStyle.Italic, fontWeight = FontWeight.SemiBold),
      ) { block.rich.toggleSpanStyle(ItalicStyle) }
      ToolLetter(
        "U",
        "Sublinhado",
        decoration?.contains(TextDecoration.Underline) == true,
        rich,
        TextStyle(fontFamily = ds.fonts.displaySemibold, textDecoration = TextDecoration.Underline),
      ) { block.rich.toggleSpanStyle(UnderlineStyle) }
      ToolLetter(
        "S",
        "Riscado",
        decoration?.contains(TextDecoration.LineThrough) == true,
        rich,
        TextStyle(fontFamily = ds.fonts.displaySemibold, textDecoration = TextDecoration.LineThrough),
      ) { block.rich.toggleSpanStyle(StrikeStyle) }
      ToolIcon("bullet-list", "Lista", block.type == BlockType.BULLET) { controller.setType(block, BlockType.BULLET) }
      ToolIcon("task-list", "Lista de tarefas", block.type == BlockType.CHECKLIST) {
        controller.setType(block, BlockType.CHECKLIST)
      }
      ToolIcon("scripture", "Citação", block.type == BlockType.QUOTE) { controller.setType(block, BlockType.QUOTE) }
      ToolIcon("mention", "Mencionar estudante", false, enabled = rich) { controller.startMention() }
    }
  }
}

@Composable
private fun ToolButton(
  label: String,
  active: Boolean = false,
  enabled: Boolean = true,
  onClick: () -> Unit,
  content: @Composable () -> Unit,
) {
  val ds = LocalDs.current
  val shape = RoundedCornerShape(DsRadius.lg)
  Box(
    modifier = Modifier
      .size(44.dp)
      .alpha(if (enabled) 1f else 0.4f)
      .pressable(shape, ds.colors.secondary, if (active) ds.colors.secondary else Color.Transparent, enabled, onClick = onClick),
    contentAlignment = Alignment.Center,
  ) {
    content()
  }
}

@Composable
private fun ToolIcon(icon: String, label: String, active: Boolean, enabled: Boolean = true, onClick: () -> Unit) {
  val ds = LocalDs.current
  ToolButton(label, active, enabled, onClick) {
    AppIcon(icon, tint = if (active) ds.colors.primaryStrong else ds.colors.mutedForeground, size = 20.dp, contentDescription = label)
  }
}

@Composable
private fun ToolLetter(letter: String, label: String, active: Boolean, enabled: Boolean, style: TextStyle, onClick: () -> Unit) {
  val ds = LocalDs.current
  ToolButton(label, active, enabled, onClick) {
    Text(
      letter,
      style = style.copy(fontSize = 18.sp, lineHeight = 20.sp, color = if (active) ds.colors.primaryStrong else ds.colors.mutedForeground),
    )
  }
}
