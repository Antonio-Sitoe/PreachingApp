package expo.modules.notes.sheets

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import expo.modules.notes.NoteColor
import expo.modules.notes.design.AppIcon
import expo.modules.notes.design.DsBottomSheet
import expo.modules.notes.design.DsButton
import expo.modules.notes.design.DsRadius
import expo.modules.notes.design.LocalDs
import expo.modules.notes.design.TagChip
import expo.modules.notes.design.parseCssColor
import expo.modules.notes.design.pressable
import expo.modules.notes.model.Reference

private fun shortName(name: String): String {
  val words = name.trim().split(Regex("\\s+"))
  if (words.size < 2) return name
  return "${words.first()} ${words.last().take(1)}."
}

/**
 * Reparte as etiquetas por até 3 linhas, cada uma na mais curta até ali, para ficarem com
 * comprimentos parecidos.
 */
private fun tagRows(tags: List<Reference>): List<List<Reference>> {
  if (tags.isEmpty()) return emptyList()
  val count = minOf(3, (tags.size + 2) / 3)
  val rows = List(count) { mutableListOf<Reference>() }
  val widths = IntArray(count)
  tags.forEach { tag ->
    val shortest = widths.indices.minBy { widths[it] }
    rows[shortest].add(tag)
    widths[shortest] += tag.name.length + 4
  }
  return rows
}

@Composable
fun OptionsSheet(
  tags: List<Reference>,
  tagId: String?,
  colors: List<NoteColor>,
  color: String?,
  student: Reference?,
  onTag: (String?) -> Unit,
  onColor: (String) -> Unit,
  onManageTags: () -> Unit,
  onStudent: () -> Unit,
  onDelete: () -> Unit,
  onDismiss: () -> Unit,
) {
  val ds = LocalDs.current
  DsBottomSheet(onDismiss = onDismiss, title = "Detalhes da nota") { close ->
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
      Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text("Etiqueta", style = ds.displayMedium(14f, 19f), modifier = Modifier.weight(1f))
        Row(
          modifier = Modifier
            .height(32.dp)
            .pressable(CircleShape, ds.colors.secondary, onClick = onManageTags)
            .padding(horizontal = 10.dp),
          verticalAlignment = Alignment.CenterVertically,
          horizontalArrangement = Arrangement.spacedBy(6.dp),
        ) {
          AppIcon("edit", tint = ds.colors.primary, size = 14.dp)
          Text("Gerir", style = ds.displaySemibold(13f, 18f, ds.colors.primary))
        }
      }
      if (tags.isEmpty()) {
        Text("Ainda não há etiquetas. Toca em Gerir para criar.", style = ds.bodyS.copy(color = ds.colors.mutedForeground))
      } else {
        // Até 3 linhas que deslizam juntas para o lado: a folha não cresce com muitas etiquetas.
        Column(
          modifier = Modifier.horizontalScroll(rememberScrollState()),
          verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
          tagRows(tags).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
              row.forEach { tag ->
                TagChip(tag.name, active = tag.id == tagId, onClick = { onTag(if (tag.id == tagId) null else tag.id) })
              }
            }
          }
        }
      }
    }

    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
      Text("Cor na lista", style = ds.displayMedium(14f, 19f))
      Row(modifier = Modifier.horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        colors.forEach { option ->
          val selected = option.color.equals(color, ignoreCase = true)
          Box(
            modifier = Modifier
              .size(44.dp)
              .pressable(CircleShape, androidx.compose.ui.graphics.Color.Transparent, role = Role.RadioButton) { onColor(option.color) },
            contentAlignment = Alignment.Center,
          ) {
            Box(
              modifier = Modifier
                .size(32.dp)
                .background(parseCssColor(option.color) ?: ds.colors.muted, CircleShape)
                .border(if (selected) 2.5.dp else 1.dp, if (selected) ds.colors.primary else ds.colors.border, CircleShape),
            )
          }
        }
      }
    }

    val shape = RoundedCornerShape(DsRadius.lg)
    Column(modifier = Modifier.fillMaxWidth().border(1.dp, ds.colors.border, shape)) {
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 56.dp)
          .pressable(RoundedCornerShape(topStart = DsRadius.lg, topEnd = DsRadius.lg), ds.colors.secondary) {
            close()
            onStudent()
          }
          .padding(start = 16.dp, end = 12.dp, top = 8.dp, bottom = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
      ) {
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
          Text("Sobre alguém", style = ds.titleS)
          Text("Opcional. A nota aparece na ficha do estudante", style = ds.bodyS.copy(color = ds.colors.mutedForeground))
        }
        if (student != null) Text(shortName(student.name), style = ds.sans(14f, 20f, ds.colors.mutedForeground))
        AppIcon("chevron-right", tint = ds.colors.subtle, size = 20.dp)
      }
      Box(Modifier.fillMaxWidth().height(1.dp).background(ds.colors.border))
      Row(
        modifier = Modifier
          .fillMaxWidth()
          .heightIn(min = 52.dp)
          .pressable(RoundedCornerShape(bottomStart = DsRadius.lg, bottomEnd = DsRadius.lg), ds.colors.destructiveSoft) {
            close()
            onDelete()
          }
          .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
      ) {
        AppIcon("trash", tint = ds.colors.destructive, size = 20.dp)
        Text("Apagar nota", style = ds.titleS.copy(color = ds.colors.destructive))
      }
    }

    DsButton("Concluir", onClick = close, modifier = Modifier.fillMaxWidth())
  }
}

