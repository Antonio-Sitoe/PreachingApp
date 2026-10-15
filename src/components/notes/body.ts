import {
  isDocumentBody,
  parseDocument,
  referenceUrl,
  stripMarkdown,
  type NoteBlock,
  type NoteDocument,
} from '@/components/notes/document';

type InlineStyle = 'bold' | 'italic';

type Mark =
  | { type: InlineStyle; start: number; end: number }
  | { type: 'mention'; start: number; end: number; studentId: string };

type LegacyBlock =
  | { type: 'paragraph' | 'heading' | 'bullet'; text: string; marks: Mark[] }
  | { type: 'task'; text: string; marks: Mark[]; done: boolean }
  | { type: 'scripture'; reference: string; comment: string }
  | { type: 'divider' };

function isHtmlBody(body: string) {
  return body.trimStart().startsWith('<html>');
}

function covers(marks: Mark[], type: Mark['type'], position: number) {
  return marks.some((mark) => mark.type === type && mark.start <= position && position < mark.end);
}

function normalizeMarks(marks: Mark[]): Mark[] {
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

function parseInline(source: string): { text: string; marks: Mark[] } {
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

function parseLegacyBody(body: string): LegacyBlock[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const blocks: LegacyBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.trim() === '---') {
      blocks.push({ type: 'divider' });
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
        type: 'scripture',
        reference: (chunk[0] ?? '').trim(),
        comment: chunk.slice(1).join('\n').trim(),
      });
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', ...parseInline(line.slice(2)) });
      index += 1;
      continue;
    }

    const task = /^- \[([ xX])\] ?(.*)$/.exec(line);
    if (task) {
      blocks.push({ type: 'task', done: task[1].toLowerCase() === 'x', ...parseInline(task[2]) });
      index += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      blocks.push({ type: 'bullet', ...parseInline(line.slice(2)) });
      index += 1;
      continue;
    }

    blocks.push({ type: 'paragraph', ...parseInline(line) });
    index += 1;
  }

  return blocks;
}

function escapeMarkdown(text: string) {
  return text.replace(/([\\*_~`\[\]<>])/g, '\\$1');
}

function marksToMarkdown(text: string, marks: Mark[]) {
  const mentions = marks.filter((mark): mark is Extract<Mark, { type: 'mention' }> => mark.type === 'mention');
  const cuts = new Set([0, text.length]);
  for (const mark of marks) {
    cuts.add(Math.min(mark.start, text.length));
    cuts.add(Math.min(mark.end, text.length));
  }
  const points = [...cuts].sort((a, b) => a - b);

  let out = '';
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (end <= start) continue;

    let piece: string;
    const mention = mentions.find((mark) => mark.start <= start && start < mark.end);
    if (mention) {
      if (mention.start !== start) continue;
      const label = escapeMarkdown(text.slice(mention.start, mention.end));
      piece = `[${label}](${referenceUrl('student', mention.studentId)})`;
    } else {
      piece = escapeMarkdown(text.slice(start, end));
    }
    if (covers(marks, 'italic', start)) piece = `*${piece}*`;
    if (covers(marks, 'bold', start)) piece = `**${piece}**`;
    out += piece;
  }
  return out;
}

function legacyToBlocks(body: string): NoteBlock[] {
  return parseLegacyBody(body).flatMap((block): NoteBlock[] => {
    switch (block.type) {
      case 'heading':
        return [{ type: 'heading1', markdown: marksToMarkdown(block.text, block.marks) }];
      case 'bullet':
        return [{ type: 'bullet', markdown: marksToMarkdown(block.text, block.marks) }];
      case 'task':
        return [{ type: 'checklist', markdown: marksToMarkdown(block.text, block.marks), checked: block.done }];
      case 'paragraph':
        return [{ type: 'paragraph', markdown: marksToMarkdown(block.text, block.marks) }];
      case 'divider':
        return [{ type: 'divider', markdown: '' }];
      case 'scripture':
        return [
          ...(block.reference ? [{ type: 'quote' as const, markdown: `**${escapeMarkdown(block.reference)}**` }] : []),
          ...block.comment
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => ({ type: 'quote' as const, markdown: escapeMarkdown(line) })),
        ];
    }
  });
}

function inlineHtmlToMarkdown(html: string) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<mention\b[^>]*data-student-id="([^"]*)"[^>]*>(.*?)<\/mention>/gis, (_, id: string, label: string) => {
        const text = decodeEntities(label.replace(/<[^>]*>/g, ''));
        return `[${escapeMarkdown(text)}](${referenceUrl('student', decodeEntities(id))})`;
      })
      .replace(/<a\b[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gis, (_, href: string, label: string) => `[${label}](${href})`)
      .replace(/<\/?(b|strong)>/gi, '**')
      .replace(/<\/?(i|em)>/gi, '*')
      .replace(/<\/?(s|del|strike)>/gi, '~~')
      .replace(/<code>(.*?)<\/code>/gis, '`$1`')
      .replace(/<(?!\/?u>)[^>]*>/g, '')
  ).trim();
}

function htmlToBlocks(html: string): NoteBlock[] {
  const blocks: NoteBlock[] = [];
  const lists: ('bullet' | 'checklist')[] = [];
  let quote = 0;
  const token = /<(\/?)(h[1-6]|p|li|ul|ol|blockquote|codeblock)\b([^>]*)>|<br\s*\/?>/gi;
  let match: RegExpExecArray | null;
  let open: { tag: string; attrs: string; start: number } | null = null;

  while ((match = token.exec(html))) {
    const [whole, closing, rawTag = '', attrs = ''] = match;
    const tag = rawTag.toLowerCase();
    if (!tag) continue;

    if (tag === 'ul' || tag === 'ol') {
      if (closing) lists.pop();
      else lists.push(/data-type="checkbox"/i.test(attrs) ? 'checklist' : 'bullet');
      continue;
    }
    if (tag === 'blockquote') {
      quote += closing ? -1 : 1;
      continue;
    }
    if (!closing) {
      open = { tag, attrs, start: match.index + whole.length };
      continue;
    }
    if (!open || open.tag !== tag) continue;

    const inner = html.slice(open.start, match.index);
    if (tag === 'codeblock') {
      blocks.push({ type: 'code', markdown: decodeEntities(inner.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '')) });
    } else if (tag === 'li') {
      const kind = lists.at(-1) ?? 'bullet';
      blocks.push(
        kind === 'checklist'
          ? { type: 'checklist', markdown: inlineHtmlToMarkdown(inner), checked: /\bchecked\b/i.test(open.attrs) }
          : { type: 'bullet', markdown: inlineHtmlToMarkdown(inner) }
      );
    } else if (tag.startsWith('h')) {
      const level = Math.min(3, Number(tag[1]));
      blocks.push({ type: `heading${level}` as NoteBlock['type'], markdown: inlineHtmlToMarkdown(inner) });
    } else {
      blocks.push({ type: quote > 0 ? 'quote' : 'paragraph', markdown: inlineHtmlToMarkdown(inner) });
    }
    open = null;
  }

  return blocks;
}

export function toEditorDocument(body: string): string {
  if (body.trim() === '') return '';
  if (isDocumentBody(body)) return body;
  const blocks = isHtmlBody(body) ? htmlToBlocks(body) : legacyToBlocks(body);
  const document: NoteDocument = { version: 2, blocks };
  return JSON.stringify(document);
}

const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text: string) {
  return text.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (entity, code: string) => {
    if (code[0] === '#') {
      const hex = code[1] === 'x' || code[1] === 'X';
      const point = parseInt(code.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(point) && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? entity;
  });
}

export function plainBody(body: string) {
  const document = parseDocument(body);
  const text = document
    ? document.blocks.map((block) => (block.type === 'code' ? block.markdown : stripMarkdown(block.markdown))).join(' ')
    : isHtmlBody(body)
      ? decodeEntities(
          body
            .replace(/<br\s*\/?>|<\/(p|h[1-6]|li|blockquote|codeblock|ul|ol)>/gi, ' ')
            .replace(/<[^>]*>/g, '')
        )
      : parseLegacyBody(body)
          .flatMap((block) => {
            if (block.type === 'divider') return [];
            if (block.type === 'scripture') return [block.reference, block.comment];
            return [block.text];
          })
          .join(' ');

  return text.replace(/\s+/g, ' ').trim();
}

export function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
