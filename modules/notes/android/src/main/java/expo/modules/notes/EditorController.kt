package expo.modules.notes

import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import expo.modules.notes.model.BlockState
import expo.modules.notes.model.BlockType
import expo.modules.notes.model.DocumentCodec
import expo.modules.notes.model.Reference
import expo.modules.notes.model.ReferenceKind
import expo.modules.notes.model.TriggerQuery

/** Id usado em [EditorController.pendingFocusId] para pôr o cursor no título. */
internal const val TITLE_FOCUS_ID = "notes-title"

/** Atalhos Markdown no início de um parágrafo; os mais compridos primeiro (### antes de #). */
private val SHORTCUTS = listOf(
  "### " to BlockType.HEADING3,
  "## " to BlockType.HEADING2,
  "# " to BlockType.HEADING1,
  "- " to BlockType.BULLET,
  "* " to BlockType.BULLET,
  "[] " to BlockType.CHECKLIST,
  "[ ] " to BlockType.CHECKLIST,
  "> " to BlockType.QUOTE,
)

/** Estado do documento: o título, a lista de blocos, o bloco com foco e as operações entre blocos. */
@Stable
class EditorController(initial: List<BlockState>, initialTitle: String) {
  val blocks = mutableStateListOf<BlockState>().apply { addAll(initial) }

  var title by mutableStateOf(TextFieldValue(initialTitle))
  val titleFocusRequester = FocusRequester()

  /** Bloco (ou [TITLE_FOCUS_ID]) que tem o cursor. A toolbar e as sugestões trabalham sobre ele. */
  var focusedId: String?
    get() = focusedState
    set(value) {
      focusedState = value
      if (value != null && value != TITLE_FOCUS_ID) lastFocusedId = value
    }
  private var focusedState by mutableStateOf<String?>(null)

  /** Último bloco com foco: as folhas (ex.: Inserir) tiram o foco ao editor e voltam a ele. */
  var lastFocusedId: String? = null
    private set

  /** O bloco onde inserir a partir de uma folha: o último com foco, ou o último do documento. */
  val insertTarget: BlockState? get() = blocks.firstOrNull { it.id == lastFocusedId } ?: blocks.lastOrNull()

  /** Bloco (ou [TITLE_FOCUS_ID]) que deve receber o foco assim que estiver composto. */
  var pendingFocusId by mutableStateOf<String?>(null)

  val focused: BlockState? get() = blocks.firstOrNull { it.id == focusedId }

  fun encode(): String = DocumentCodec.encode(blocks)

  /** O título não tem quebras de linha: o Enter passa para o primeiro bloco. */
  fun changeTitle(value: TextFieldValue) {
    if ('\n' in value.text) {
      val clean = value.text.replace("\n", "")
      title = TextFieldValue(clean, TextRange(clean.length))
      focusFirstBlock()
    } else {
      title = value
    }
  }

  fun focusFirstBlock() {
    val first = blocks.firstOrNull { it.type != BlockType.DIVIDER }
    if (first == null) {
      insertAt(0, BlockState())
    } else {
      moveCursorTo(first, 0)
      pendingFocusId = first.id
    }
  }

  /**
   * Enter num bloco de texto: o que está depois do cursor passa para um bloco novo, com a
   * formatação. Listas, checklists e citações continuam; um título é seguido de texto.
   * Numa lista vazia, sai da lista (vira parágrafo), como no Notion.
   */
  fun split(block: BlockState) {
    if (!block.type.isRich) return
    if (block.type.continuesOnEnter && block.isEmpty) {
      block.convertTo(BlockType.PARAGRAPH)
      pendingFocusId = block.id
      return
    }

    val state = block.rich
    val length = state.annotatedString.text.length
    val cursor = state.selection.min.coerceIn(0, length)
    val tail = state.copy()
    if (cursor < length) state.removeTextRange(TextRange(cursor, length))
    if (cursor > 0) tail.removeTextRange(TextRange(0, cursor))
    tail.selection = TextRange(0)
    // Os cortes acima não são escrita: sem isto, desfazer repunha o texto que passou para o outro bloco.
    state.history.clear()
    tail.history.clear()

    val nextType = if (block.type.isHeading) BlockType.PARAGRAPH else block.type
    insertAfter(block, BlockState(type = nextType, rich = tail))
  }

  fun insertAfter(block: BlockState?, newBlock: BlockState = BlockState()): BlockState {
    val index = block?.let { blocks.indexOf(it) } ?: -1
    return insertAt(if (index < 0) blocks.size else index + 1, newBlock)
  }

  private fun insertAt(index: Int, newBlock: BlockState): BlockState {
    blocks.add(index.coerceIn(0, blocks.size), newBlock)
    pendingFocusId = newBlock.id
    return newBlock
  }

  /**
   * Backspace com o cursor no início do bloco:
   * - um bloco com tipo (título, lista, citação…) volta a parágrafo;
   * - um parágrafo vazio é apagado; com texto, junta-se ao bloco de cima;
   * - a seguir a uma divisória, apaga a divisória.
   * Devolve false quando o Backspace deve apagar texto normalmente.
   */
  fun backspace(block: BlockState): Boolean {
    if (block.type == BlockType.CODE) {
      if (!block.isEmpty) return false
      block.convertTo(BlockType.PARAGRAPH)
      pendingFocusId = block.id
      return true
    }
    if (!block.type.isRich) return false
    val selection = block.rich.selection
    if (!selection.collapsed || selection.start != 0) return false

    if (block.type != BlockType.PARAGRAPH) {
      block.convertTo(BlockType.PARAGRAPH)
      pendingFocusId = block.id
      return true
    }

    val index = blocks.indexOf(block)
    if (index <= 0) {
      // Primeiro bloco: um vazio é apagado (se houver mais) e o cursor sobe para o título.
      if (block.isEmpty && blocks.size > 1) blocks.removeAt(0)
      title = title.copy(selection = TextRange(title.text.length))
      pendingFocusId = TITLE_FOCUS_ID
      return true
    }

    val previous = blocks[index - 1]
    when {
      previous.type == BlockType.DIVIDER -> {
        blocks.removeAt(index - 1)
        pendingFocusId = block.id
      }
      block.isEmpty -> remove(block)
      previous.type.isRich -> merge(previous, block)
      else -> {
        // Para um bloco de código junta-se só o texto, sem formatação.
        val joinAt = previous.code.text.length
        previous.code = TextFieldValue(previous.code.text + block.text, TextRange(joinAt))
        blocks.remove(block)
        pendingFocusId = previous.id
      }
    }
    return true
  }

  /** Junta [block] ao fim de [previous], com a formatação, e põe o cursor na junção. */
  private fun merge(previous: BlockState, block: BlockState) {
    val joinAt = previous.rich.annotatedString.text.length
    val markdown = block.toMarkdown()
    if (markdown.isNotEmpty()) previous.rich.insertMarkdown(markdown, joinAt)
    previous.rich.selection = TextRange(joinAt)
    blocks.remove(block)
    pendingFocusId = previous.id
  }

  fun remove(block: BlockState): Boolean {
    val index = blocks.indexOf(block)
    if (index < 0) return false
    if (blocks.size == 1) {
      block.convertTo(BlockType.PARAGRAPH)
      block.clearText()
      pendingFocusId = block.id
      return true
    }
    blocks.removeAt(index)
    val previous = blocks.getOrNull(index - 1)?.takeIf { it.type != BlockType.DIVIDER }
      ?: blocks.getOrNull(index)
      ?: blocks.last()
    moveCursorToEnd(previous)
    pendingFocusId = previous.id
    return true
  }

  /**
   * Atalhos Markdown escritos no início de um parágrafo: `# ` → título, `- ` → lista,
   * `[] ` → checklist, `> ` → citação, `---` → divisória. Só quando o cursor está logo a seguir.
   */
  fun applyShortcut(block: BlockState): Boolean {
    if (block.type != BlockType.PARAGRAPH) return false
    val text = block.text
    val cursor = block.rich.selection.end

    if (text == "---" && cursor == 3) {
      block.convertTo(BlockType.DIVIDER)
      insertAfter(block)
      return true
    }

    val (prefix, type) = SHORTCUTS.firstOrNull { (prefix, _) -> text.startsWith(prefix) && cursor == prefix.length }
      ?: return false
    block.rich.removeTextRange(TextRange(0, prefix.length))
    block.rich.selection = TextRange(0)
    block.convertTo(type)
    return true
  }

  /** Toolbar: aplica o tipo, ou volta a parágrafo se o bloco já o tinha. */
  fun setType(block: BlockState, type: BlockType) {
    if (type == BlockType.DIVIDER) {
      // A divisória entra a seguir ao bloco, com um parágrafo novo depois dela.
      insertAfter(insertAfter(block, BlockState(type = BlockType.DIVIDER)))
      return
    }
    block.convertTo(if (block.type == type) BlockType.PARAGRAPH else type)
    pendingFocusId = block.id
  }

  /** Menu "/": apaga o "/filtro" e converte o bloco. A divisória fica no lugar e abre um parágrafo novo. */
  fun chooseType(block: BlockState, type: BlockType) {
    block.clearText()
    if (type == BlockType.DIVIDER) {
      block.convertTo(BlockType.DIVIDER)
      insertAfter(block)
    } else {
      block.convertTo(type)
      pendingFocusId = block.id
    }
  }

  /** Troca o `@texto`/`#texto` por um link para o estudante ou a tag, seguido de um espaço. */
  fun insertReference(block: BlockState, trigger: TriggerQuery, reference: Reference) {
    if (!block.type.isRich) return
    val state = block.rich
    val label = "${trigger.kind.trigger}${reference.name}"
    val length = state.annotatedString.text.length
    val range = TextRange(trigger.start.coerceIn(0, length), trigger.end.coerceIn(0, length))
    state.replaceTextRange(range, "$label ")
    state.addLinkToTextRange(referenceUrl(trigger.kind, reference.id), TextRange(range.start, range.start + label.length))
    state.selection = TextRange(range.start + label.length + 1)
    pendingFocusId = block.id
  }

  /** Botão de menção: escreve `@` no cursor (com um espaço antes, se for preciso) para abrir as sugestões. */
  fun startMention() {
    val block = (focused ?: insertTarget)?.takeIf { it.type.isRich } ?: return
    val state = block.rich
    val text = state.annotatedString.text
    val cursor = state.selection.end.coerceIn(0, text.length)
    val insert = if (cursor > 0 && !text[cursor - 1].isWhitespace()) " @" else "@"
    state.addTextAtIndex(cursor, insert)
    state.selection = TextRange(cursor + insert.length)
    pendingFocusId = block.id
  }

  /** Reordenar arrastando: as chaves são os ids dos blocos (o título e o fim não se movem). */
  fun move(fromKey: Any, toKey: Any) {
    val from = blocks.indexOfFirst { it.id == fromKey }
    val to = blocks.indexOfFirst { it.id == toKey }
    if (from < 0 || to < 0) return
    blocks.add(to, blocks.removeAt(from))
  }

  fun moveBy(block: BlockState, delta: Int) {
    val index = blocks.indexOf(block)
    val target = index + delta
    if (index < 0 || target !in blocks.indices) return
    blocks.add(target, blocks.removeAt(index))
    pendingFocusId = block.id
  }

  /** Toque no espaço vazio no fim: foca o último bloco ou cria um parágrafo novo. */
  fun focusEnd() {
    val last = blocks.lastOrNull()
    if (last != null && last.isEmpty && last.type == BlockType.PARAGRAPH) {
      pendingFocusId = last.id
    } else {
      insertAfter(last)
    }
  }

  private fun moveCursorToEnd(block: BlockState) {
    when {
      block.type.isRich -> moveCursorTo(block, block.rich.annotatedString.text.length)
      block.type == BlockType.CODE -> block.code = TextFieldValue(block.code.text, TextRange(block.code.text.length))
    }
  }

  private fun moveCursorTo(block: BlockState, position: Int) {
    if (block.type.isRich) block.rich.selection = TextRange(position)
    else if (block.type == BlockType.CODE) block.code = block.code.copy(selection = TextRange(position))
  }
}

internal fun referenceUrl(kind: ReferenceKind, id: String): String = kind.scheme + id
