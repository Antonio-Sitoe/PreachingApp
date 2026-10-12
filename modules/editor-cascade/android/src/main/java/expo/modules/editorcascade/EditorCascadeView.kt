package expo.modules.editorcascade

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalUriHandler
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import io.github.linreal.cascade.editor.core.Block
import io.github.linreal.cascade.editor.markdown.toMarkdown
import io.github.linreal.cascade.editor.serialization.loadFromJson
import io.github.linreal.cascade.editor.serialization.resolveDocumentBlocks
import io.github.linreal.cascade.editor.serialization.toJson
import io.github.linreal.cascade.editor.state.BlockSpanStates
import io.github.linreal.cascade.editor.state.BlockTextStates
import io.github.linreal.cascade.editor.state.EditorState
import io.github.linreal.cascade.editor.state.EditorStateHolder
import io.github.linreal.cascade.editor.theme.CascadeEditorTheme
import io.github.linreal.cascade.editor.ui.CascadeEditor
import io.github.linreal.cascade.editor.ui.CascadeEditorConfig
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.drop

data class EditorCascadeProps(
  /** Muda quando o JS abre outro documento; só aí o conteúdo inicial volta a ser lido. */
  val documentId: MutableState<String> = mutableStateOf(""),
  /** JSON do próprio Cascade Editor (`toJson`); vazio começa com um parágrafo. */
  val initialDocument: MutableState<String> = mutableStateOf(""),
  val editable: MutableState<Boolean> = mutableStateOf(true),
  val dark: MutableState<Boolean> = mutableStateOf(false),
  val foregroundColor: MutableState<String?> = mutableStateOf(null),
  val primaryColor: MutableState<String?> = mutableStateOf(null),
) : ComposeProps

class DocumentChangeEvent(
  @Field val document: String = "",
) : Record

/** O que o Cascade Editor precisa para um documento: o estado dos blocos e o texto de cada um. */
private class CascadeDocument(initialJson: String) {
  val textStates = BlockTextStates()
  val spanStates = BlockSpanStates()
  val holder = EditorStateHolder(EditorState.withBlocks(listOf(Block.paragraph())))

  init {
    // loadFromJson não lança: um JSON inválido dá um documento vazio com avisos.
    if (initialJson.isNotBlank()) holder.loadFromJson(initialJson, textStates, spanStates)
  }

  /** Blocos com o texto e a formatação atuais, sem passar por JSON (comparáveis com ==). */
  fun blocks(): List<Block> = holder.resolveDocumentBlocks(textStates, spanStates)

  fun toJson(): String = holder.toJson(textStates, spanStates)

  fun toMarkdown(): String? = holder.toMarkdown(textStates, spanStates)
}

/**
 * Vista autónoma (tem o seu próprio ComposeView), por isso não precisa do `<Host>` do @expo/ui.
 */
@SuppressLint("ViewConstructor")
class EditorCascadeView(context: Context, appContext: AppContext) :
  ExpoComposeView<EditorCascadeProps>(context, appContext, withHostingView = true) {
  override val props = EditorCascadeProps()
  private val onDocumentChange by EventDispatcher<DocumentChangeEvent>()
  private var document: CascadeDocument? = null

  /** Documento atual em JSON, para o JS gravar ao sair sem esperar pelo debounce. */
  fun currentDocument(): String? = document?.toJson()

  fun currentMarkdown(): String? = document?.toMarkdown()

  @OptIn(FlowPreview::class)
  @Composable
  override fun ComposableScope.Content() {
    val documentId = props.documentId.value
    val document = remember(documentId) { CascadeDocument(props.initialDocument.value) }
    this@EditorCascadeView.document = document

    val dark = props.dark.value
    val foreground = parseColor(props.foregroundColor.value)
    val primary = parseColor(props.primaryColor.value)
    val theme = remember(dark, foreground, primary) {
      val base = if (dark) CascadeEditorTheme.dark() else CascadeEditorTheme.light()
      base.copy(
        colors = base.colors.copy(
          text = foreground ?: base.colors.text,
          primary = primary ?: base.colors.primary,
          cursor = primary ?: base.colors.cursor,
        ),
      )
    }

    // O texto escrito vive nos TextFieldState de cada bloco e não muda o EditorState, por isso
    // observam-se os blocos resolvidos (estrutura + texto + spans) e só se gera o JSON no fim.
    val emit = rememberUpdatedState { json: String -> onDocumentChange(DocumentChangeEvent(json)) }
    LaunchedEffect(document) {
      snapshotFlow { document.blocks() }
        .distinctUntilChanged()
        .drop(1)
        .debounce(800)
        .collect { emit.value(document.toJson()) }
    }

    val uriHandler = LocalUriHandler.current
    CascadeEditor(
      stateHolder = document.holder,
      textStates = document.textStates,
      spanStates = document.spanStates,
      theme = theme,
      onOpenLink = { url -> runCatching { uriHandler.openUri(url) } },
      config = CascadeEditorConfig(
        readOnly = !props.editable.value,
        emptyDocumentPlaceholderEnabled = true,
      ),
      // Igual ao editor v3: a app é edge-to-edge, o teclado não encolhe a vista do RN.
      modifier = Modifier
        .fillMaxSize()
        .windowInsetsPadding(WindowInsets.ime.union(WindowInsets.navigationBars)),
    )
  }
}

private fun parseColor(value: String?): Color? =
  try {
    if (value.isNullOrBlank()) null else Color(android.graphics.Color.parseColor(value))
  } catch (_: IllegalArgumentException) {
    null
  }
