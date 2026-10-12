package expo.modules.editorv3

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.editorv3.blocks.CodeBlock
import expo.modules.editorv3.blocks.RichBlock
import expo.modules.editorv3.model.BlockState
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.drop
import sh.calvin.reorderable.ReorderableCollectionItemScope
import sh.calvin.reorderable.ReorderableItem
import sh.calvin.reorderable.rememberReorderableLazyListState

private const val SAVE_DEBOUNCE_MS = 250L

@OptIn(FlowPreview::class)
@Composable
fun EditorV3Content(
  controller: EditorController,
  colors: EditorColors,
  editable: Boolean,
  placeholder: String,
  onDocumentChange: (String) -> Unit,
) {
  val listState = rememberLazyListState()
  val reorderState = rememberReorderableLazyListState(listState) { from, to ->
    controller.move(from.index, to.index)
  }
  val currentOnDocumentChange by rememberUpdatedState(onDocumentChange)

  // Grava depois de uma pausa na escrita. Só lê o estado barato; o Markdown é gerado no fim.
  LaunchedEffect(controller) {
    snapshotFlow {
      controller.blocks.map { block ->
        listOf(block.id, block.type, block.checked, if (block.type.isRich) block.rich.annotatedString else block.code.text)
      }
    }
      .drop(1)
      .debounce(SAVE_DEBOUNCE_MS)
      .collect { currentOnDocumentChange(controller.encode()) }
  }

  // Foco pedido pelo controller (bloco novo, apagado, convertido): espera que o item exista.
  LaunchedEffect(controller.pendingFocusId) {
    val id = controller.pendingFocusId ?: return@LaunchedEffect
    val index = controller.blocks.indexOfFirst { it.id == id }
    if (index >= 0) {
      if (listState.layoutInfo.visibleItemsInfo.none { it.index == index }) {
        listState.animateScrollToItem(index)
      }
      withFrameNanos { }
      runCatching { controller.blocks[index].focusRequester.requestFocus() }
    }
    controller.pendingFocusId = null
  }

  val isDark = colors.foreground.luminance() > 0.5f
  val scheme = if (isDark) {
    darkColorScheme(primary = colors.primary, surface = colors.card, onSurface = colors.foreground)
  } else {
    lightColorScheme(primary = colors.primary, surface = colors.card, onSurface = colors.foreground)
  }

  MaterialTheme(colorScheme = scheme) {
    // O editor ocupa o ecrã até ao fundo: a toolbar fica acima do teclado ou da barra de navegação.
    Column(modifier = Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.ime.union(WindowInsets.navigationBars))) {
      LazyColumn(
        state = listState,
        modifier = Modifier.weight(1f).fillMaxWidth(),
        contentPadding = PaddingValues(start = 4.dp, end = 16.dp, top = 8.dp, bottom = 8.dp),
      ) {
        items(controller.blocks, key = { it.id }) { block ->
          ReorderableItem(reorderState, key = block.id) { isDragging ->
            BlockRow(
              block = block,
              controller = controller,
              colors = colors,
              editable = editable,
              placeholder = placeholder,
              isDragging = isDragging,
            )
          }
        }
        item(key = "editor-v3-end") {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(160.dp)
              .clickable(
                enabled = editable,
                indication = null,
                interactionSource = remember { MutableInteractionSource() },
              ) { controller.focusEnd() },
          )
        }
      }

      if (editable && controller.focused != null) {
        FormatToolbar(controller, colors)
      }
    }
  }
}

@Composable
private fun ReorderableCollectionItemScope.BlockRow(
  block: BlockState,
  controller: EditorController,
  colors: EditorColors,
  editable: Boolean,
  placeholder: String,
  isDragging: Boolean,
) {
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .background(if (isDragging) colors.surface else Color.Transparent, RoundedCornerShape(8.dp))
      .padding(vertical = 2.dp),
    verticalAlignment = Alignment.Top,
  ) {
    Box(
      modifier = Modifier
        .width(28.dp)
        .padding(top = 6.dp)
        .draggableHandle(enabled = editable),
      contentAlignment = Alignment.TopCenter,
    ) {
      Text(
        text = "⋮⋮",
        fontSize = 14.sp,
        color = colors.muted.copy(alpha = if (editable) 0.5f else 0f),
      )
    }

    Box(modifier = Modifier.weight(1f)) {
      if (block.type.isRich) {
        RichBlock(block, controller, colors, editable, placeholder)
      } else {
        CodeBlock(block, controller, colors, editable)
      }
      if (editable) SlashMenu(block, controller, colors)
    }
  }
}
