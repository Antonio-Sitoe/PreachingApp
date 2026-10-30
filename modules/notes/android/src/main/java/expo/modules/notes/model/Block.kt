package expo.modules.notes.model

import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import com.mohamedrejeb.richeditor.model.RichTextState
import java.util.UUID

enum class BlockType(val value: String, val label: String, val icon: String) {
  PARAGRAPH("paragraph", "Texto", "edit"),
  HEADING1("heading1", "Título 1", "heading"),
  HEADING2("heading2", "Título 2", "heading"),
  HEADING3("heading3", "Título 3", "heading"),
  BULLET("bullet", "Lista", "bullet-list"),
  CHECKLIST("checklist", "Lista de tarefas", "task-list"),
  QUOTE("quote", "Citação", "scripture"),
  CODE("code", "Código", "code"),
  DIVIDER("divider", "Divisória", "notes");

  /** Blocos de texto formatado (RichTextState). O código é texto simples e a divisória não tem texto. */
  val isRich: Boolean get() = this != CODE && this != DIVIDER

  val isHeading: Boolean get() = this == HEADING1 || this == HEADING2 || this == HEADING3

  /** Enter cria outro bloco igual; Enter com o bloco vazio sai dele (como numa lista). */
  val continuesOnEnter: Boolean get() = this == BULLET || this == CHECKLIST || this == QUOTE

  companion object {
    fun from(value: String?): BlockType =
      if (value == "heading") HEADING1 else entries.firstOrNull { it.value == value } ?: PARAGRAPH
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
    get() = when {
      type.isRich -> rich.annotatedString.text
      type == BlockType.CODE -> code.text
      else -> ""
    }

  val isEmpty: Boolean get() = text.isEmpty()

  fun toMarkdown(): String = when {
    type.isRich -> rich.toMarkdown().trimEnd('\n')
    type == BlockType.CODE -> code.text
    else -> ""
  }

  fun convertTo(target: BlockType) {
    if (target == type) return
    if (type.isRich && target == BlockType.CODE) {
      val plain = rich.toText()
      code = TextFieldValue(plain, TextRange(plain.length))
    } else if (type == BlockType.CODE && target.isRich) {
      rich = RichTextState().setText(code.text)
    }
    if (target == BlockType.DIVIDER) clearText()
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
        code = if (type == BlockType.CODE) markdown else "",
      )
      if (type.isRich && markdown.isNotEmpty()) block.rich.setMarkdown(markdown)
      return block
    }
  }
}
