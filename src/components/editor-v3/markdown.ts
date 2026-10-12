import type { EditorV3Block, EditorV3Content } from '@/components/editor-v3/types';

function blockToMarkdown(block: EditorV3Block): string {
  switch (block.type) {
    case 'heading':
      return `# ${block.markdown}`;
    case 'checklist':
      return `- [${block.checked ? 'x' : ' '}] ${block.markdown}`;
    case 'code':
      return ['```', block.markdown, '```'].join('\n');
    default:
      return block.markdown;
  }
}

/** Documento inteiro em Markdown, para exportar (estilo Obsidian). */
export function documentToMarkdown(content: EditorV3Content): string {
  const parts: string[] = [];
  content.blocks.forEach((block, index) => {
    const previous = content.blocks[index - 1];
    // Itens de checklist seguidos ficam na mesma lista, sem linha em branco no meio.
    const sameList = previous?.type === 'checklist' && block.type === 'checklist';
    parts.push(index === 0 ? '' : sameList ? '\n' : '\n\n');
    parts.push(blockToMarkdown(block));
  });
  return parts.join('') + '\n';
}

/** Texto simples do primeiro bloco com conteúdo, sem marcas de Markdown. */
export function documentTitle(content: EditorV3Content): string {
  const first = content.blocks.find((block) => block.markdown.trim() !== '');
  if (!first) return '';
  const line = first.markdown.trim().split('\n')[0];
  return line
    .replace(/<\/?u>/g, '')
    .replace(/[*_~`#>]/g, '')
    .trim()
    .slice(0, 80);
}
