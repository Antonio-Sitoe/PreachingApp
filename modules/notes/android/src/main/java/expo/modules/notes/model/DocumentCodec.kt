package expo.modules.notes.model

import org.json.JSONArray
import org.json.JSONObject

/**
 * Formato guardado em `notes.body`:
 * `{ "version": 2, "blocks": [{ "id", "type", "markdown", "checked"? }] }`.
 * Cada bloco leva o seu conteúdo em Markdown, o que deixa exportar e pesquisar sem o editor.
 * Também lê a versão 1 (editor v3), onde o título era só `heading`.
 */
object DocumentCodec {
  const val VERSION = 2

  fun decode(json: String?): List<BlockState> {
    val blocks = try {
      val array = json?.takeIf { it.isNotBlank() }?.let { JSONObject(it).optJSONArray("blocks") }
      if (array == null) emptyList() else (0 until array.length()).mapNotNull { index ->
        array.optJSONObject(index)?.let(::decodeBlock)
      }
    } catch (_: Exception) {
      emptyList()
    }
    return blocks.ifEmpty { listOf(BlockState()) }
  }

  fun encode(blocks: List<BlockState>): String {
    val array = JSONArray()
    blocks.forEach { block ->
      val item = JSONObject()
        .put("id", block.id)
        .put("type", block.type.value)
        .put("markdown", block.toMarkdown())
      if (block.type == BlockType.CHECKLIST) item.put("checked", block.checked)
      array.put(item)
    }
    return JSONObject().put("version", VERSION).put("blocks", array).toString()
  }

  private fun decodeBlock(item: JSONObject): BlockState =
    BlockState.fromMarkdown(
      id = item.optString("id"),
      type = BlockType.from(item.optString("type")),
      markdown = item.optString("markdown"),
      checked = item.optBoolean("checked", false),
    )
}
