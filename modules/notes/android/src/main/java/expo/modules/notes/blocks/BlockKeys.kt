package expo.modules.notes.blocks

import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEvent
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.type
import expo.modules.notes.EditorController
import expo.modules.notes.model.BlockState

/**
 * Teclas que mexem na estrutura: Enter (teclado físico, ou teclados que mandam o evento em vez
 * da ação) cria um bloco; Backspace no início do bloco desfaz o tipo, apaga-o ou junta-o ao de cima.
 */
internal fun handleBlockKey(event: KeyEvent, block: BlockState, controller: EditorController): Boolean {
  if (event.type != KeyEventType.KeyDown) return false
  return when (event.key) {
    Key.Enter, Key.NumPadEnter -> {
      if (!block.type.isRich || event.isShiftPressed) return false
      controller.split(block)
      true
    }
    Key.Backspace -> controller.backspace(block)
    else -> false
  }
}
