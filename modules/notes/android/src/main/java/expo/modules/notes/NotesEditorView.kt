package expo.modules.notes

import android.annotation.SuppressLint
import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView
import expo.modules.notes.design.AppIcons
import expo.modules.notes.design.Ds
import expo.modules.notes.design.DsColors
import expo.modules.notes.design.DsFonts
import expo.modules.notes.design.LocalDs
import expo.modules.notes.model.DocumentCodec
import expo.modules.notes.model.Reference

/**
 * Props da vista. Nenhuma pode ter o nome de um estilo das Views do RN (ex.: `borderColor`):
 * esses são tratados pelo gestor base e rebentam se não forem do tipo esperado.
 */
data class NotesEditorProps(
  /** Muda quando o JS abre outra nota; só aí o título e o conteúdo inicial voltam a ser lidos. */
  val documentId: MutableState<String> = mutableStateOf(""),
  val initialDocument: MutableState<String> = mutableStateOf(""),
  val initialTitle: MutableState<String> = mutableStateOf(""),
  val editable: MutableState<Boolean> = mutableStateOf(true),
  val placeholder: MutableState<String> = mutableStateOf("Escreve, ou \"/\" para comandos"),
  /** `THEME[colorScheme]` de src/lib/theme.ts (mais `backdrop`), em JSON. */
  val theme: MutableState<String> = mutableStateOf("{}"),
  /** `APP_ICONS` de components/ui/app-icon.tsx, em JSON. */
  val icons: MutableState<String> = mutableStateOf("{}"),
  /** `NOTE_COLORS` de components/notes/colors.ts, em JSON. */
  val noteColors: MutableState<String> = mutableStateOf("[]"),
  /** JSON `[{ id, name, stage, detail }]`. */
  val students: MutableState<String> = mutableStateOf("[]"),
  /** JSON `[{ id, name }]`. */
  val tags: MutableState<String> = mutableStateOf("[]"),
  val tagId: MutableState<String?> = mutableStateOf(null),
  val color: MutableState<String?> = mutableStateOf(null),
  val studentId: MutableState<String?> = mutableStateOf(null),
  /** "Criada a … · editada hoje". */
  val stamp: MutableState<String> = mutableStateOf(""),
  /** "saving" ou "saved". */
  val saveStatus: MutableState<String> = mutableStateOf("saved"),
  val tagNameMax: MutableState<Int> = mutableStateOf(24),
  /** JSON `{ requestId, error }`: resposta do JS a criar/renomear uma etiqueta. */
  val tagsFeedback: MutableState<String> = mutableStateOf(""),
) : ComposeProps

class DocumentChangeEvent(@Field val document: String = "") : Record

class TitleChangeEvent(@Field val title: String = "") : Record

class ReferenceEvent(
  /** "student" ou "tag". */
  @Field val kind: String = "",
  @Field val id: String = "",
) : Record

class BackEvent(@Field val source: String = "button") : Record

class MetaChangeEvent(
  /** "tagId", "color" ou "studentId". */
  @Field val field: String = "",
  @Field val value: String? = null,
) : Record

class DeleteNoteEvent(@Field val source: String = "dialog") : Record

class TagCreateEvent(@Field val requestId: String = "", @Field val name: String = "") : Record

class TagRenameEvent(@Field val requestId: String = "", @Field val id: String = "", @Field val name: String = "") : Record

class TagDeleteEvent(@Field val id: String = "") : Record

/**
 * O ecrã inteiro da nota, em Compose, com os tokens do design system vindos do JS.
 * Vista autónoma (tem o seu próprio ComposeView), por isso não precisa do `<Host>` do @expo/ui.
 */
@SuppressLint("ViewConstructor")
class NotesEditorView(context: Context, appContext: AppContext) :
  ExpoComposeView<NotesEditorProps>(context, appContext, withHostingView = true) {
  override val props = NotesEditorProps()
  private val onDocumentChange by EventDispatcher<DocumentChangeEvent>()
  private val onTitleChange by EventDispatcher<TitleChangeEvent>()
  private val onReference by EventDispatcher<ReferenceEvent>()
  private val onBack by EventDispatcher<BackEvent>()
  private val onMetaChange by EventDispatcher<MetaChangeEvent>()
  private val onDeleteNote by EventDispatcher<DeleteNoteEvent>()
  private val onTagCreate by EventDispatcher<TagCreateEvent>()
  private val onTagRename by EventDispatcher<TagRenameEvent>()
  private val onTagDelete by EventDispatcher<TagDeleteEvent>()
  private var controller: EditorController? = null

  /** Documento atual em JSON, para o JS gravar ao sair sem esperar pelo debounce. */
  fun currentDocument(): String? = controller?.encode()

  fun currentTitle(): String? = controller?.title?.text

  @Composable
  override fun ComposableScope.Content() {
    val documentId = props.documentId.value
    val controller = remember(documentId) {
      EditorController(DocumentCodec.decode(props.initialDocument.value), props.initialTitle.value)
    }
    this@NotesEditorView.controller = controller

    // Etiqueta, cor e estudante: mudam já ao escolher e acompanham o que o JS devolve.
    val ui = remember(documentId) { NoteUiState() }
    val tagId = props.tagId.value
    val color = props.color.value
    val studentId = props.studentId.value
    LaunchedEffect(ui, tagId) { ui.tagId = tagId }
    LaunchedEffect(ui, color) { ui.color = color }
    LaunchedEffect(ui, studentId) { ui.studentId = studentId }

    val context = LocalContext.current
    val themeJson = props.theme.value
    val iconsJson = props.icons.value
    val fonts = remember { DsFonts.load(context.assets) }
    val ds = remember(themeJson, iconsJson, fonts) { Ds(DsColors.parse(themeJson), fonts, AppIcons.parse(iconsJson)) }

    val studentsJson = props.students.value
    val tagsJson = props.tags.value
    val colorsJson = props.noteColors.value
    val feedbackJson = props.tagsFeedback.value
    val students = remember(studentsJson) { Reference.parseList(studentsJson) }
    val tags = remember(tagsJson) { Reference.parseList(tagsJson) }
    val noteColors = remember(colorsJson) { EditorData.parseColors(colorsJson) }
    val feedback = remember(feedbackJson) { EditorData.parseFeedback(feedbackJson) }

    val data = EditorData(
      editable = props.editable.value,
      placeholder = props.placeholder.value,
      stamp = props.stamp.value,
      saving = props.saveStatus.value == "saving",
      students = students,
      tags = tags,
      noteColors = noteColors,
      tagNameMax = props.tagNameMax.value,
      tagsFeedback = feedback,
    )

    val callbacks = remember {
      EditorCallbacks(
        onDocumentChange = { json -> onDocumentChange(DocumentChangeEvent(json)) },
        onTitleChange = { title -> onTitleChange(TitleChangeEvent(title)) },
        onReference = { kind, reference -> onReference(ReferenceEvent(kind.value, reference.id)) },
        onBack = { onBack(BackEvent()) },
        onMetaChange = { field, value -> onMetaChange(MetaChangeEvent(field, value)) },
        onDeleteNote = { onDeleteNote(DeleteNoteEvent()) },
        onTagCreate = { requestId, name -> onTagCreate(TagCreateEvent(requestId, name)) },
        onTagRename = { requestId, id, name -> onTagRename(TagRenameEvent(requestId, id, name)) },
        onTagDelete = { id -> onTagDelete(TagDeleteEvent(id)) },
      )
    }

    CompositionLocalProvider(LocalDs provides ds) {
      EditorContent(controller, ui, data, callbacks)
    }
  }
}
