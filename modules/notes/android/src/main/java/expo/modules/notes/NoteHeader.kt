package expo.modules.notes

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import expo.modules.notes.design.AppIcon
import expo.modules.notes.design.LocalDs
import expo.modules.notes.design.StageInitials
import expo.modules.notes.design.pressable
import expo.modules.notes.model.Reference

@Composable
fun NoteHeader(
  controller: EditorController,
  editable: Boolean,
  stamp: String,
  tag: Reference?,
  student: Reference?,
  onTag: () -> Unit,
  onStudent: () -> Unit,
) {
  val ds = LocalDs.current
  val titleStyle = ds.display(26f, 32f).copy(letterSpacing = (-0.2).sp)

  Column(modifier = Modifier.fillMaxWidth().padding(start = 20.dp, top = 8.dp)) {
    BasicTextField(
      value = controller.title,
      onValueChange = controller::changeTitle,
      modifier = Modifier
        .fillMaxWidth()
        .focusRequester(controller.titleFocusRequester)
        .onFocusChanged { focusState ->
          if (focusState.isFocused) controller.focusedId = TITLE_FOCUS_ID
          else if (controller.focusedId == TITLE_FOCUS_ID) controller.focusedId = null
        },
      readOnly = !editable,
      textStyle = titleStyle,
      keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences, imeAction = ImeAction.Next),
      keyboardActions = KeyboardActions(onNext = { controller.focusFirstBlock() }),
      cursorBrush = SolidColor(ds.colors.primary),
      decorationBox = { inner ->
        Box {
          if (controller.title.text.isEmpty()) Text("Título", style = titleStyle.copy(color = ds.colors.subtle))
          inner()
        }
      },
    )

    if (stamp.isNotBlank()) {
      Text(stamp, style = ds.sans(13f, 18f, ds.colors.mutedForeground), modifier = Modifier.padding(top = 6.dp))
    }

    Column(modifier = Modifier.padding(top = 12.dp)) {
      DetailRow(icon = "tag", label = "Etiqueta", onClick = onTag) {
        if (tag != null) {
          val (text, background) = ds.colors.stage("regular")
          Box(
            modifier = Modifier.height(28.dp).background(background, CircleShape).padding(horizontal = 10.dp),
            contentAlignment = Alignment.Center,
          ) {
            Text(tag.name, style = ds.displaySemibold(13f, 18f, text), maxLines = 1)
          }
        } else {
          Text("Escolher", style = ds.sans(14f, 20f, ds.colors.subtle))
        }
      }
      DetailRow(icon = "person", label = "Sobre", onClick = onStudent) {
        if (student != null) {
          Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            StageInitials(student.name, student.stage)
            Text(student.name, style = ds.displayMedium(14f, 20f), maxLines = 1, overflow = TextOverflow.Ellipsis)
          }
        } else {
          Text("Ninguém", style = ds.sans(14f, 20f, ds.colors.subtle))
        }
      }
    }

    Box(
      modifier = Modifier
        .padding(top = 12.dp, bottom = 16.dp)
        .fillMaxWidth()
        .height(1.dp)
        .background(ds.colors.border),
    )
  }
}

@Composable
private fun DetailRow(icon: String, label: String, onClick: () -> Unit, content: @Composable () -> Unit) {
  val ds = LocalDs.current
  Row(
    modifier = Modifier
      .fillMaxWidth()
      .heightIn(min = 44.dp)
      .pressable(androidx.compose.ui.graphics.RectangleShape, Color.Transparent, onClick = onClick),
    verticalAlignment = Alignment.CenterVertically,
    horizontalArrangement = Arrangement.spacedBy(10.dp),
  ) {
    AppIcon(icon, tint = ds.colors.subtle, size = 18.dp)
    Text(label, style = ds.sans(14f, 20f, ds.colors.mutedForeground), modifier = Modifier.width(78.dp))
    content()
  }
}
