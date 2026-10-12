package expo.modules.editorv3

import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.window.PopupProperties
import expo.modules.editorv3.model.BlockState
import expo.modules.editorv3.model.BlockType

internal val BlockType.glyph: String
  get() = when (this) {
    BlockType.HEADING -> "H"
    BlockType.PARAGRAPH -> "¶"
    BlockType.CHECKLIST -> "☑"
    BlockType.CODE -> "</>"
  }

/**
 * Menu "/": aparece quando o bloco com foco começa por "/" (sem espaços) e filtra os tipos pelo
 * que vem a seguir. Não rouba o foco, para se poder continuar a escrever o filtro.
 */
@Composable
fun SlashMenu(block: BlockState, controller: EditorController, colors: EditorColors) {
  val text = block.text
  val query = text
    .takeIf { controller.focusedId == block.id && it.startsWith("/") && it.length <= 16 && ' ' !in it }
    ?.drop(1)
  var dismissedFor by remember(block.id) { mutableStateOf<String?>(null) }

  val options = if (query == null) {
    emptyList()
  } else {
    BlockType.entries.filter { it.label.contains(query, ignoreCase = true) || it.value.contains(query, ignoreCase = true) }
  }

  DropdownMenu(
    expanded = options.isNotEmpty() && dismissedFor != text,
    onDismissRequest = { dismissedFor = text },
    properties = PopupProperties(focusable = false),
    containerColor = colors.card,
  ) {
    options.forEach { type ->
      DropdownMenuItem(
        text = { Text(type.label, color = colors.foreground) },
        leadingIcon = { Text(type.glyph, color = colors.muted, fontFamily = FontFamily.Monospace) },
        onClick = {
          block.clearText()
          block.convertTo(type)
          controller.pendingFocusId = block.id
        },
      )
    }
  }
}
