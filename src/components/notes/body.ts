import { v4 as uuid } from 'uuid';

export type InlineStyle = 'bold' | 'italic';

export type Mark =
  | { type: InlineStyle; start: number; end: number }
  | { type: 'mention'; start: number; end: number; studentId: string };

export type TextBlockType = 'paragraph' | 'heading' | 'bullet' | 'task';

export type TextBlock =
  | { id: string; type: 'paragraph' | 'heading' | 'bullet'; text: string; marks: Mark[] }
  | { id: string; type: 'task'; text: string; marks: Mark[]; done: boolean };

export type ScriptureBlock = { id: string; type: 'scripture'; reference: string; comment: string };

export type Block = TextBlock | ScriptureBlock | { id: string; type: 'divider' };

export function isTextBlock(block: Block | null | undefined): block is TextBlock {
  return !!block && 'text' in block;
}

export function emptyParagraph(): Block {
  return { id: uuid(), type: 'paragraph', text: '', marks: [] };
}

export function convertTextBlock(block: TextBlock, type: TextBlockType): TextBlock {
  const base = { id: block.id, text: block.text, marks: block.marks };
  if (type === 'task') return { ...base, type, done: block.type === 'task' ? block.done : false };
  return { ...base, type };
}

export function parseInline(source: string): { text: string; marks: Mark[] } {
  let text = '';
  const marks: Mark[] = [];
  const open: Record<InlineStyle, number | null> = { bold: null, italic: null };
  let index = 0;

  function toggle(type: InlineStyle) {
    const start = open[type];
    if (start === null) {
      open[type] = text.length;
      return;
    }
    if (text.length > start) marks.push({ type, start, end: text.length });
    open[type] = null;
  }

  while (index < source.length) {
    const char = source[index];
    if (char === '\\' && index + 1 < source.length) {
      text += source[index + 1];
      index += 2;
      continue;
    }
    if (source.startsWith('**', index)) {
      toggle('bold');
      index += 2;
      continue;
    }
    if (char === '_') {
      toggle('italic');
      index += 1;
      continue;
    }
    if (source.startsWith('@[', index)) {
      const mention = /^@\[([^\]]*)\]\(([^)]*)\)/.exec(source.slice(index));
      if (mention) {
        const start = text.length;
        text += `@${mention[1]}`;
        marks.push({ type: 'mention', start, end: text.length, studentId: mention[2] });
        index += mention[0].length;
        continue;
      }
    }
    text += char;
    index += 1;
  }

  for (const type of ['bold', 'italic'] as const) {
    const start = open[type];
    if (start !== null && text.length > start) marks.push({ type, start, end: text.length });
  }

  return { text, marks: normalizeMarks(marks) };
}

function escapeChar(text: string, index: number) {
  const char = text[index];
  if (char === '\\' || char === '*' || char === '_') return `\\${char}`;
  if (char === '@' && text[index + 1] === '[') return '\\@';
  return char;
}

function covers(marks: Mark[], type: Mark['type'], position: number) {
  return marks.some((mark) => mark.type === type && mark.start <= position && position < mark.end);
}

export function serializeInline(text: string, marks: Mark[]) {
  let out = '';
  let bold = false;
  let italic = false;
  let index = 0;

  while (index <= text.length) {
    const inside = index < text.length;
    const wantBold = inside && covers(marks, 'bold', index);
    const wantItalic = inside && covers(marks, 'italic', index);

    if (italic && !wantItalic) {
      out += '_';
      italic = false;
    }
    if (bold !== wantBold) {
      out += '**';
      bold = wantBold;
    }
    if (!italic && wantItalic) {
      out += '_';
      italic = true;
    }
    if (!inside) break;

    const mention = marks.find(
      (mark): mark is Extract<Mark, { type: 'mention' }> => mark.type === 'mention' && mark.start === index
    );
    if (mention) {
      const label = text.slice(mention.start, mention.end).replace(/^@/, '').replace(/[\]\n]/g, '');
      out += `@[${label}](${mention.studentId})`;
      index = mention.end;
      continue;
    }

    out += escapeChar(text, index);
    index += 1;
  }

  return out;
}

export function normalizeMarks(marks: Mark[]): Mark[] {
  const mentions = marks.filter((mark) => mark.type === 'mention' && mark.end > mark.start);
  const merged: Mark[] = [];
  for (const type of ['bold', 'italic'] as const) {
    const ranges = marks
      .filter((mark) => mark.type === type && mark.end > mark.start)
      .sort((a, b) => a.start - b.start);
    for (const range of ranges) {
      const last = merged.at(-1);
      if (last && last.type === type && range.start <= last.end) {
        last.end = Math.max(last.end, range.end);
      } else {
        merged.push({ type, start: range.start, end: range.end });
      }
    }
  }
  return [...merged, ...mentions].sort((a, b) => a.start - b.start);
}

export function editRange(previous: string, next: string) {
  let prefix = 0;
  while (prefix < previous.length && prefix < next.length && previous[prefix] === next[prefix]) prefix += 1;
  let suffix = 0;
  while (
    suffix < previous.length - prefix &&
    suffix < next.length - prefix &&
    previous[previous.length - 1 - suffix] === next[next.length - 1 - suffix]
  ) {
    suffix += 1;
  }
  return { removedStart: prefix, removedEnd: previous.length - suffix, inserted: next.length - suffix - prefix };
}

export function applyTextEdit(previous: string, marks: Mark[], next: string): Mark[] {
  const { removedStart, removedEnd, inserted } = editRange(previous, next);
  const delta = inserted - (removedEnd - removedStart);

  function move(position: number, isEnd: boolean) {
    if (position < removedStart) return position;
    if (position > removedEnd) return position + delta;
    if (removedStart === removedEnd) return position + inserted;
    return isEnd ? removedStart + inserted : removedStart;
  }

  const moved: Mark[] = [];
  for (const mark of marks) {
    if (mark.type === 'mention') {
      if (mark.end <= removedStart) moved.push(mark);
      else if (mark.start >= removedEnd) moved.push({ ...mark, start: mark.start + delta, end: mark.end + delta });
      continue;
    }
    moved.push({ ...mark, start: move(mark.start, false), end: move(mark.end, true) });
  }
  return normalizeMarks(moved);
}

export function shiftMarks(marks: Mark[], offset: number, length: number): Mark[] {
  return normalizeMarks(
    marks
      .map((mark) => ({ ...mark, start: Math.max(0, mark.start + offset), end: Math.min(length, mark.end + offset) }))
      .filter((mark) => mark.end > mark.start)
  );
}

export function hasStyle(marks: Mark[], type: InlineStyle, start: number, end: number) {
  if (start === end) return start > 0 && covers(marks, type, start - 1);
  for (let position = start; position < end; position += 1) {
    if (!covers(marks, type, position)) return false;
  }
  return true;
}

export function toggleStyle(marks: Mark[], type: InlineStyle, start: number, end: number): Mark[] {
  return setStyle(marks, type, start, end, !hasStyle(marks, type, start, end));
}

export function setStyle(marks: Mark[], type: InlineStyle, start: number, end: number, on: boolean): Mark[] {
  if (end <= start) return marks;
  if (on) return normalizeMarks([...marks, { type, start, end }]);
  const next: Mark[] = [];
  for (const mark of marks) {
    if (mark.type !== type || mark.end <= start || mark.start >= end) {
      next.push(mark);
      continue;
    }
    if (mark.start < start) next.push({ type, start: mark.start, end: start });
    if (mark.end > end) next.push({ type, start: end, end: mark.end });
  }
  return normalizeMarks(next);
}

export function wordAt(text: string, position: number): { start: number; end: number } | null {
  const isWord = (char: string | undefined) => !!char && /[\p{L}\p{N}'’-]/u.test(char);
  let start = position;
  let end = position;
  while (start > 0 && isWord(text[start - 1])) start -= 1;
  while (end < text.length && isWord(text[end])) end += 1;
  return end > start ? { start, end } : null;
}

export type Segment = { text: string; bold: boolean; italic: boolean; mention: boolean };

export function segments(text: string, marks: Mark[]): Segment[] {
  const cuts = new Set([0, text.length]);
  for (const mark of marks) {
    cuts.add(Math.min(mark.start, text.length));
    cuts.add(Math.min(mark.end, text.length));
  }
  const points = [...cuts].sort((a, b) => a - b);
  const parts: Segment[] = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (end <= start) continue;
    parts.push({
      text: text.slice(start, end),
      bold: covers(marks, 'bold', start),
      italic: covers(marks, 'italic', start),
      mention: covers(marks, 'mention', start),
    });
  }
  return parts;
}

function textBlock(type: 'paragraph' | 'heading' | 'bullet', source: string): TextBlock {
  return { id: uuid(), type, ...parseInline(source) };
}

export function parseBody(body: string): Block[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.trim() === '---') {
      blocks.push({ id: uuid(), type: 'divider' });
      index += 1;
      continue;
    }

    if (line.startsWith(':::scripture')) {
      index += 1;
      const chunk: string[] = [];
      while (index < lines.length && lines[index].trim() !== ':::') {
        chunk.push(lines[index].replace(/^\\:::/, ':::'));
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push({
        id: uuid(),
        type: 'scripture',
        reference: (chunk[0] ?? '').trim(),
        comment: chunk.slice(1).join('\n').trim(),
      });
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(textBlock('heading', line.slice(2)));
      index += 1;
      continue;
    }

    const task = /^- \[([ xX])\] ?(.*)$/.exec(line);
    if (task) {
      blocks.push({ id: uuid(), type: 'task', done: task[1].toLowerCase() === 'x', ...parseInline(task[2]) });
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      blocks.push(textBlock('bullet', line.slice(2)));
      index += 1;
      continue;
    }

    blocks.push(textBlock('paragraph', line));
    index += 1;
  }

  return blocks.length > 0 ? blocks : [emptyParagraph()];
}

function escapeParagraph(source: string) {
  return /^(# |- |---|:::)/.test(source) ? `\\${source}` : source;
}

export function serializeBody(blocks: Block[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'heading':
          return `# ${serializeInline(block.text, block.marks)}`;
        case 'bullet': {
          const source = serializeInline(block.text, block.marks);
          return `- ${source.startsWith('[') ? `\\${source}` : source}`;
        }
        case 'task':
          return `- [${block.done ? 'x' : ' '}] ${serializeInline(block.text, block.marks)}`;
        case 'divider':
          return '---';
        case 'scripture': {
          const comment = block.comment
            .split('\n')
            .map((line) => (line.trim() === ':::' ? `\\${line}` : line))
            .join('\n');
          return `:::scripture\n${block.reference.replace(/\n/g, ' ')}\n${comment}\n:::`;
        }
        case 'paragraph':
          return escapeParagraph(serializeInline(block.text, block.marks));
      }
    })
    .join('\n\n');
}

export function shortcutBlock(block: TextBlock): Block | null {
  if (block.type !== 'paragraph') return null;
  const { id, text, marks } = block;
  const strip = (length: number) => ({ text: text.slice(length), marks: shiftMarks(marks, -length, text.length - length) });

  if (text === '---') return { id, type: 'divider' };
  if (text === '[]' || text.startsWith('[] ')) {
    return { id, type: 'task', done: false, ...strip(text === '[]' ? 2 : 3) };
  }
  if (text.startsWith('# ')) return { id, type: 'heading', ...strip(2) };
  if (text.startsWith('- ')) return { id, type: 'bullet', ...strip(2) };
  return null;
}

export function plainBody(body: string) {
  return parseBody(body)
    .flatMap((block) => {
      if (block.type === 'divider') return [];
      if (block.type === 'scripture') return [block.reference, block.comment];
      return [block.text];
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
