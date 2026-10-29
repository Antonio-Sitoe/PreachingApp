package expo.modules.notes.sheets

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import expo.modules.notes.design.ButtonVariant
import expo.modules.notes.design.DsAlertDialog
import expo.modules.notes.design.DsBottomSheet
import expo.modules.notes.design.DsButton
import expo.modules.notes.design.DsRadius
import expo.modules.notes.design.LocalDs
import expo.modules.notes.design.SheetOption
import expo.modules.notes.model.BlockType

private data class InsertOption(val type: BlockType?, val icon: String, val title: String, val description: String)

private val INSERTS = listOf(
  InsertOption(BlockType.HEADING1, "heading", "Título 1", "Separa a nota em partes"),
  InsertOption(BlockType.HEADING2, "heading", "Título 2", "Uma parte dentro de outra"),
  InsertOption(BlockType.HEADING3, "heading", "Título 3", "Um subtítulo pequeno"),
  InsertOption(BlockType.BULLET, "bullet-list", "Lista", "Pontos soltos, um por linha"),
  InsertOption(BlockType.CHECKLIST, "task-list", "Lista de tarefas", "Itens que podes marcar como feitos"),
  InsertOption(BlockType.QUOTE, "scripture", "Citação", "Um texto em destaque, como um versículo"),
  InsertOption(BlockType.CODE, "code", "Código", "Texto à parte, sem formatação"),
  InsertOption(BlockType.DIVIDER, "notes", "Divisória", "Uma linha a separar partes"),
  InsertOption(null, "mention", "Mencionar estudante", "Liga a nota à ficha de alguém"),
)

private val SHORTCUTS = listOf("#" to "título", "-" to "lista", "[]" to "tarefa", ">" to "citação", "---" to "divisória", "@" to "estudante")

/** "+ Inserir" (insert-sheet.tsx antigo): os tipos de bloco e os atalhos. `null` = mencionar. */
@Composable
fun InsertSheet(onInsert: (BlockType?) -> Unit, onDismiss: () -> Unit) {
  val ds = LocalDs.current
  DsBottomSheet(onDismiss = onDismiss, title = "Inserir") { close ->
    val maxHeight = (LocalConfiguration.current.screenHeightDp * 0.5f).dp
    Column(
      modifier = Modifier.heightIn(max = maxHeight).verticalScroll(rememberScrollState()),
      verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
      INSERTS.forEach { option ->
        SheetOption(option.icon, option.title, option.description, onClick = {
          close()
          onInsert(option.type)
        })
      }
    }

    val muted = ds.sans(13f, 19f, ds.colors.mutedForeground)
    Text(
      buildAnnotatedString {
        append("Atalhos ao escrever: ")
        SHORTCUTS.forEachIndexed { index, (key, label) ->
          withStyle(SpanStyle(fontFamily = ds.fonts.sansSemibold, color = ds.colors.foreground)) { append(key) }
          append(" $label")
          append(if (index < SHORTCUTS.lastIndex) ", " else ".")
        }
      },
      style = muted,
      modifier = Modifier
        .fillMaxWidth()
        .background(ds.colors.muted, RoundedCornerShape(DsRadius.lg))
        .padding(horizontal = 14.dp, vertical = 12.dp),
    )
    DsButton("Cancelar", onClick = close, variant = ButtonVariant.Ghost, modifier = Modifier.fillMaxWidth())
  }
}

/** "Apagar esta nota?" (AlertDialog do editor antigo). */
@Composable
fun DeleteNoteDialog(title: String, onConfirm: () -> Unit, onDismiss: () -> Unit) {
  DsAlertDialog(
    icon = "trash",
    title = "Apagar esta nota?",
    description = "\"${title.trim().ifEmpty { "Sem título" }}\" é apagada deste telemóvel. Não dá para desfazer.",
    onDismiss = onDismiss,
  ) {
    DsButton("Apagar nota", onClick = onConfirm, variant = ButtonVariant.Destructive, modifier = Modifier.fillMaxWidth())
    DsButton("Cancelar", onClick = onDismiss, variant = ButtonVariant.Ghost, modifier = Modifier.fillMaxWidth())
  }
}
