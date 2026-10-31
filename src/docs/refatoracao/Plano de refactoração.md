# Preaching Assistant — Plano de refactoração

Para quem vai ler o código e analisar a arquitectura. A primeira parte explica como o app está montado hoje e por onde começar a ler. A segunda lista o que vale a pena mudar, por prioridade, cada ponto com o porquê, onde está e quando fica feito.

Nada aqui muda o comportamento do app. Cada ponto deve ser feito num commit próprio e testado com os [casos de teste da versão 1](../casos%20de%20teste/V1%20—%20Casos%20de%20teste.md) da área que toca.

## Parte 1 — Como o código está montado

### Pilha

- **Expo 57 e React Native 0.86**, só Android. Rotas com **Expo Router** (`src/app`), com rotas tipadas
- **SQLite no telemóvel** com **Drizzle ORM** (`src/database`). As migrações geram-se com `npm run db:generate -- --name nome` e correm ao abrir o app
- **React Query** para ler a base de dados nos ecrãs e actualizá-los depois de gravar
- **NativeWind** (Tailwind) para os estilos, com os tokens de cor em `src/lib/theme.ts` e `tailwind.config.js`
- **MMKV** para preferências pequenas (`src/utils/storage`), **SecureStore** para o PIN, e **Zustand** em dois sítios (editor de notas e toast)
- **expo-notifications** para os lembretes, e três módulos nativos próprios em `modules/` (alarmes exactos, notificação do cronómetro e downloads)

### Pastas

| Pasta | O que tem |
| --- | --- |
| `src/app` | Os ecrãs, um ficheiro por rota. `(app)/(tabs)` são os quatro separadores, `(app)/(settings)` as definições, `welcome` a primeira abertura, `auth` os ecrãs de conta da versão 2 |
| `src/components` | Componentes por área (`students`, `visits`, `study`, `today`, `reports`, `notes`…) e os base em `ui` |
| `src/database/schemas` | Uma tabela por ficheiro, todas com `id` UUID, `created_at`, `updated_at`, `deleted_at` e `sync_status` |
| `src/database/actions` | As leituras e escritas, agrupadas num objecto por área (`studentsActions`, `visitsActions`, `lessonsActions`…) |
| `src/utils` | Regras sem ecrã: cálculo da próxima visita, partes do livro, formatação de datas e textos, agendamento das notificações, cópia de segurança |
| `src/contexts` | Bloqueio, primeira abertura e notificações (o que corre ao abrir o app) |
| `src/hooks` | Cronómetro, localização actual, toast |
| `src/lib` | Tema, tipos de letra, dayjs |
| `src/docs` | Backlog, BRD, casos de teste e este plano |

### Um fluxo de ponta a ponta: registar uma visita com estudo

Seguir este fluxo é a forma mais rápida de perceber a arquitectura:

1. `src/app/(app)/visit/new.tsx` é só a rota; desenha o `VisitForm`
2. `src/components/visits/visit-form.tsx` lê o estudante, as lições e as disponibilidades com `useQuery`, guarda o estado do formulário e, ao guardar, chama as acções
3. `src/database/actions/visits.ts` (`visitsActions.create`) grava a visita e a próxima marcação
4. `src/database/actions/lessons.ts` (`lessonsActions.advance`) fecha e abre lições numa transacção síncrona e devolve o que é preciso para desfazer
5. `src/utils/visits/refresh.ts` invalida as consultas de estudantes, visitas, marcações, lições e marcos e chama `syncAllNotifications`
6. `src/utils/notifications/scheduler.ts` volta a agendar todas as notificações do app (lembretes de visita, resumo do dia, relatório e fim de mês)

Outros fluxos bons para ler: o Hoje (`(tabs)/index.tsx` com `actions/today.ts`), a captura no terreno (`components/students/quick-student-sheet.tsx` com `studentsActions.quickCreate`) e a cópia de segurança (`utils/backup`).

### Regras que o código já segue

- Sem comentários, salvo `// TODO:` e porquês que o código não diz (ver `CLAUDE.md`)
- Remoções lógicas com `deleted_at`; as leituras filtram `isNull(deletedAt)`
- Transacções do Drizzle síncronas, porque o driver do expo-sqlite é síncrono
- Só Android: nada de código para web ou iOS. As folhas usam `ModalBottomSheet` do `@expo/ui`

### Números

214 ficheiros TypeScript, cerca de 20 300 linhas (sem migrações). Os maiores: `actions/students.ts` (626), `visits/visit-form.tsx` (531), `(tabs)/index.tsx` (460), `students/student-form.tsx` (383).

## Parte 2 — O que mudar

Prioridade **A**: corrige um erro ou um risco real. **B**: facilita muito mexer no código daqui para a frente. **C**: arrumação.

### A. Erros e riscos

- [ ] **A1. Datas guardadas em UTC em vez de no dia local.** `lessonsActions.saveReview` grava o dia com `date.toISOString().slice(0, 10)`. Em Moçambique (UTC+2), uma revisão guardada entre a meia-noite e as 2h fica com o dia anterior. Os outros 13 sítios usam `dayjs(...).format('YYYY-MM-DD')`, que está certo
  - Feito quando: não há `toISOString().slice(0, 10)` no código e existe uma função única, ex. `toDayString(date)` em `src/utils/dates.ts`, usada em todos os sítios
- [ ] **A2. Tabela `reports` antiga ainda no esquema.** `src/database/schemas/reports.ts` continua exportado em `schemas/index.ts`, mas o relatório passou para `monthly_reports`
  - Confirmar que nada a lê (cópia de segurança incluída), remover o ficheiro e o export, e gerar uma migração que apague a tabela
  - Feito quando: `grep -rn "schemas/reports\|from './reports'" src` não encontra nada e a cópia de segurança restaura sem erro
- [ ] **A3. Língua sem estrutura de tradução.** A FND-05 está marcada como feita, mas os textos estão escritos directamente nos ecrãs e Mais › Gerais › Língua não muda nada. Bloqueia a LAN-01
  - Escolher a biblioteca (ex.: `i18next` com `react-i18next`, ou `expo-localization` com um dicionário próprio), criar `src/locales/pt.ts` e `en.ts`, e passar os textos ecrã a ecrã, começando pelos separadores
  - Feito quando: mudar a língua muda os textos do Hoje, Pessoas, Notas e Mais
- [ ] **A4. Sem verificação automática.** Não há linter (o FND-01 previa o Biome) nem testes. Só o `tsc` apanha erros
  - Acrescentar o Biome com um `biome.json` e um script `npm run lint`, e um script `npm run typecheck` (`tsc --noEmit`)
  - Acrescentar Jest com `jest-expo` e começar pelas funções puras, que têm regras de negócio e são fáceis de testar: `utils/study/parts.ts`, `utils/visits/next-visit.ts`, `utils/students/rhythm.ts`, `utils/hours/service-year.ts`, `utils/reports`
  - Feito quando: `npm run lint`, `npm run typecheck` e `npm test` correm sem erros
- [ ] **A5. Editar uma visita não recalcula o estudo.** Se a lição de uma visita antiga mudar, `lesson_progress` fica como estava (limitação conhecida da EST-04)
  - Decidir a regra (recalcular a partir das visitas, ou só avisar) antes de mexer
  - Feito quando: há um caso de teste com o comportamento escolhido

### B. Estrutura

- [ ] **B1. Chaves do React Query num só sítio.** Há 74 `queryKey` escritas à mão, espalhadas por cerca de 40 ficheiros (`['students', 'detail', id]`, `['lessons', id]`…) e 28 `invalidateQueries`. Uma chave mal escrita deixa um ecrã por actualizar sem dar erro
  - Criar `src/database/query-keys.ts` com uma fábrica, ex. `queryKeys.students.detail(id)`, e trocar todas as chaves
  - Feito quando: `grep -rn "queryKey: \['" src` não encontra nada
- [ ] **B2. Hooks de dados por área.** Os ecrãs repetem os mesmos `useQuery` (o estudante, as lições e as visitas aparecem em 4 ou 5 ecrãs cada). Criar `useStudent(id)`, `useLessons(studentId)`, `useStudentVisits(studentId)`… ao lado das acções, ex. `src/database/hooks/`
  - Feito quando: nenhum ecrã chama `useQuery` com uma acção que já tenha hook
- [ ] **B3. Actualizar depois de gravar, num só sítio.** Hoje cada ecrã decide o que invalidar e quando reagendar as notificações (`refreshVisitData` e mais 5 ficheiros que chamam `syncAllNotifications` directamente). Passar isto para mutações do React Query (`useMutation`) por área, que invalidam as chaves certas e reagendam
  - Feito quando: os ecrãs não chamam `invalidateQueries` nem `syncAllNotifications` directamente
- [ ] **B4. Utils não devem importar de components.** `capitalize` e outras funções vivem em `src/components/reports/format.ts` e são importadas por `utils/today`, `utils/visits`, `utils/students`, `utils/reports`, `utils/profile` e por `database/actions/notes.ts` (que importa `components/notes/body`)
  - Mover as funções de texto e datas para `src/utils/format/` e o tratamento do corpo das notas para `src/utils/notes/`
  - Feito quando: `grep -rln "from '@/components" src/utils src/database src/hooks src/lib` não encontra nada
- [ ] **B5. Partir os ficheiros grandes.**
  - `database/actions/students.ts` (626 linhas): separar em `students.ts` (CRUD e listas), `student-journey.ts` (etapa, marcos) e `student-pauses.ts` (pausar, retomar, disponibilidades)
  - `components/visits/visit-form.tsx` (531): tirar a secção do estudo para `components/study/study-fields.tsx` e a lógica do avanço para um hook `useLessonAdvance`
  - `(tabs)/index.tsx` (460): uma componente por secção do Hoje (semana, resumo, em atraso, visitas de hoje, a sair do ritmo) em `components/today/`
  - `components/students/student-form.tsx` (383): separar os grupos de campos
  - Feito quando: nenhum ficheiro de ecrã ou acção passa das 300 linhas
- [ ] **B6. Acções síncronas e assíncronas misturadas.** `lessonsActions.advance` e `undoAdvance` são síncronas (por causa das transacções); as outras são `async`. Quem chama tem de saber qual é qual
  - Escolher uma regra: ou todas as acções devolvem `Promise` (envolvendo as transacções), ou as síncronas ficam com um nome que o diga
  - Feito quando: a regra está escrita aqui e todas as acções a seguem
- [ ] **B7. Um só sítio para o estado guardado.** Há MMKV (`utils/storage`), SecureStore (`utils/lock`), Zustand (editor de notas e toast) e três contextos. Documentar quando usar cada um e juntar as chaves do MMKV num só ficheiro de constantes
  - Feito quando: há uma tabela "onde guardar o quê" neste documento e nenhuma chave do MMKV está escrita fora de `utils/storage`
- [ ] **B8. Datas com um formato e um tipo por coluna.** Umas colunas guardam ISO com hora (`visited_at`, `started_at`), outras só o dia `YYYY-MM-DD` (`occurred_at`, `date` das marcações). Documentar no esquema qual é qual e criar tipos (`IsoDateTime`, `DayString`) para o TypeScript não os misturar
  - Feito quando: cada coluna de data tem o formato no tipo, e as conversões passam por `src/utils/dates.ts`

### C. Arrumação

- [ ] **C1. Rotas da versão 2 e de desenvolvimento.** `src/app/auth/*` (login, criar conta, confirmar email, recuperar senha) e `hooks/use-auth-flow.tsx` são da versão 2 e não têm backend. `(app)/design-system.tsx` é uma página de desenvolvimento
  - Esconder estas rotas fora de `__DEV__`, ou mover a versão 2 para um ramo próprio até ao sprint 12
  - Feito quando: um build de produção não consegue abrir estes ecrãs
- [ ] **C2. Navegação com caminhos escritos à mão.** Há 68 `router.push`, `replace` e `navigate` com caminhos em texto (`` `/student/${id}/study` ``). Criar funções de caminho, ex. `routes.student.study(id)`, para mudar uma rota num sítio só
- [ ] **C3. Componentes base repetidos.** Rever `select.tsx` e `select-field.tsx`, `icon.tsx` e `app-icon.tsx`, `screen.tsx` e o padrão `View + ScreenHeader + ScrollView` repetido nos ecrãs. Ficar com um de cada
- [ ] **C4. Desempenho das notificações.** `syncAllNotifications` reagenda tudo depois de cada gravação. Com muitas pessoas, isto lê a base de dados inteira várias vezes por minuto de uso. Medir com 200 pessoas e, se custar, reagendar só o que mudou (os lembretes de uma pessoa)
- [ ] **C5. Pesquisa e listas grandes.** A lista de pessoas e a das notas filtram em memória. Medir com 500 pessoas e 500 notas; se a pesquisa atrasar, passar para `LIKE` no SQLite com uma coluna de nome sem acentos
- [ ] **C6. Documentar as migrações.** As migrações 0006 e 0007 copiam e preenchem dados (ex.: `lesson_progress` a partir das visitas). Acrescentar ao [Modelo e fluxos de dados](../brd/Modelo%20e%20fluxos%20de%20dados.md) uma linha por migração com o que muda

## Ordem sugerida

1. **A1, A2 e A4** primeiro: são pequenos e dão a rede de segurança (lint, typecheck e testes) para o resto
2. **B1, B2 e B3** juntos: mudam muitos ficheiros, mas de forma mecânica, e tiram a maior fonte de ecrãs por actualizar
3. **B4 e B5**: com as chaves e os hooks arrumados, partir os ficheiros grandes fica simples
4. **A3** antes da LAN-01, porque passar os textos para a tradução toca em todos os ecrãs
5. **B6 a B8 e a parte C** à medida que se mexe em cada área

Depois de cada ponto: `tsc` sem erros, os casos de teste da área a passar, e uma linha neste documento com o commit.
