package expo.modules.notes.sheets

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.background
import expo.modules.notes.design.Avatar
import expo.modules.notes.design.ButtonVariant
import expo.modules.notes.design.DsBottomSheet
import expo.modules.notes.design.DsButton
import expo.modules.notes.design.DsRadius
import expo.modules.notes.design.LocalDs
import expo.modules.notes.design.StageBadge
import expo.modules.notes.design.pressable
import expo.modules.notes.model.Reference

/** "Sobre alguém" (student-picker-sheet.tsx antigo): liga a nota à ficha de um estudante. */
@Composable
fun StudentPickerSheet(
  students: List<Reference>,
  studentId: String?,
  onChoose: (String?) -> Unit,
  onDismiss: () -> Unit,
) {
  val ds = LocalDs.current
  DsBottomSheet(onDismiss = onDismiss, title = "Sobre alguém") { close ->
    Text("A nota aparece na ficha do estudante.", style = ds.bodyS.copy(color = ds.colors.mutedForeground))

    if (students.isEmpty()) {
      Column(
        modifier = Modifier
          .fillMaxWidth()
          .background(ds.colors.muted, RoundedCornerShape(DsRadius.lg))
          .padding(horizontal = 16.dp, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
      ) {
        Text("Ainda não há estudantes", style = ds.titleS)
        Text(
          "Quando registares alguém em Estudantes, aparece aqui.",
          style = ds.bodyS.copy(color = ds.colors.mutedForeground),
          textAlign = TextAlign.Center,
        )
      }
    } else {
      val maxHeight = (LocalConfiguration.current.screenHeightDp * 0.45f).dp
      LazyColumn(modifier = Modifier.heightIn(max = maxHeight), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items(students, key = { it.id }) { student ->
          val selected = student.id == studentId
          val shape = RoundedCornerShape(DsRadius.lg)
          Row(
            modifier = Modifier
              .fillMaxWidth()
              .heightIn(min = 56.dp)
              .border(1.dp, if (selected) ds.colors.primary else ds.colors.border, shape)
              .pressable(shape, ds.colors.secondary, if (selected) ds.colors.secondary else Color.Transparent) {
                onChoose(if (selected) null else student.id)
                close()
              }
              .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
          ) {
            Avatar(student.name)
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
              Text(student.name, style = ds.titleS, maxLines = 1, overflow = TextOverflow.Ellipsis)
              if (student.detail != null) StageBadge(student.stage, student.detail)
            }
          }
        }
      }
    }

    if (studentId != null) {
      DsButton(
        "Remover ligação",
        onClick = {
          onChoose(null)
          close()
        },
        variant = ButtonVariant.Destructive,
        modifier = Modifier.fillMaxWidth(),
      )
    }
    DsButton("Cancelar", onClick = close, variant = ButtonVariant.Ghost, modifier = Modifier.fillMaxWidth())
  }
}
