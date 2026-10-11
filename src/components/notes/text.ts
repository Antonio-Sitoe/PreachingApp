/** Texto visível de uma nota, sem as marcas HTML do editor. */
export function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function previewText(html: string, max: number) {
  const text = plainText(html);
  if (!text) return 'Sem conteúdo';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}
