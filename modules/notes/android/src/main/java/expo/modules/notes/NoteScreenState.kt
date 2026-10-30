package expo.modules.notes

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import expo.modules.notes.model.Reference
import expo.modules.notes.model.ReferenceKind
import org.json.JSONArray
import org.json.JSONObject

enum class Sheet { Options, Tags, Student, Insert }

/**
 * Etiqueta, cor e estudante da nota, e a folha aberta. A etiqueta, a cor e o estudante vêm do JS
 * (props), mas mudam logo aqui quando se escolhem, sem esperar que o JS os devolva.
 */
@Stable
class NoteUiState {
  var tagId by mutableStateOf<String?>(null)
  var color by mutableStateOf<String?>(null)
  var studentId by mutableStateOf<String?>(null)
  var sheet by mutableStateOf<Sheet?>(null)
  var confirmDelete by mutableStateOf(false)
}

@Immutable
data class NoteColor(val name: String, val label: String, val color: String)

/** Resposta do JS a criar/renomear uma etiqueta: `error` nulo quando correu bem. */
@Immutable
data class TagsFeedback(val requestId: String, val error: String?)

/** Dados que vêm do JS e não mudam a estrutura do documento. */
@Immutable
data class EditorData(
  val editable: Boolean,
  val placeholder: String,
  val stamp: String,
  val saving: Boolean,
  val students: List<Reference>,
  val tags: List<Reference>,
  val noteColors: List<NoteColor>,
  val tagNameMax: Int,
  val tagsFeedback: TagsFeedback?,
) {
  companion object {
    fun parseColors(json: String?): List<NoteColor> = try {
      val array = JSONArray(json?.takeIf { it.isNotBlank() } ?: "[]")
      (0 until array.length()).mapNotNull { index ->
        array.optJSONObject(index)?.let { NoteColor(it.optString("name"), it.optString("label"), it.optString("color")) }
      }
    } catch (_: Exception) {
      emptyList()
    }

    fun parseFeedback(json: String?): TagsFeedback? = try {
      json?.takeIf { it.isNotBlank() }?.let { JSONObject(it) }?.let {
        TagsFeedback(it.optString("requestId"), if (it.isNull("error")) null else it.optString("error"))
      }
    } catch (_: Exception) {
      null
    }
  }
}

/** Tudo o que o ecrã avisa o JS (eventos da vista). */
class EditorCallbacks(
  val onDocumentChange: (String) -> Unit,
  val onTitleChange: (String) -> Unit,
  val onReference: (ReferenceKind, Reference) -> Unit,
  val onBack: () -> Unit,
  /** `field` é "tagId", "color" ou "studentId"; `value` nulo tira a etiqueta/estudante. */
  val onMetaChange: (field: String, value: String?) -> Unit,
  val onDeleteNote: () -> Unit,
  val onTagCreate: (requestId: String, name: String) -> Unit,
  val onTagRename: (requestId: String, id: String, name: String) -> Unit,
  val onTagDelete: (id: String) -> Unit,
)
