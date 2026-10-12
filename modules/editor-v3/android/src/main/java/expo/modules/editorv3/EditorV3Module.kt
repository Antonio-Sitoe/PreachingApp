package expo.modules.editorv3

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class EditorV3Module : Module() {
  override fun definition() = ModuleDefinition {
    Name("EditorV3")

    View(EditorV3View::class) {
      Events("onDocumentChange")

      // As funções de vista já correm na thread principal.
      AsyncFunction("getDocument") { view: EditorV3View ->
        view.currentDocument()
      }
    }
  }
}
