package expo.modules.notes

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import expo.modules.notes.design.AppIcon
import expo.modules.notes.design.DsIconButton
import expo.modules.notes.design.LocalDs

@Composable
fun TopBar(saving: Boolean, onBack: () -> Unit, onOptions: () -> Unit) {
  val ds = LocalDs.current
  Row(
    modifier = Modifier.fillMaxWidth().padding(start = 8.dp, end = 8.dp, bottom = 4.dp),
    verticalAlignment = Alignment.CenterVertically,
  ) {
    DsIconButton("chevron-left", "Voltar às notas", ds.colors.foreground, onBack)
    Spacer(Modifier.weight(1f))
    Row(
      modifier = Modifier.padding(end = 4.dp),
      verticalAlignment = Alignment.CenterVertically,
      horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
      if (!saving) AppIcon("saved", tint = ds.colors.success, size = 16.dp)
      Text(if (saving) "A guardar…" else "Guardado", style = ds.sans(13f, 18f, ds.colors.mutedForeground))
    }
    DsIconButton("more", "Opções da nota", ds.colors.foreground, onOptions, strokeWidth = 3f)
  }
}
