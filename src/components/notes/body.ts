// O corpo das notas é o HTML do EnrichedTextInput. Notas antigas ainda podem estar no
// formato de texto anterior (`# título`, `- [ ] tarefa`, `:::scripture`...) e são
// convertidas para HTML quando abertas no editor.

type InlineStyle = 'bold' | 'italic';

type Mark =
  | { type: InlineStyle; start: number; end: number }
  | { type: 'mention'; start: number; end: number; studentId: string };

type LegacyBlock =
  | { type: 'paragraph' | 'heading' | 'bullet'; text: string; marks: Mark[] }
  | { type: 'task'; text: string; marks: Mark[]; done: boolean }
  | { type: 'scripture'; reference: string; comment: string }
  | { type: 'divider' };

export const STUDENT_ID_ATTRIBUTE = 'data-student-id';

export function isHtmlBody(body: string) {
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

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inlineHtml(text: string, marks: Mark[]) {
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

    let html: string;
    const mention = mentions.find((mark) => mark.start <= start && start < mark.end);
    if (mention) {
      // A menção sai inteira no primeiro pedaço; os restantes já estão dentro dela.
      if (mention.start !== start) continue;
      const label = escapeHtml(text.slice(mention.start, mention.end));
      html = `<mention text="${label}" indicator="@" ${STUDENT_ID_ATTRIBUTE}="${escapeHtml(mention.studentId)}">${label}</mention>`;
    } else {
      html = escapeHtml(text.slice(start, end));
    }
    if (covers(marks, 'italic', start)) html = `<i>${html}</i>`;
    if (covers(marks, 'bold', start)) html = `<b>${html}</b>`;
    out += html;
  }
  return out;
}

/** Converte uma nota no formato antigo para o HTML do editor. */
export function legacyToHtml(body: string) {
  const lines: string[] = [];
  let list: 'bullet' | 'task' | null = null;

  function closeList() {
    if (list) lines.push('</ul>');
    list = null;
  }

  function openList(kind: 'bullet' | 'task') {
    if (list === kind) return;
    closeList();
    lines.push(kind === 'task' ? '<ul data-type="checkbox">' : '<ul>');
    list = kind;
  }

  for (const block of parseLegacyBody(body)) {
    switch (block.type) {
      case 'bullet':
        openList('bullet');
        lines.push(`<li>${inlineHtml(block.text, block.marks)}</li>`);
        break;
      case 'task':
        openList('task');
        lines.push(`<li${block.done ? ' checked' : ''}>${inlineHtml(block.text, block.marks)}</li>`);
        break;
      case 'heading':
        closeList();
        lines.push(`<h2>${inlineHtml(block.text, block.marks)}</h2>`);
        break;
      case 'paragraph':
        closeList();
        lines.push(block.text === '' ? '<br>' : `<p>${inlineHtml(block.text, block.marks)}</p>`);
        break;
      case 'divider':
        closeList();
        lines.push('<br>');
        break;
      case 'scripture': {
        closeList();
        const paragraphs = [
          ...(block.reference ? [`<p><b>${escapeHtml(block.reference)}</b></p>`] : []),
          ...block.comment
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => `<p>${escapeHtml(line)}</p>`),
        ];
        if (paragraphs.length > 0) lines.push('<blockquote>', ...paragraphs, '</blockquote>');
        break;
      }
    }
  }
  closeList();

  return `<html>\n${lines.length > 0 ? lines.join('\n') : '<br>'}\n</html>`;
}

/** O valor inicial do editor: HTML tal como está, ou a nota antiga convertida. */
export function toEditorHtml(body: string) {
  if (body.trim() === '') return '';
  return isHtmlBody(body) ? body : legacyToHtml(body);
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

/** Só o texto da nota, para pesquisa e para saber se está vazia. */
export function plainBody(body: string) {
  const text = isHtmlBody(body)
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
