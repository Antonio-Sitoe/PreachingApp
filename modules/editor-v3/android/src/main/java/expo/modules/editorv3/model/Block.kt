package expo.modules.editorv3.model

import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import com.mohamedrejeb.richeditor.model.RichTextState
import java.util.UUID

enum class BlockType(val value: String, val label: String) {
  HEADING("heading", "Título"),
  PARAGRAPH("paragraph", "Parágrafo"),
  CHECKLIST("checklist", "Checklist"),
  CODE("code", "Código");

  /** Os blocos de texto usam o RichTextState; o de código guarda texto simples. */
  val isRich: Boolean get() = this != CODE

  companion object {
    fun from(value: String?): BlockType = entries.firstOrNull { it.value == value } ?: PARAGRAPH
  }
}

/**
 * Um bloco do documento. O texto formatado vive no [rich] (Compose Rich Editor) e só é
 * convertido para Markdown quando o documento é gravado.
 */
@Stable
class BlockState(
  val id: String = UUID.randomUUID().toString(),
  type: BlockType = BlockType.PARAGRAPH,
  checked: Boolean = false,
  rich: RichTextState = RichTextState(),
  code: String = "",
) {
  var type by mutableStateOf(type)
  var checked by mutableStateOf(checked)
  var rich by mutableStateOf(rich)
  var code by mutableStateOf(TextFieldValue(code))
  val focusRequester = FocusRequester()

  val text: String
    get() = if (type.isRich) rich.annotatedString.text else code.text

  val isEmpty: Boolean get() = text.isEmpty()

  fun toMarkdown(): String = if (type.isRich) rich.toMarkdown().trimEnd('\n') else code.text

  fun convertTo(target: BlockType) {
    if (target == type) return
    if (type.isRich && !target.isRich) {
      val plain = rich.toText()
      code = TextFieldValue(plain, TextRange(plain.length))
    } else if (!type.isRich && target.isRich) {
      rich = RichTextState().setText(code.text)
    }
    if (target != BlockType.CHECKLIST) checked = false
    type = target
  }

  /** Apaga o texto (usado depois de escolher uma opção do menu "/"). */
  fun clearText() {
    if (type.isRich) rich.clear() else code = TextFieldValue("")
  }

  companion object {
    fun fromMarkdown(id: String?, type: BlockType, markdown: String, checked: Boolean): BlockState {
      val block = BlockState(
        id = id?.takeIf { it.isNotBlank() } ?: UUID.randomUUID().toString(),
        type = type,
        checked = checked,
        code = if (type.isRich) "" else markdown,
      )
      if (type.isRich && markdown.isNotEmpty()) block.rich.setMarkdown(markdown)
      return block
    }
  }
}
