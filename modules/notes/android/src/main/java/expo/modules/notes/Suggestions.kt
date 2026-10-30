package expo.modules.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import expo.modules.notes.design.AppIcon
import expo.modules.notes.design.LocalDs
import expo.modules.notes.design.StageInitials
import expo.modules.notes.design.TagChip
import expo.modules.notes.design.pressable
import expo.modules.notes.model.BlockState
import expo.modules.notes.model.BlockType
import expo.modules.notes.model.Reference
import expo.modules.notes.model.ReferenceKind
import expo.modules.notes.model.findTrigger
import expo.modules.notes.model.matching

/** O que se está a escrever no bloco com foco: "/filtro", "@nome" ou "#tag". */
private sealed interface Suggestion {
  data class Slash(val query: String) : Suggestion
  data class Ref(val trigger: expo.modules.notes.model.TriggerQuery) : Suggestion
}

private fun suggestionFor(block: BlockState): Suggestion? {
  if (!block.type.isRich) return null
  val text = block.rich.annotatedString.text
  if (text.startsWith("/") && text.length <= 16 && ' ' !in text) return Suggestion.Slash(text.drop(1))
  val selection = block.rich.selection
  return if (selection.collapsed) findTrigger(text, selection.end)?.let { Suggestion.Ref(it) } else null
}

/**
 * Painel por cima da barra (como o mention-suggestions.tsx antigo): `border-t bg-card py-2`
 * com as opções numa linha que desliza. Estudantes com iniciais, tags como TagChip e os tipos
 * de bloco para o "/".
 */
@Composable
fun Suggestions(
  controller: EditorController,
  students: List<Reference>,
  tags: List<Reference>,
  onReference: (ReferenceKind, Reference) -> Unit,
) {
  val ds = LocalDs.current
  val block = controller.focused ?: return
  val suggestion = suggestionFor(block) ?: return

  Column(modifier = Modifier.fillMaxWidth().background(ds.colors.card)) {
    Box(Modifier.fillMaxWidth().height(1.dp).background(ds.colors.border))
    Box(modifier = Modifier.padding(vertical = 8.dp)) {
      when (suggestion) {
        is Suggestion.Slash -> {
          val types = BlockType.entries.filter {
            it.label.contains(suggestion.query, ignoreCase = true) || it.value.contains(suggestion.query, ignoreCase = true)
          }
          if (types.isEmpty()) Empty("Nenhum bloco com esse nome.")
          else ChipRow(types) { type ->
            Chip(onClick = { controller.chooseType(block, type) }) {
              AppIcon(type.icon, tint = ds.colors.mutedForeground, size = 18.dp)
              Text(type.label, style = ds.displayMedium(14f, 20f), maxLines = 1)
            }
          }
        }
        is Suggestion.Ref -> {
          val trigger = suggestion.trigger
          val source = if (trigger.kind == ReferenceKind.STUDENT) students else tags
          val matches = source.matching(trigger.query, limit = 20)
          when {
            source.isEmpty() -> Empty(if (trigger.kind == ReferenceKind.STUDENT) "Ainda não há estudantes." else "Ainda não há etiquetas.")
            matches.isEmpty() -> Empty(if (trigger.kind == ReferenceKind.STUDENT) "Nenhum estudante com esse nome." else "Nenhuma etiqueta com esse nome.")
            trigger.kind == ReferenceKind.TAG -> ChipRow(matches) { tag ->
              TagChip(label = tag.name, active = false, onClick = {
                controller.insertReference(block, trigger, tag)
                onReference(trigger.kind, tag)
              })
            }
            else -> ChipRow(matches) { student ->
              Chip(onClick = {
                controller.insertReference(block, trigger, student)
                onReference(trigger.kind, student)
              }, startPadding = 6.dp) {
                StageInitials(student.name, student.stage)
                Text(student.name, style = ds.displayMedium(14f, 20f), maxLines = 1)
              }
            }
          }
        }
      }
    }
  }
}

@Composable
private fun <T> ChipRow(items: List<T>, item: @Composable (T) -> Unit) {
  LazyRow(
    contentPadding = PaddingValues(horizontal = 12.dp),
    horizontalArrangement = Arrangement.spacedBy(8.dp),
  ) {
    items(items) { item(it) }
  }
}

/** `h-9 rounded-full border border-border pl-1.5 pr-3 active:bg-secondary`. */
@Composable
private fun Chip(onClick: () -> Unit, startPadding: androidx.compose.ui.unit.Dp = 12.dp, content: @Composable () -> Unit) {
  val ds = LocalDs.current
  Row(
    modifier = Modifier
      .height(36.dp)
      .border(1.dp, ds.colors.border, CircleShape)
      .pressable(CircleShape, ds.colors.secondary, onClick = onClick)
      .padding(start = startPadding, end = 12.dp),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(8.dp),
  ) {
    content()
  }
}

@Composable
private fun Empty(text: String) {
  val ds = LocalDs.current
  Text(text, style = ds.sans(13f, 18f, ds.colors.mutedForeground), modifier = Modifier.padding(horizontal = 20.dp))
}
