package expo.modules.notes.blocks

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import expo.modules.notes.design.LocalDs

/** Apaga-se com Backspace no início do bloco seguinte. */
@Composable
fun DividerBlock(modifier: Modifier = Modifier) {
  Box(modifier = modifier.fillMaxWidth().padding(vertical = 14.dp)) {
    HorizontalDivider(color = LocalDs.current.colors.border, thickness = 1.dp)
  }
}
