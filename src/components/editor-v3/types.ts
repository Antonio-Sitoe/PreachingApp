/**
 * Formato do editor v3. Igual ao que o Kotlin lê e escreve em
 * modules/editor-v3/android/.../model/DocumentCodec.kt: muda os dois ao mesmo tempo.
 */
export type EditorV3BlockType = 'heading' | 'paragraph' | 'checklist' | 'code';

export type EditorV3Block = {
  id: string;
  type: EditorV3BlockType;
  /** Conteúdo do bloco em Markdown (no código, o texto tal como está). */
  markdown: string;
  checked?: boolean;
};

/** O que o editor nativo envia em cada alteração. */
export type EditorV3Content = {
  version: 1;
  blocks: EditorV3Block[];
};

export type EditorV3Document = EditorV3Content & {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};
