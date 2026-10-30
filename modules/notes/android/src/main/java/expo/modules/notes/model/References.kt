package expo.modules.notes.model

import androidx.compose.runtime.Immutable
import org.json.JSONArray
import java.text.Normalizer

/** O que se pode referir no texto: `@` estudantes e `#` tags. */
enum class ReferenceKind(val trigger: Char, val value: String, val scheme: String) {
  STUDENT('@', "student", "preaching://student/"),
  TAG('#', "tag", "preaching://tag/");

  companion object {
    fun from(trigger: Char): ReferenceKind? = entries.firstOrNull { it.trigger == trigger }
  }
}

/** Um estudante ou uma tag, vindos do JS (`students` / `tags`, JSON `[{ id, name, detail?, stage? }]`). */
@Immutable
data class Reference(val id: String, val name: String, val detail: String? = null, val stage: String? = null) {
  val searchKey: String = normalize(name)

  companion object {
    fun parseList(json: String?): List<Reference> = try {
      val array = JSONArray(json?.takeIf { it.isNotBlank() } ?: "[]")
      (0 until array.length()).mapNotNull { index ->
        val item = array.optJSONObject(index) ?: return@mapNotNull null
        val id = item.optString("id")
        val name = item.optString("name")
        if (id.isBlank() || name.isBlank()) null else Reference(id, name, item.optString("detail").ifBlank { null }, item.optString("stage").ifBlank { null })
      }
    } catch (_: Exception) {
      emptyList()
    }
  }
}

/** `@jo` ou `#fam` a ser escrito: de [start] (o `@`/`#`) até ao cursor ([end]). */
@Immutable
data class TriggerQuery(val kind: ReferenceKind, val start: Int, val end: Int, val query: String)

/**
 * Procura um `@`/`#` antes do cursor, no início do texto ou depois de um espaço, seguido só de
 * letras (sem espaços). `# ` com espaço não conta: é o atalho de título.
 */
fun findTrigger(text: String, cursor: Int): TriggerQuery? {
  if (cursor <= 0 || cursor > text.length) return null
  val before = text.substring(0, cursor)
  val at = before.lastIndexOfAny(charArrayOf('@', '#'))
  if (at < 0) return null
  if (at > 0 && !before[at - 1].isWhitespace()) return null
  val kind = ReferenceKind.from(before[at]) ?: return null
  val query = before.substring(at + 1)
  if (query.length > 30 || query.any { it.isWhitespace() }) return null
  if (kind == ReferenceKind.TAG && (query.isEmpty() || !query.first().isLetter())) return null
  return TriggerQuery(kind, at, cursor, query)
}

fun List<Reference>.matching(query: String, limit: Int = 6): List<Reference> {
  val key = normalize(query)
  return (if (key.isEmpty()) this else filter { it.searchKey.contains(key) }).take(limit)
}

/** Minúsculas e sem acentos, como o `normalizeSearch` do JS. */
internal fun normalize(value: String): String =
  Normalizer.normalize(value, Normalizer.Form.NFD)
    .replace(Regex("\\p{Mn}+"), "")
    .lowercase()
    .trim()
