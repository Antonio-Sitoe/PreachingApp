type NoteBlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bullet'
  | 'checklist'
  | 'quote'
  | 'code'
  | 'divider';

export type NoteBlock = {
  id?: string;
  type: NoteBlockType;
  markdown: string;
  checked?: boolean;
};

export type NoteDocument = { version: number; blocks: NoteBlock[] };

type ReferenceKind = 'student' | 'tag';

export function referenceUrl(kind: ReferenceKind, id: string) {
  return `preaching://${kind}/${id}`;
}

export function isDocumentBody(body: string) {
  return parseDocument(body) !== null;
}

export function parseDocument(body: string): NoteDocument | null {
  if (!body.trimStart().startsWith('{')) return null;
  try {
    const value = JSON.parse(body) as Partial<NoteDocument>;
    return Array.isArray(value.blocks) ? { version: value.version ?? 1, blocks: value.blocks } : null;
  } catch {
    return null;
  }
}

export function stripMarkdown(markdown: string) {
  const escaped: string[] = [];
  return markdown
    .replace(/\\([\\*_~`[\]<>])/g, (_, char: string) => `\u0000${escaped.push(char) - 1}\u0000`)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<\/?u>/g, '')
    .replace(/(\*\*|__|~~|[*_`])/g, '')
    .replace(/\u0000(\d+)\u0000/g, (_, index: string) => escaped[Number(index)]);
}
