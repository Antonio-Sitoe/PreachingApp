# PreachingApp

## Comentários no código

Não adiciones comentários ao código (TS/TSX, JS, Kotlin). O código deve explicar-se pelos nomes.

Só são permitidos:

- `// TODO: …` para trabalho por fazer.
- Comentários muito específicos que o código não consegue dizer: um contorno de um bug ou limitação de uma biblioteca/do Android, um porquê não óbvio (ex.: "o driver do expo-sqlite é síncrono: sem await dentro da transacção"), o formato de um valor guardado (ex.: `YYYY-MM-DD`, `1 = segunda … 7 = domingo`) ou um exemplo do texto que uma função de formatação devolve.

Nunca:

- Comentários que repetem o nome da função, do componente ou o que a linha faz.
- Notas de migração ("como no editor antigo", classes Tailwind espelhadas, nomes de ficheiros antigos).
- Comentários de secção ou de JSX a descrever o layout.

Ao editar um ficheiro, não reescrevas nem acrescentes comentários a código que não mudaste.
