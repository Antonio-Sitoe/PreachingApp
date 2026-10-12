package expo.modules.editorv3

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import expo.modules.editorv3.model.DocumentCodec
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView

data class EditorV3Props(
  /** Muda quando o JS abre outro documento; só aí o conteúdo inicial volta a ser lido. */
  val documentId: MutableState<String> = mutableStateOf(""),
  val initialDocument: MutableState<String> = mutableStateOf(""),
  val editable: MutableState<Boolean> = mutableStateOf(true),
  val placeholder: MutableState<String> = mutableStateOf("Escreve, ou \"/\" para comandos"),
  val foregroundColor: MutableState<String?> = mutableStateOf(null),
  val mutedColor: MutableState<String?> = mutableStateOf(null),
  val primaryColor: MutableState<String?> = mutableStateOf(null),
  val surfaceColor: MutableState<String?> = mutableStateOf(null),
  val cardColor: MutableState<String?> = mutableStateOf(null),
  val borderColor: MutableState<String?> = mutableStateOf(null),
  val destructiveColor: MutableState<String?> = mutableStateOf(null),
) : ComposeProps

class DocumentChangeEvent(
  @Field val document: String = "",
) : Record

/**
 * Vista autónoma (tem o seu próprio ComposeView), por isso não precisa do `<Host>` do @expo/ui.
 */
@SuppressLint("ViewConstructor")
class EditorV3View(context: Context, appContext: AppContext) :
  ExpoComposeView<EditorV3Props>(context, appContext, withHostingView = true) {
  override val props = EditorV3Props()
  private val onDocumentChange by EventDispatcher<DocumentChangeEvent>()
  private var controller: EditorController? = null

  /** Documento atual em JSON, para o JS gravar ao sair sem esperar pelo debounce. */
  fun currentDocument(): String? = controller?.encode()

  @Composable
  override fun ComposableScope.Content() {
    val documentId = props.documentId.value
    val controller = remember(documentId) {
      EditorController(DocumentCodec.decode(props.initialDocument.value))
    }
    this@EditorV3View.controller = controller

    val colors = EditorColors(
      foreground = parseColor(props.foregroundColor.value, Color(0xFF1E1E1E)),
      muted = parseColor(props.mutedColor.value, Color(0xFF6B7080)),
      primary = parseColor(props.primaryColor.value, Color(0xFF5D6CB2)),
      surface = parseColor(props.surfaceColor.value, Color(0xFFF1F2F5)),
      card = parseColor(props.cardColor.value, Color(0xFFFFFFFF)),
      border = parseColor(props.borderColor.value, Color(0xFFE4E4E4)),
      destructive = parseColor(props.destructiveColor.value, Color(0xFFC7256B)),
    )

    EditorV3Content(
      controller = controller,
      colors = colors,
      editable = props.editable.value,
      placeholder = props.placeholder.value,
      onDocumentChange = { json -> onDocumentChange(DocumentChangeEvent(json)) },
    )
  }
}
