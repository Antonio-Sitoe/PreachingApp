package expo.modules.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import expo.modules.notes.blocks.CodeBlock
import expo.modules.notes.blocks.DividerBlock
import expo.modules.notes.blocks.RichBlock
import expo.modules.notes.design.LocalDs
import expo.modules.notes.model.BlockState
import expo.modules.notes.model.BlockType
import expo.modules.notes.sheets.DeleteNoteDialog
import expo.modules.notes.sheets.InsertSheet
import expo.modules.notes.sheets.OptionsSheet
import expo.modules.notes.sheets.StudentPickerSheet
import expo.modules.notes.sheets.TagsSheet
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop
import sh.calvin.reorderable.ReorderableCollectionItemScope
import sh.calvin.reorderable.ReorderableItem
import sh.calvin.reorderable.rememberReorderableLazyListState

private const val SAVE_DEBOUNCE_MS = 250L
private const val HEADER_KEY = "notes-header"
private const val END_KEY = "notes-end"

@OptIn(FlowPreview::class)
@Composable
fun EditorContent(
  controller: EditorController,
  ui: NoteUiState,
  data: EditorData,
  callbacks: EditorCallbacks,
) {
  val ds = LocalDs.current
  val listState = rememberLazyListState()
  val reorderState = rememberReorderableLazyListState(listState) { from, to ->
    controller.move(from.key, to.key)
  }
  val currentCallbacks by rememberUpdatedState(callbacks)

  // Grava depois de uma pausa na escrita. Só lê o estado barato; o Markdown é gerado no fim.
  LaunchedEffect(controller) {
    snapshotFlow {
      controller.blocks.map { block ->
        listOf(block.id, block.type, block.checked, if (block.type.isRich) block.rich.annotatedString else block.code.text)
      }
    }
      .drop(1)
      .debounce(SAVE_DEBOUNCE_MS)
      .collect { currentCallbacks.onDocumentChange(controller.encode()) }
  }

  LaunchedEffect(controller) {
    snapshotFlow { controller.title.text }
      .distinctUntilChanged()
      .drop(1)
      .debounce(SAVE_DEBOUNCE_MS)
      .collect { currentCallbacks.onTitleChange(it) }
  }

  // Foco pedido pelo controller (bloco novo, apagado, convertido, ou o título): espera que o item exista.
  LaunchedEffect(controller.pendingFocusId) {
    val id = controller.pendingFocusId ?: return@LaunchedEffect
    if (id == TITLE_FOCUS_ID) {
      if (listState.firstVisibleItemIndex > 0) listState.animateScrollToItem(0)
      withFrameNanos { }
      runCatching { controller.titleFocusRequester.requestFocus() }
    } else {
      val index = controller.blocks.indexOfFirst { it.id == id }
      if (index >= 0) {
        // +1: o cabeçalho é o primeiro item da lista.
        if (listState.layoutInfo.visibleItemsInfo.none { it.index == index + 1 }) {
          listState.animateScrollToItem(index + 1)
        }
        withFrameNanos { }
        runCatching { controller.blocks[index].focusRequester.requestFocus() }
      }
    }
    controller.pendingFocusId = null
  }

  val tag = data.tags.firstOrNull { it.id == ui.tagId }
  val student = data.students.firstOrNull { it.id == ui.studentId }

  fun setMeta(field: String, value: String?) {
    when (field) {
      "tagId" -> ui.tagId = value
      "color" -> ui.color = value
      "studentId" -> ui.studentId = value
    }
    currentCallbacks.onMetaChange(field, value)
  }

  // Material só para o que vem dele por baixo (checkbox, cursores): as cores são as do projeto.
  val scheme = if (ds.colors.foreground.luminance() > 0.5f) {
    darkColorScheme(primary = ds.colors.primary, surface = ds.colors.card, onSurface = ds.colors.foreground)
  } else {
    lightColorScheme(primary = ds.colors.primary, surface = ds.colors.card, onSurface = ds.colors.foreground)
  }

  MaterialTheme(colorScheme = scheme) {
    // O ecrã vai até ao fundo: a barra fica acima do teclado ou da barra de navegação.
    Column(
      modifier = Modifier
        .fillMaxSize()
        .background(ds.colors.card)
        .windowInsetsPadding(WindowInsets.ime.union(WindowInsets.navigationBars)),
    ) {
      TopBar(saving = data.saving, onBack = callbacks.onBack, onOptions = { ui.sheet = Sheet.Options })

      LazyColumn(
        state = listState,
        modifier = Modifier.weight(1f).fillMaxWidth(),
        contentPadding = PaddingValues(end = 20.dp, bottom = 8.dp),
      ) {
        item(key = HEADER_KEY) {
          NoteHeader(
            controller = controller,
            editable = data.editable,
            stamp = data.stamp,
            tag = tag,
            student = student,
            onTag = { ui.sheet = Sheet.Options },
            onStudent = { ui.sheet = Sheet.Student },
          )
        }
        items(controller.blocks, key = { it.id }) { block ->
          ReorderableItem(reorderState, key = block.id) { isDragging ->
            BlockRow(block, controller, data.editable, data.placeholder, isDragging)
          }
        }
        item(key = END_KEY) {
          Box(
            modifier = Modifier
              .fillMaxWidth()
              .height(160.dp)
              .clickable(
                enabled = data.editable,
                indication = null,
                interactionSource = remember { MutableInteractionSource() },
              ) { controller.focusEnd() },
          )
        }
      }

      if (data.editable) {
        Suggestions(controller, data.students, data.tags, callbacks.onReference)
        EditorToolbar(controller, onInsert = { ui.sheet = Sheet.Insert })
      }
    }

    when (ui.sheet) {
      Sheet.Options -> OptionsSheet(
        tags = data.tags,
        tagId = ui.tagId,
        colors = data.noteColors,
        color = ui.color,
        student = student,
        onTag = { setMeta("tagId", it) },
        onColor = { setMeta("color", it) },
        onManageTags = { ui.sheet = Sheet.Tags },
        onStudent = { ui.sheet = Sheet.Student },
        onDelete = { ui.confirmDelete = true },
        onDismiss = { if (ui.sheet == Sheet.Options) ui.sheet = null },
      )
      Sheet.Tags -> TagsSheet(
        tags = data.tags,
        maxLength = data.tagNameMax,
        feedback = data.tagsFeedback,
        onCreate = callbacks.onTagCreate,
        onRename = callbacks.onTagRename,
        onDelete = callbacks.onTagDelete,
        onDismiss = { if (ui.sheet == Sheet.Tags) ui.sheet = Sheet.Options },
      )
      Sheet.Student -> StudentPickerSheet(
        students = data.students,
        studentId = ui.studentId,
        onChoose = { setMeta("studentId", it) },
        onDismiss = { if (ui.sheet == Sheet.Student) ui.sheet = null },
      )
      Sheet.Insert -> InsertSheet(
        onInsert = { type ->
          val target = controller.insertTarget
          when {
            type == null -> controller.startMention()
            // Inserir não alterna: um bloco que já é desse tipo fica como está.
            target != null && target.type == type -> controller.pendingFocusId = target.id
            target != null -> controller.setType(target, type)
          }
        },
        onDismiss = { if (ui.sheet == Sheet.Insert) ui.sheet = null },
      )
      null -> Unit
    }

    if (ui.confirmDelete) {
      DeleteNoteDialog(
        title = controller.title.text,
        onConfirm = {
          ui.confirmDelete = false
          callbacks.onDeleteNote()
        },
        onDismiss = { ui.confirmDelete = false },
      )
    }
  }
}

@Composable
private fun ReorderableCollectionItemScope.BlockRow(
  block: BlockState,
  controller: EditorController,
  editable: Boolean,
  placeholder: String,
  isDragging: Boolean,
) {
  val ds = LocalDs.current
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .background(if (isDragging) ds.colors.muted else Color.Transparent, RoundedCornerShape(8.dp))
      .padding(vertical = 2.dp),
    verticalAlignment = Alignment.Top,
  ) {
    // A pega fica na margem de 20 (o texto alinha com o título, como o `px-5` do editor antigo).
    Box(
      modifier = Modifier
        .width(20.dp)
        .padding(top = 6.dp)
        .draggableHandle(enabled = editable),
      contentAlignment = Alignment.TopCenter,
    ) {
      Text(text = "⋮⋮", fontSize = 12.sp, color = ds.colors.subtle.copy(alpha = if (editable) 0.6f else 0f))
    }

    Box(modifier = Modifier.weight(1f)) {
      when {
        block.type == BlockType.DIVIDER -> DividerBlock()
        block.type.isRich -> RichBlock(block, controller, editable, placeholder)
        else -> CodeBlock(block, controller, editable)
      }
    }
  }
}
