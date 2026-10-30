package expo.modules.notes

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NotesModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Notes")

    View(NotesEditorView::class) {
      Events(
        "onDocumentChange",
        "onTitleChange",
        "onReference",
        "onBack",
        "onMetaChange",
        "onDeleteNote",
        "onTagCreate",
        "onTagRename",
        "onTagDelete",
      )

      // As funções de vista já correm na thread principal.
      AsyncFunction("getDocument") { view: NotesEditorView ->
        view.currentDocument()
      }

      AsyncFunction("getTitle") { view: NotesEditorView ->
        view.currentTitle()
      }
    }
  }
}
