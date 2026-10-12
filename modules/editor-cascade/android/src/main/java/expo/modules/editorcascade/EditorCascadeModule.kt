package expo.modules.editorcascade

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class EditorCascadeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EditorCascade")

    View(EditorCascadeView::class) {
      Events("onDocumentChange")

      // As funções de vista já correm na thread principal.
      AsyncFunction("getDocument") { view: EditorCascadeView ->
        view.currentDocument()
      }

      AsyncFunction("getMarkdown") { view: EditorCascadeView ->
        view.currentMarkdown()
      }
    }
  }
}
