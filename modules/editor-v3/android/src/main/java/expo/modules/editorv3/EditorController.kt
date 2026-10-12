package expo.modules.editorv3

import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.input.TextFieldValue
import expo.modules.editorv3.model.BlockState
import expo.modules.editorv3.model.BlockType
import expo.modules.editorv3.model.DocumentCodec

/** Estado do documento: a lista de blocos, o bloco com foco e as operações entre blocos. */
@Stable
class EditorController(initial: List<BlockState>) {
  val blocks = mutableStateListOf<BlockState>().apply { addAll(initial) }

  /** Bloco que tem o cursor. A toolbar e o menu "/" trabalham sobre ele. */
  var focusedId by mutableStateOf<String?>(null)

  /** Bloco que deve receber o foco assim que estiver composto (depois de criar ou apagar). */
  var pendingFocusId by mutableStateOf<String?>(null)

  val focused: BlockState? get() = blocks.firstOrNull { it.id == focusedId }

  fun encode(): String = DocumentCodec.encode(blocks)

  /**
   * Enter num bloco de texto: o que está depois do cursor passa para um bloco novo, com a
   * formatação. Numa checklist vazia, sai da lista (vira parágrafo), como no Notion.
   */
  fun split(block: BlockState) {
    if (!block.type.isRich) return
    if (block.type == BlockType.CHECKLIST && block.isEmpty) {
      block.convertTo(BlockType.PARAGRAPH)
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

    val nextType = if (block.type == BlockType.CHECKLIST) BlockType.CHECKLIST else BlockType.PARAGRAPH
    insertAfter(block, BlockState(type = nextType, rich = tail))
  }

  fun insertAfter(block: BlockState?, newBlock: BlockState = BlockState()): BlockState {
    val index = block?.let { blocks.indexOf(it) } ?: -1
    blocks.add(if (index < 0) blocks.size else index + 1, newBlock)
    pendingFocusId = newBlock.id
    return newBlock
  }

  /**
   * Backspace num bloco vazio: um título/checklist/código volta a parágrafo; um parágrafo é
   * apagado e o cursor vai para o fim do bloco anterior.
   */
  fun backspaceOnEmpty(block: BlockState): Boolean {
    if (!block.isEmpty) return false
    if (block.type != BlockType.PARAGRAPH) {
      block.convertTo(BlockType.PARAGRAPH)
      return true
    }
    return remove(block)
  }

  fun remove(block: BlockState): Boolean {
    val index = blocks.indexOf(block)
    if (index < 0) return false
    if (blocks.size == 1) {
      block.clearText()
      block.convertTo(BlockType.PARAGRAPH)
      return true
    }
    blocks.removeAt(index)
    val previous = blocks[(index - 1).coerceAtLeast(0)]
    moveCursorToEnd(previous)
    pendingFocusId = previous.id
    return true
  }

  fun move(from: Int, to: Int) {
    if (from !in blocks.indices || to !in blocks.indices) return
    blocks.add(to, blocks.removeAt(from))
  }

  fun moveBy(block: BlockState, delta: Int) {
    val index = blocks.indexOf(block)
    move(index, index + delta)
    pendingFocusId = block.id
  }

  fun setType(block: BlockState, type: BlockType) {
    block.convertTo(if (block.type == type) BlockType.PARAGRAPH else type)
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
    if (block.type.isRich) {
      block.rich.selection = TextRange(block.rich.annotatedString.text.length)
    } else {
      block.code = TextFieldValue(block.code.text, TextRange(block.code.text.length))
    }
  }
}
