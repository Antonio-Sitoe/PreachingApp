package expo.modules.editorv3.blocks

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.LocalMinimumInteractiveComponentSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mohamedrejeb.richeditor.ui.BasicRichTextEditor
import expo.modules.editorv3.EditorColors
import expo.modules.editorv3.EditorController
import expo.modules.editorv3.model.BlockState
import expo.modules.editorv3.model.BlockType

/** Título, parágrafo e checklist: os três são um RichTextEditor, só muda o estilo e o checkbox. */
@Composable
fun RichBlock(
  block: BlockState,
  controller: EditorController,
  colors: EditorColors,
  editable: Boolean,
  placeholder: String,
  modifier: Modifier = Modifier,
) {
  val state = block.rich
  val focused = controller.focusedId == block.id
  val textStyle = blockTextStyle(block, colors)

  LaunchedEffect(state, colors) {
    state.config.linkColor = colors.primary
    state.config.codeSpanColor = colors.foreground
    state.config.codeSpanBackgroundColor = colors.surface
    state.config.codeSpanStrokeColor = colors.border
  }

  Row(modifier = modifier.fillMaxWidth(), verticalAlignment = Alignment.Top) {
    if (block.type == BlockType.CHECKLIST) {
      CompositionLocalProvider(LocalMinimumInteractiveComponentSize provides 0.dp) {
        Checkbox(
          checked = block.checked,
          onCheckedChange = { block.checked = it },
          enabled = editable,
          modifier = Modifier.padding(top = 4.dp, end = 8.dp),
          colors = CheckboxDefaults.colors(
            checkedColor = colors.primary,
            uncheckedColor = colors.muted,
            checkmarkColor = colors.card,
          ),
        )
      }
    }

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
      cursorBrush = SolidColor(colors.primary),
      decorationBox = { innerTextField ->
        Box(modifier = Modifier.padding(vertical = 4.dp)) {
          val showPlaceholder = block.isEmpty && (focused || controller.blocks.size == 1)
          if (showPlaceholder) {
            Text(
              text = placeholderFor(block.type, placeholder),
              style = textStyle.copy(color = colors.muted.copy(alpha = 0.6f), textDecoration = null),
            )
          }
          innerTextField()
        }
      },
    )
  }
}

private fun blockTextStyle(block: BlockState, colors: EditorColors): TextStyle =
  when (block.type) {
    BlockType.HEADING -> TextStyle(
      fontSize = 24.sp,
      lineHeight = 30.sp,
      fontWeight = FontWeight.Bold,
      color = colors.foreground,
    )
    BlockType.CHECKLIST -> TextStyle(
      fontSize = 16.sp,
      lineHeight = 24.sp,
      color = if (block.checked) colors.muted else colors.foreground,
      textDecoration = if (block.checked) TextDecoration.LineThrough else null,
    )
    else -> TextStyle(fontSize = 16.sp, lineHeight = 24.sp, color = colors.foreground)
  }

private fun placeholderFor(type: BlockType, paragraph: String): String =
  when (type) {
    BlockType.HEADING -> "Título"
    BlockType.CHECKLIST -> "Tarefa"
    else -> paragraph
  }
