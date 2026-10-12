import { EDITOR_FONTS_CSS } from '@/components/10tap-editor/fonts-css';
import { THEME } from '@/lib/theme';

type Theme = (typeof THEME)['light' | 'dark'];

// Cores do tema actual. Injectado à parte para se poder trocar quando muda claro/escuro.
export function editorThemeCss(theme: Theme) {
  return `
  :root {
    --bg: ${theme.card};
    --fg: ${theme.foreground};
    --muted-fg: ${theme.mutedForeground};
    --subtle: ${theme.subtle};
    --primary: ${theme.primary};
    --primary-strong: ${theme.primaryStrong};
    --secondary: ${theme.secondary};
    --muted: ${theme.muted};
  }`;
}

// Tipografia e blocos com o mesmo aspecto do resto da app. Os seletores começam em `#root .ProseMirror`
// para ganharem ao CSS que cada ponte do 10tap traz por omissão.
export const EDITOR_BASE_CSS = `
${EDITOR_FONTS_CSS}

html, body {
  background: var(--bg);
  color: var(--fg);
  font-family: 'Sen', sans-serif;
  font-size: 15px;
  line-height: 24px;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

#root .ProseMirror {
  box-sizing: border-box;
  padding: 4px 20px 120px;
  caret-color: var(--primary);
  word-wrap: break-word;
}
#root .ProseMirror p { margin: 0 0 4px; }
#root .ProseMirror strong { font-weight: 600; }

#root .ProseMirror h1, #root .ProseMirror h2, #root .ProseMirror h3,
#root .ProseMirror h4, #root .ProseMirror h5, #root .ProseMirror h6 {
  font-family: 'Red Hat Display', sans-serif;
  font-weight: 700;
  margin: 12px 0 6px;
}
#root .ProseMirror h1 { font-size: 23px; line-height: 30px; }
#root .ProseMirror h2 { font-size: 19px; line-height: 26px; }
#root .ProseMirror h3, #root .ProseMirror h4, #root .ProseMirror h5, #root .ProseMirror h6 {
  font-size: 16px;
  line-height: 22px;
}

#root .ProseMirror blockquote {
  margin: 8px 0;
  padding: 10px 14px;
  border-left: 3px solid var(--primary);
  border-radius: 0 8px 8px 0;
  background: var(--secondary);
  color: var(--muted-fg);
}
#root .ProseMirror blockquote p { margin: 0; }

#root .ProseMirror code {
  padding: 1px 4px;
  border-radius: 4px;
  background: var(--muted);
  color: var(--primary-strong);
  font-size: 14px;
}

#root .ProseMirror ul, #root .ProseMirror ol { margin: 4px 0; padding-left: 22px; }
#root .ProseMirror li p { margin: 0; }

#root .ProseMirror ul[data-type="taskList"] { padding-left: 0; }
#root .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 10px; margin: 2px 0; }
#root .ProseMirror ul[data-type="taskList"] li > label { flex: 0 0 auto; margin: 0; user-select: none; }
#root .ProseMirror ul[data-type="taskList"] li > label > input {
  width: 18px;
  height: 18px;
  margin: 3px 0 0;
  padding: 0;
  border: none;
  background: transparent;
  accent-color: var(--primary);
}
#root .ProseMirror ul[data-type="taskList"] li > div { flex: 1 1 auto; }
#root .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div {
  color: var(--subtle);
  text-decoration: line-through;
}

#root .ProseMirror a { color: var(--primary-strong); }
#root .ProseMirror .is-editor-empty:first-child::before { color: var(--subtle); }
`;
