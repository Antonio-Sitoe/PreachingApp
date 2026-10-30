package expo.modules.notes.sheets

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import expo.modules.notes.TagsFeedback
import expo.modules.notes.design.ButtonVariant
import expo.modules.notes.design.DsBottomSheet
import expo.modules.notes.design.DsButton
import expo.modules.notes.design.DsIconButton
import expo.modules.notes.design.DsRadius
import expo.modules.notes.design.DsTextField
import expo.modules.notes.design.LocalDs
import expo.modules.notes.model.Reference
import java.util.UUID

/**
 * A base de dados é do JS:
 * os pedidos vão por evento com um `requestId` e a resposta volta em [feedback].
 */
@Composable
fun TagsSheet(
  tags: List<Reference>,
  maxLength: Int,
  feedback: TagsFeedback?,
  onCreate: (requestId: String, name: String) -> Unit,
  onRename: (requestId: String, id: String, name: String) -> Unit,
  onDelete: (id: String) -> Unit,
  onDismiss: () -> Unit,
) {
  val ds = LocalDs.current
  var draft by remember { mutableStateOf("") }
  var error by remember { mutableStateOf<String?>(null) }
  var pending by remember { mutableStateOf<String?>(null) }

  LaunchedEffect(feedback) {
    if (feedback == null || feedback.requestId != pending) return@LaunchedEffect
    pending = null
    if (feedback.error != null) error = feedback.error else draft = ""
  }

  DsBottomSheet(onDismiss = onDismiss, title = "Etiquetas") { close ->
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
      Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        DsTextField(
          value = draft,
          onValueChange = {
            draft = it
            error = null
          },
          placeholder = "Nova etiqueta",
          maxLength = maxLength,
          modifier = Modifier.weight(1f),
          onDone = { create(draft, pending) { id -> pending = id; onCreate(id, draft) } },
        )
        val canCreate = draft.isNotBlank() && pending == null
        DsIconButton(
          icon = "plus",
          contentDescription = "Criar etiqueta",
          tint = ds.colors.primaryForeground,
          onClick = { create(draft, pending) { id -> pending = id; onCreate(id, draft) } },
          size = 48.dp,
          iconSize = 20.dp,
          shape = RoundedCornerShape(DsRadius.lg),
          background = ds.colors.primary,
          pressed = ds.colors.primary.copy(alpha = 0.9f),
          enabled = canCreate,
        )
      }
      if (error != null) Text(error!!, style = ds.bodyS.copy(color = ds.colors.destructive))
    }

    val maxHeight = (LocalConfiguration.current.screenHeightDp * 0.4f).dp
    if (tags.isEmpty()) {
      Text(
        "Ainda não há etiquetas.",
        style = ds.bodyS.copy(color = ds.colors.mutedForeground),
        textAlign = TextAlign.Center,
        modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp),
      )
    } else {
      LazyColumn(modifier = Modifier.heightIn(max = maxHeight)) {
        items(tags, key = { it.id }) { tag -> TagRow(tag, maxLength, feedback, onRename, onDelete) }
      }
    }

    DsButton("Concluir", onClick = close, modifier = Modifier.fillMaxWidth())
  }
}

private fun create(draft: String, pending: String?, send: (String) -> Unit) {
  if (draft.isBlank() || pending != null) return
  send(UUID.randomUUID().toString())
}

private enum class RowMode { View, Edit, Confirm }

@Composable
private fun TagRow(
  tag: Reference,
  maxLength: Int,
  feedback: TagsFeedback?,
  onRename: (requestId: String, id: String, name: String) -> Unit,
  onDelete: (id: String) -> Unit,
) {
  val ds = LocalDs.current
  var mode by remember(tag.id) { mutableStateOf(RowMode.View) }
  var draft by remember(tag.id) { mutableStateOf(tag.name) }
  var error by remember(tag.id) { mutableStateOf<String?>(null) }
  var pending by remember(tag.id) { mutableStateOf<String?>(null) }

  LaunchedEffect(feedback) {
    if (feedback == null || feedback.requestId != pending) return@LaunchedEffect
    pending = null
    if (feedback.error != null) error = feedback.error else mode = RowMode.View
  }

  fun submit() {
    if (draft.trim() == tag.name) {
      mode = RowMode.View
      return
    }
    val id = UUID.randomUUID().toString()
    pending = id
    onRename(id, tag.id, draft)
  }

  Column(modifier = Modifier.fillMaxWidth()) {
    when (mode) {
      RowMode.Edit -> Column(modifier = Modifier.padding(vertical = 8.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
          DsTextField(
            value = draft,
            onValueChange = {
              draft = it
              error = null
            },
            placeholder = tag.name,
            maxLength = maxLength,
            autoFocus = true,
            modifier = Modifier.weight(1f),
            onDone = ::submit,
          )
          DsIconButton(
            icon = "saved",
            contentDescription = "Guardar nome",
            tint = ds.colors.primaryForeground,
            onClick = ::submit,
            iconSize = 20.dp,
            shape = RoundedCornerShape(DsRadius.lg),
            background = ds.colors.primary,
            pressed = ds.colors.primary.copy(alpha = 0.9f),
          )
          DsIconButton(
            icon = "close",
            contentDescription = "Cancelar",
            tint = ds.colors.mutedForeground,
            onClick = {
              draft = tag.name
              error = null
              mode = RowMode.View
            },
            iconSize = 20.dp,
            shape = RoundedCornerShape(DsRadius.lg),
          )
        }
        if (error != null) Text(error!!, style = ds.bodyS.copy(color = ds.colors.destructive))
      }
      RowMode.Confirm -> Column(modifier = Modifier.padding(vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text("Apagar «${tag.name}»? As notas com esta etiqueta ficam sem etiqueta.", style = ds.bodyM)
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
          DsButton("Apagar", onClick = { onDelete(tag.id) }, variant = ButtonVariant.Destructive, small = true, modifier = Modifier.weight(1f))
          DsButton("Cancelar", onClick = { mode = RowMode.View }, variant = ButtonVariant.Ghost, small = true, modifier = Modifier.weight(1f))
        }
      }
      RowMode.View -> Row(
        modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp),
      ) {
        Text(tag.name, style = ds.titleS, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
        DsIconButton(
          icon = "edit",
          contentDescription = "Renomear ${tag.name}",
          tint = ds.colors.mutedForeground,
          onClick = {
            draft = tag.name
            mode = RowMode.Edit
          },
          iconSize = 18.dp,
          shape = RoundedCornerShape(DsRadius.lg),
        )
        DsIconButton(
          icon = "trash",
          contentDescription = "Apagar ${tag.name}",
          tint = ds.colors.destructive,
          onClick = { mode = RowMode.Confirm },
          iconSize = 18.dp,
          shape = RoundedCornerShape(DsRadius.lg),
          pressed = ds.colors.destructiveSoft,
        )
      }
    }
    Box(Modifier.fillMaxWidth().height(1.dp).background(ds.colors.border))
  }
}

