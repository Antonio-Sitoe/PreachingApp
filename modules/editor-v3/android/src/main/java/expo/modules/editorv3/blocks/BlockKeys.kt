package expo.modules.editorv3.blocks

import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEvent
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.type
import expo.modules.editorv3.EditorController
import expo.modules.editorv3.model.BlockState

/**
 * Teclas que mexem na estrutura: Enter (teclado físico, ou teclados que mandam o evento em vez
 * da ação) cria um bloco; Backspace num bloco vazio desfaz o tipo ou apaga o bloco.
 */
internal fun handleBlockKey(event: KeyEvent, block: BlockState, controller: EditorController): Boolean {
  if (event.type != KeyEventType.KeyDown) return false
  return when (event.key) {
    Key.Enter, Key.NumPadEnter -> {
      if (!block.type.isRich || event.isShiftPressed) return false
      controller.split(block)
      true
    }
    Key.Backspace -> controller.backspaceOnEmpty(block)
    else -> false
  }
}
