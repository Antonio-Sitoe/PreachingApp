import {
  applyTextEdit,
  convertTextBlock,
  editRange,
  emptyParagraph,
  hasStyle,
  isTextBlock,
  normalizeMarks,
  serializeBody,
  setStyle,
  shiftMarks,
  shortcutBlock,
  toggleStyle,
  wordAt,
  type Block,
  type InlineStyle,
  type Mark,
  type TextBlock,
  type TextBlockType,
} from '@/components/notes/body';
import { saveNote } from '@/components/notes/editors/save';
import { useEditorStore, type PickerMode } from '@/components/notes/editors/store';
import type { LinkableStudent } from '@/database/actions';
import { v4 as uuid } from 'uuid';

const state = () => useEditorStore.getState();

type WriteOptions = { focus?: string; cursor?: number };

function write(blocks: Block[], { focus, cursor }: WriteOptions = {}) {
  const body = serializeBody(blocks);
  state().set({
    blocks,
    body,
    ...(focus ? { focusedId: focus } : {}),
    ...(focus && cursor !== undefined ? { pendingCursor: { id: focus, position: cursor } } : {}),
  });
  saveNote({ body });
}

function replaceBlock(block: Block, options?: WriteOptions) {
  write(
    state().blocks.map((item) => (item.id === block.id ? block : item)),
    options
  );
}

function insertAfter(id: string | null, created: Block[], options?: WriteOptions) {
  const blocks = [...state().blocks];
  const index = id ? blocks.findIndex((item) => item.id === id) : -1;
  blocks.splice(index < 0 ? blocks.length : index + 1, 0, ...created);
  write(blocks, options);
}

function textBlockById(id: string | null) {
  const block = state().blocks.find((item) => item.id === id);
  return isTextBlock(block) ? block : null;
}

export function focusedBlock() {
  const { blocks, focusedId } = state();
  return blocks.find((block) => block.id === focusedId) ?? null;
}

function nextLineType(block: TextBlock): TextBlockType {
  return block.type === 'bullet' || block.type === 'task' ? block.type : 'paragraph';
}

function lineBlock(id: string, type: TextBlockType, text: string, marks: Mark[]): TextBlock {
  return type === 'task' ? { id, type, text, marks, done: false } : { id, type, text, marks };
}

export function changeText(blockId: string, value: string) {
  const block = textBlockById(blockId);
  if (!block) return;

  const previous = block.text;
  const { removedStart, removedEnd, inserted } = editRange(previous, value);
  let marks = applyTextEdit(previous, block.marks, value);

  const { typingStyles } = state();
  const typed = removedStart === removedEnd && inserted > 0;
  if (typed && Object.keys(typingStyles).length > 0) {
    for (const [style, on] of Object.entries(typingStyles) as [InlineStyle, boolean][]) {
      marks = setStyle(marks, style, removedStart, removedStart + inserted, on);
    }
    state().set({ typingStyles: {} });
  }

  if (value.includes('\n')) {
    if (previous === '' && value === '\n' && block.type !== 'paragraph') {
      replaceBlock(convertTextBlock(block, 'paragraph'), { focus: block.id, cursor: 0 });
      return;
    }

    const lines = value.split('\n');
    const created: TextBlock[] = [];
    let offset = 0;
    lines.forEach((line, index) => {
      const lineMarks = shiftMarks(marks, -offset, line.length);
      offset += line.length + 1;
      if (index === 0) {
        created.push({ ...block, text: line, marks: lineMarks });
      } else {
        created.push(lineBlock(uuid(), nextLineType(block), line, lineMarks));
      }
    });
    const first = shortcutBlock(created[0]) ?? created[0];
    const rest = created.slice(1);
    const blocks = [...state().blocks];
    const index = blocks.findIndex((item) => item.id === block.id);
    blocks.splice(index, 1, first, ...rest);

    const last = rest.at(-1) ?? first;
    const tail = previous.length - removedEnd;
    const cursor = isTextBlock(last) ? Math.max(0, last.text.length - tail) : 0;
    write(blocks, { focus: last.id, cursor });
    return;
  }

  const edited: TextBlock = { ...block, text: value, marks };
  const shortcut = shortcutBlock(edited);
  if (shortcut) {
    if (shortcut.type === 'divider') {
      const paragraph = emptyParagraph();
      const blocks = state().blocks.flatMap((item) => (item.id === block.id ? [shortcut, paragraph] : [item]));
      write(blocks, { focus: paragraph.id, cursor: 0 });
      return;
    }
    const stripped = value.length - (isTextBlock(shortcut) ? shortcut.text.length : 0);
    replaceBlock(shortcut, { focus: block.id, cursor: Math.max(0, removedStart + inserted - stripped) });
    return;
  }

  replaceBlock(edited);

  const typedAt = typed && inserted === 1 && value[removedStart] === '@';
  if (typedAt && (removedStart === 0 || /\s/.test(value[removedStart - 1]))) {
    state().set({ picker: { kind: 'mention', blockId: block.id, at: removedStart } });
  }
}

export function backspaceAtStart(blockId: string) {
  const { blocks, selection, focusedId } = state();
  const block = textBlockById(blockId);
  if (!block || focusedId !== blockId || selection.start !== 0 || selection.end !== 0) return;

  if (block.type !== 'paragraph') {
    replaceBlock(convertTextBlock(block, 'paragraph'), { focus: block.id, cursor: 0 });
    return;
  }

  const index = blocks.findIndex((item) => item.id === blockId);
  const previous = blocks[index - 1];
  if (!previous) return;

  if (previous.type === 'divider') {
    write(blocks.filter((item) => item.id !== previous.id), { focus: blockId, cursor: 0 });
    return;
  }

  if (isTextBlock(previous)) {
    const joined: TextBlock = {
      ...previous,
      text: previous.text + block.text,
      marks: normalizeMarks([
        ...previous.marks,
        ...shiftMarks(block.marks, previous.text.length, previous.text.length + block.text.length),
      ]),
    };
    write(
      blocks.filter((item) => item.id !== blockId).map((item) => (item.id === previous.id ? joined : item)),
      { focus: previous.id, cursor: previous.text.length }
    );
    return;
  }

  if (block.text === '') {
    write(blocks.filter((item) => item.id !== blockId), { focus: previous.id });
  }
}

export function toggleTask(blockId: string) {
  const block = textBlockById(blockId);
  if (block?.type === 'task') replaceBlock({ ...block, done: !block.done });
}

export function changeScripture(blockId: string, patch: { reference?: string; comment?: string }) {
  const block = state().blocks.find((item) => item.id === blockId);
  if (block?.type === 'scripture') replaceBlock({ ...block, ...patch });
}

export function removeBlock(blockId: string) {
  const { blocks } = state();
  if (blocks.length === 1) {
    write([emptyParagraph()]);
    return;
  }
  const index = blocks.findIndex((item) => item.id === blockId);
  const next = blocks.filter((item) => item.id !== blockId);
  write(next, { focus: next[Math.max(0, index - 1)]?.id });
}

export function focusEnd() {
  const { blocks } = state();
  const last = blocks.at(-1);
  if (isTextBlock(last)) {
    state().set({ focusedId: last.id, pendingCursor: { id: last.id, position: last.text.length } });
    return;
  }
  const paragraph = emptyParagraph();
  write([...blocks, paragraph], { focus: paragraph.id, cursor: 0 });
}

export function setBlockType(type: Exclude<TextBlockType, 'paragraph'>) {
  const block = focusedBlock();
  const cursor = state().selection.start;
  if (isTextBlock(block)) {
    const next = convertTextBlock(block, block.type === type ? 'paragraph' : type);
    replaceBlock(next, { focus: block.id, cursor });
    return;
  }
  const created = lineBlock(uuid(), type, '', []);
  insertAfter(block?.id ?? null, [created], { focus: created.id, cursor: 0 });
}

export function insertBlock(type: TextBlockType | 'scripture' | 'divider') {
  const current = focusedBlock();

  if (isTextBlock(current) && current.text === '' && type !== 'scripture' && type !== 'divider') {
    replaceBlock(convertTextBlock(current, type), { focus: current.id, cursor: 0 });
    return;
  }

  if (type === 'divider') {
    const paragraph = emptyParagraph();
    insertAfter(current?.id ?? null, [{ id: uuid(), type: 'divider' }, paragraph], {
      focus: paragraph.id,
      cursor: 0,
    });
    return;
  }

  const created: Block =
    type === 'scripture'
      ? { id: uuid(), type: 'scripture', reference: '', comment: '' }
      : lineBlock(uuid(), type, '', []);
  insertAfter(current?.id ?? null, [created], { focus: created.id, cursor: 0 });
}

export function toggleInline(style: InlineStyle) {
  const block = focusedBlock();
  if (!isTextBlock(block)) return;
  const { selection, typingStyles } = state();
  const start = Math.min(selection.start, selection.end);
  const end = Math.max(selection.start, selection.end);

  if (end > start) {
    replaceBlock({ ...block, marks: toggleStyle(block.marks, style, start, end) }, { focus: block.id });
    return;
  }

  const word = wordAt(block.text, start);
  if (word) {
    replaceBlock({ ...block, marks: toggleStyle(block.marks, style, word.start, word.end) }, { focus: block.id });
    return;
  }

  const current = typingStyles[style] ?? hasStyle(block.marks, style, start, start);
  state().set({ typingStyles: { ...typingStyles, [style]: !current } });
}

export function isInlineActive(block: Block | null, style: InlineStyle) {
  if (!isTextBlock(block)) return false;
  const { selection, typingStyles } = state();
  if (typingStyles[style] !== undefined) return typingStyles[style];
  const start = Math.min(selection.start, selection.end);
  const end = Math.max(selection.start, selection.end);
  return hasStyle(block.marks, style, start, end);
}

export function openMentionPicker() {
  state().set({ picker: { kind: 'mention', blockId: state().focusedId, at: null } });
}

export function linkStudent(student: LinkableStudent | null) {
  state().set({ studentId: student?.id ?? null, student });
  saveNote({ studentId: student?.id ?? null });
}

export function insertMention(student: LinkableStudent, mode: Extract<PickerMode, { kind: 'mention' }>) {
  const label = `@${student.name}`;
  const block = textBlockById(mode.blockId);

  if (!block) {
    const paragraph: TextBlock = {
      id: uuid(),
      type: 'paragraph',
      text: `${label} `,
      marks: [{ type: 'mention', start: 0, end: label.length, studentId: student.id }],
    };
    insertAfter(state().focusedId, [paragraph], { focus: paragraph.id, cursor: paragraph.text.length });
  } else {
    const { selection, focusedId } = state();
    const replacesAt = mode.at !== null && block.text[mode.at] === '@';
    let start: number;
    let end: number;
    if (replacesAt) {
      start = mode.at as number;
      end = start + 1;
    } else if (focusedId === block.id) {
      start = Math.min(selection.start, selection.end);
      end = Math.max(selection.start, selection.end);
    } else {
      start = block.text.length;
      end = start;
    }

    const before = block.text.slice(0, start);
    const lead = before === '' || /\s$/.test(before) ? '' : ' ';
    const text = `${before}${lead}${label} ${block.text.slice(end)}`;
    const mentionStart = start + lead.length;
    const mentionEnd = mentionStart + label.length;
    const marks = applyTextEdit(block.text, block.marks, text).filter(
      (mark) => mark.end <= mentionStart || mark.start >= mentionEnd || mark.type !== 'mention'
    );
    replaceBlock(
      {
        ...block,
        text,
        marks: normalizeMarks([
          ...setStyle(setStyle(marks, 'bold', mentionStart, mentionEnd, false), 'italic', mentionStart, mentionEnd, false),
          { type: 'mention', start: mentionStart, end: mentionEnd, studentId: student.id },
        ]),
      },
      { focus: block.id, cursor: mentionEnd + 1 }
    );
  }

  if (!state().studentId) linkStudent(student);
}
