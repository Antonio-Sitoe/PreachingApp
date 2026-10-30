package expo.modules.notes.blocks

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import com.mohamedrejeb.richeditor.ui.BasicRichTextEditor
import expo.modules.notes.EditorController
import expo.modules.notes.design.Ds
import expo.modules.notes.design.LocalDs
import expo.modules.notes.model.BlockState
import expo.modules.notes.model.BlockType
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop

/** Texto, títulos, listas, checklists e citações: todos são um RichTextEditor com outro estilo e marcador. */
@Composable
fun RichBlock(
  block: BlockState,
  controller: EditorController,
  editable: Boolean,
  placeholder: String,
  modifier: Modifier = Modifier,
) {
  val ds = LocalDs.current
  val state = block.rich
  val focused = controller.focusedId == block.id
  val textStyle = blockTextStyle(block, ds)

  LaunchedEffect(state, ds.colors) {
    state.config.linkColor = ds.colors.primaryStrong
    state.config.linkTextDecoration = TextDecoration.None
    state.config.codeSpanColor = ds.colors.foreground
    state.config.codeSpanBackgroundColor = ds.colors.muted
    state.config.codeSpanStrokeColor = ds.colors.border
  }

  // Atalhos Markdown ("# ", "- ", "[] ", "> ", "---") à medida que se escreve.
  LaunchedEffect(state) {
    snapshotFlow { state.annotatedString.text }
      .distinctUntilChanged()
      .drop(1)
      .collect { controller.applyShortcut(block) }
  }

  Row(
    modifier = modifier.fillMaxWidth().then(if (block.type == BlockType.QUOTE) quoteBar(ds.colors.primary) else Modifier),
    verticalAlignment = Alignment.Top,
  ) {
    BlockMarker(block, ds, editable)

    BasicRichTextEditor(
      state = state,
      modifier = Modifier
        .weight(1f)
        .focusRequester(block.focusRequester)
        .onFocusChanged { focusState ->
          if (focusState.isFocused) {
            controller.focusedId = block.id
          } else if (controller.focusedId == block.id) {
            controller.focusedId = null
          }
        }
        .onPreviewKeyEvent { event -> handleBlockKey(event, block, controller) },
      readOnly = !editable,
      textStyle = textStyle,
      // Com uma ação no teclado, o Enter não parte a linha: cria um bloco novo (ver split).
      keyboardOptions = KeyboardOptions(
        capitalization = KeyboardCapitalization.Sentences,
        imeAction = ImeAction.Next,
      ),
      keyboardActions = KeyboardActions(onNext = { controller.split(block) }),
      cursorBrush = SolidColor(ds.colors.primary),
      decorationBox = { innerTextField ->
        Box(modifier = Modifier.padding(vertical = verticalPadding(block.type))) {
          val showPlaceholder = block.isEmpty && (focused || controller.blocks.size == 1)
          if (showPlaceholder) {
            Text(
              text = placeholderFor(block.type, placeholder),
              style = textStyle.copy(color = ds.colors.subtle, textDecoration = null),
            )
          }
          innerTextField()
        }
      },
    )
  }
}

/** O que fica à esquerda do texto: a marca da lista ou a checkbox. */
@Composable
private fun BlockMarker(block: BlockState, ds: Ds, editable: Boolean) {
  when (block.type) {
    BlockType.BULLET -> Box(
      modifier = Modifier.width(22.dp).padding(top = 4.dp),
      contentAlignment = Alignment.TopCenter,
    ) {
      Text(text = "•", style = ds.sans(18f, 24f))
    }
    BlockType.CHECKLIST -> CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides 0.dp) {
      Checkbox(
        checked = block.checked,
        onCheckedChange = { block.checked = it },
        enabled = editable,
        modifier = Modifier.padding(top = 4.dp, end = 10.dp),
        colors = CheckboxDefaults.colors(
          checkedColor = ds.colors.primary,
          uncheckedColor = ds.colors.primary,
          checkmarkColor = ds.colors.primaryForeground,
        ),
      )
    }
    else -> Unit
  }
}

/** Barra vertical à esquerda da citação (no editor antigo: borda primary de 3, `gapWidth` 12). */
private fun quoteBar(color: Color): Modifier =
  Modifier
    .drawBehind {
      val width = 3.dp.toPx()
      drawRoundRect(
        color = color,
        topLeft = Offset(0f, 4.dp.toPx()),
        size = Size(width, size.height - 8.dp.toPx()),
        cornerRadius = CornerRadius(width / 2),
      )
    }
    .padding(start = 15.dp)

private fun verticalPadding(type: BlockType) = when (type) {
  BlockType.HEADING1 -> 10.dp
  BlockType.HEADING2 -> 8.dp
  BlockType.HEADING3 -> 6.dp
  else -> 4.dp
}

/** Corpo em Sen 15/24 (como no editor antigo) e títulos em Red Hat Display. */
private fun blockTextStyle(block: BlockState, ds: Ds): TextStyle =
  when (block.type) {
    BlockType.HEADING1 -> ds.display(25f, 32f)
    BlockType.HEADING2 -> ds.display(20f, 26f)
    BlockType.HEADING3 -> ds.displaySemibold(17f, 22f)
    BlockType.CHECKLIST -> ds.sans(15f, 24f, if (block.checked) ds.colors.subtle else ds.colors.foreground)
      .copy(textDecoration = if (block.checked) TextDecoration.LineThrough else null)
    BlockType.QUOTE -> ds.sans(15f, 24f, ds.colors.mutedForeground)
    else -> ds.sans(15f, 24f)
  }

private fun placeholderFor(type: BlockType, paragraph: String): String =
  when (type) {
    BlockType.HEADING1 -> "Título 1"
    BlockType.HEADING2 -> "Título 2"
    BlockType.HEADING3 -> "Título 3"
    BlockType.BULLET -> "Lista"
    BlockType.CHECKLIST -> "Tarefa"
    BlockType.QUOTE -> "Citação"
    else -> paragraph
  }
