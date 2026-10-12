package expo.modules.editorv3.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.editorv3.EditorColors
import expo.modules.editorv3.EditorController
import expo.modules.editorv3.model.BlockState

private val CodeShape = RoundedCornerShape(8.dp)

/** Bloco de código: texto simples monoespaçado. Aqui o Enter parte a linha dentro do bloco. */
@Composable
fun CodeBlock(
  block: BlockState,
  controller: EditorController,
  colors: EditorColors,
  editable: Boolean,
  modifier: Modifier = Modifier,
) {
  val textStyle = TextStyle(
    fontFamily = FontFamily.Monospace,
    fontSize = 14.sp,
    lineHeight = 20.sp,
    color = colors.foreground,
  )

  BasicTextField(
    value = block.code,
    onValueChange = { block.code = it },
    modifier = modifier
      .fillMaxWidth()
      .padding(vertical = 4.dp)
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
    keyboardOptions = KeyboardOptions(
      capitalization = KeyboardCapitalization.None,
      autoCorrectEnabled = false,
    ),
    cursorBrush = SolidColor(colors.primary),
    decorationBox = { innerTextField ->
      Box(
        modifier = Modifier
          .fillMaxWidth()
          .background(colors.surface, CodeShape)
          .border(1.dp, colors.border, CodeShape)
          .padding(12.dp),
      ) {
        if (block.isEmpty) {
          Text(text = "Código", style = textStyle.copy(color = colors.muted.copy(alpha = 0.6f)))
        }
        innerTextField()
      }
    },
  )
}
