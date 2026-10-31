# Preaching Assistant — Versão 1 (primeira fase)

Tudo o que entra na versão 1: o que já está feito, com notas do que falta em cada tarefa, e as duas tarefas que fecham a versão. A versão 2 está em [V2 — Segunda fase](V2%20—%20Segunda%20fase.md).

- [Preaching Assistant — Design 2.0](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1)
- [BRD](../brd/Preaching%20Assistant%20—%20BRD.md) e [BRD no Claude](https://claude.ai/code/artifact/bf2ff2bc-d715-4a0d-bb72-c1ff11599947)
- [Casos de teste da versão 1](../casos%20de%20teste/V1%20—%20Casos%20de%20teste.md)
- [Plano de refactoração](../refatoracao/Plano%20de%20refactoração.md)
- [Versão 2 — segunda fase](V2%20—%20Segunda%20fase.md)

## Sprints

Cada sprint entrega uma parte utilizável do app, pela ordem do objectivo central: primeiro as pessoas, depois as visitas, o Hoje e o estudo, e só no fim o relatório e a protecção dos dados.

- [x] Fundações: o app abre, navega entre os quatro separadores e tem a base de dados (FND-01 a FND-06)
- [x] Primeira abertura
- [x] Notas,
  - [x] Lista de notas (S6) - Notas com título, etiqueta e cor, em lista ou cartões, e lista vazia
  - [x] Criar e editar nota (S6) -Título, texto, etiqueta, cor e a linha opcional "Sobre alguém", que liga a nota a uma pessoa. Grava em `notes`
- [x] Pessoas (separador Estudantes, tabela `students`): versão 1 feita. No GitHub na branch `migracao` (commits 63ce038c a 3edfe8e8)
  - [x] Migração 0004: `name_is_provisional`, `age_range`, `gender`, `directions`, `located_at` e as tabelas `stage_changes`, `milestones`, `pauses` e `student_availabilities`
  - [x] Lista, captura no terreno, ficha e criar e editar (PES-01, PES-02, PES-03, PES-06)
  - [x] Etapa e marcos (PES-04, PES-05)
  - [x] Localização, pausar e remover (PES-07, PES-08, PES-09)
  - [x] Ritmo por omissão conforme a etapa: o das revisitas para primeiro contacto e revisita, o dos estudos (Mais › Notificações) a partir de estudo iniciado. Criar um estudante conta `student_created` em `usage_counters`
  - [x] Dias e hora habituais a sugerir a próxima visita (PES-10)
  - [x] Testes no emulador (Pixel 9 Pro): lista, captura, ficha, formulário, etapa, marcos, pausa, retomar e remover, em tema escuro e claro. Falta: gravar um ponto no mapa num telemóvel real (o emulador pede "Location Accuracy" da Google)
  - [x] Responsivo na maior parte dos Android: testado num ecrã de 360 × 640 dp com a letra a 130%. Alturas mínimas em vez de fixas, folhas com scroll e abaixo da barra de estado, calendário que cabe em 320 dp, conteúdo limitado a 640 dp nos tablets. Falta testar num telemóvel real e num tablet
- [x] Visitas e Hoje: versão 1 feita (commits e3036f52 a 0d8b074e, no GitHub). Falta só a VIS-04 ter os botões "Ver preparação" e "Adiar" dentro da notificação
  - [x] Migração 0006: tabela `visits` (resultado, notas, textos, dúvida, "Prometi levar", lição e ponto) e hora (`time`) nas marcações
  - [x] Registar visita (VIS-01) com escolha do estudante, e próxima visita sugerida pelo ritmo e pelos dias habituais (VIS-03)
  - [x] Não estava em casa (VIS-02) e histórico e detalhe com editar e apagar (VIS-05)
  - [x] Lembretes no telemóvel (VIS-04)
  - [x] Ecrã Hoje, feita ou adiar, acções rápidas e quem sai do ritmo (HOJ-01 a HOJ-04)
  - [x] Notificação do dia (HOJ-05) e cartão de preparação (HOJ-06)
- [x] Estudo (livro *Seja Feliz para Sempre!*, 60 lições)
  - [x] Migração: tabela `lesson_progress`
  - [x] Visita com estudo e avanço de lição com desfazer (EST-01, EST-04)
  - [x] Progresso no estudo e detalhe da lição (EST-02, EST-03)
  - [x] Revisão de parte como marco e estudo na ficha e na preparação (EST-05, EST-06)
  - Testado no emulador: migração com preenchimento a partir das visitas, avanço com pergunta pelas intermédias, avanço quando a lição actual ainda não tem registo, toast, ficha, progresso no estudo com a grelha de 6 colunas, detalhe da lição, folha de revisão e cartão da preparação. Por testar no emulador: o toque em Desfazer e o ecrã pequeno com letra grande
- [x] Relatório e horas: relatório do mês, partilha, histórico, horas, cronómetro, plano do pioneiro e avisos de fim de mês (REL-01 a REL-07), e ainda o cronómetro em segundo plano e as metas do ano (REL-08, REL-09), que eram da versão 2
- [x] Mais e definições: perfil, gerais, notificações, cópia de segurança, contagens anónimas e apoiar (DEF-01 a DEF-07)
- [ ] Fechar a versão 1: inglês e estrutura de tradução (LAN-01, FND-05) e entrega aos testadores (LAN-02)

## Fundações

Seis tarefas, 14 horas, todas no sprint 1. Nada do resto começa sem elas.

- [x] **Repositório e projecto base** - Repositório novo com Expo, TypeScript, NativeWind e Biome, estrutura de pastas e build de desenvolvimento a correr no Android. UI: sem ecrã (FND-01, 2 h, sprint 1)
- [x] **Tokens e temas** - Cores, tipografia (Red Hat Display e Sen), espaçamentos e raios como tokens, em claro e escuro, com a escolha Claro, Escuro ou Do sistema. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Cores, Tipografia, Marca e logótipo (FND-02, 2 h, sprint 1)
- [x] **Componentes base** - Botão, etiqueta de etapa, avatar com iniciais, campo de texto, interruptor, selector segmentado, grupo de linhas e cartão de pessoa. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Etiquetas, botões e avatar; Cartão de pessoa; Ícones (FND-03, 3 h, sprint 1)
- [x] **Navegação** - Barra com os separadores Hoje, Pessoas, Notas e Mais, folha inferior, estado vazio e aviso com desfazer, reutilizáveis em todos os ecrãs. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Navegação, folha inferior, estado vazio e aviso (FND-04, 3 h, sprint 1)
- [ ] **Línguas** - Estrutura de tradução com português e inglês. Nenhum texto fica escrito directamente no ecrã. UI: sem ecrã (FND-05, 1 h, sprint 1)
  - Falta: o código não tem estrutura de tradução. Os textos estão escritos directamente nos ecrãs. Fica junto com a LAN-01
- [x] **Base de dados local** - As 17 tabelas no SQLite com Drizzle, com UUID gerado no telemóvel e as colunas `created_at`, `updated_at`, `deleted_at` e `sync_status`, mais as migrações. UI: sem ecrã (FND-06, 3 h, sprint 1)

## Entrada e conta

Três tarefas da versão 1 (7 horas): a primeira abertura e o bloqueio. A conta fica para a versão 2.

- [x] **Splash e boas-vindas** - Ecrã de arranque e boas-vindas com Começar e "Tenho uma cópia de segurança". Só aparece na primeira abertura. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 1 Splash, 2 Boas-vindas (ENT-01, 1 h, sprint 2)
- [x] **Configuração inicial** - Dois passos: nome, língua e tipo de publicador, depois as permissões de notificações e localização. Grava em `users`. O app funciona se as permissões forem recusadas. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 3 Configuração inicial, 1 de 2 e 2 de 2 (ENT-02, 2 h, sprint 2)
- [x] **Bloqueio do app (S5)** - Criar PIN, activar biometria, desbloquear ao abrir, PIN errado e PIN esquecido. Liga e desliga em Mais › Gerais. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 4 Criar PIN, Activar biometria, Desbloquear, PIN errado, Esqueci-me do PIN (ENT-03, 4 h, sprint 9)

## Pessoas

Dez tarefas da versão 1 (26 horas), que cobrem P1, P7, P9 e P10. O melhor horário, a linha do tempo e a foto da casa ficam para a versão 2.

- [x] **Lista de pessoas** - Lista das pessoas activas com etapa e próxima visita, pesquisa por nome, ordenação, lista vazia e pesquisa sem resultados. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 11 Lista de pessoas, Ordenar, Lista vazia, Pesquisa sem resultados (PES-01, 4 h, sprint 2)
  - A lição e a última visita vêm de `visits` desde a VIS-01
- [x] **Criar e editar pessoa (P1)** - Formulário em que só o nome é obrigatório. Telefone, morada, etapa, ritmo (7, 14, 30 ou um número de dias), faixa etária e género são opcionais. Grava em `people`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 13 Criar e editar pessoa; Criar pessoa, campos com erro (PES-02, 3 h, sprint 2)
  - Grava em `students`. Novo estudante abre pelo link "Preencher a ficha completa" da captura
- [x] **Ficha da pessoa (P1)** - Cabeçalho com iniciais e etapa, acções Registar visita, Ligar e Direcções, próxima visita, ritmo e as secções que os outros épicos vão preencher. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 14 Ficha da pessoa (PES-03, 4 h, sprint 2)
  - Registar visita, Dúvida pendente e Últimas visitas feitos (VIS-01, VIS-05). O Estudo mostra o cartão do progresso no livro (EST-06). Direcções abre o ecrã Localização (PES-07); Linha do tempo, Melhor horário e Foto da casa são da versão 2
- [x] **Etapa do percurso (P1)** - Mudar a etapa entre as seis do BRD. Cada mudança grava uma linha em `stage_changes`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 15 Etapa do percurso e marcos (PES-04, 2 h, sprint 3)
  - Ecrã Etapa e marcos, aberto pela etiqueta da etapa na ficha. "Passar a …" avança uma etapa, com desfazer; para recuar, muda-se no formulário de editar
- [x] **Marcos (P1)** - Acrescentar um marco em texto livre, com exemplos sugeridos e data. Lista de marcos na ficha. Grava em `milestones`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 15 Novo marco (PES-05, 2 h, sprint 3)
  - Os marcos aparecem no ecrã Etapa e marcos, como no canvas, e não na ficha. Falta apagar ou editar um marco (não está no canvas)
- [x] **Captura no terreno (P7)** - Criar um contacto em dez segundos: nome provisório, localização actual e uma linha de nota. Fica marcado com `name_is_provisional` para completar depois. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 12 Captura no terreno, Captura com erro (PES-06, 3 h, sprint 3)
  - Inclui "Quando voltas?", que cria a marcação em `appointments`
- [x] **Localização e direcções (P10)** - Guardar a ligação do Google Maps ou a posição actual, e abrir o Google Maps com as direcções. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 16 Localização e direcções (PES-07, 2 h, sprint 3)
  - Como no canvas, não há campo para colar a ligação do Google Maps: guarda a posição actual, a morada e "Como chegar" (`directions`, `located_at`). "Abrir no Google Maps" abre as direcções até ao ponto ou à morada
- [x] **Pausar e retomar (P9)** - Pôr a pessoa em pausa com motivo e data para tentar de novo, vê-la na lista Em pausa e retomá-la. Grava em `pauses` e muda `people.status`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 17 Pausar, 11 Em pausa (PES-08, 3 h, sprint 3)
  - Motivo (Viajou, Pediu para parar, Sem disponibilidade, Outro), nota e data para tentar de novo. Retomar na lista Em pausa ou na ficha fecha a pausa com `resumed_at`. Falta tirar quem está em pausa do Hoje e dos alertas (HOJ-01, HOJ-04)
- [x] **Remover pessoa** - Confirmação que oferece a pausa primeiro. A remoção é lógica, com `deleted_at`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 18 Remover pessoa (PES-09, 1 h, sprint 3)
  - Também cancela as marcações por cumprir do estudante removido
- [x] **Dias e hora habituais** - Dias da semana e hora em que a pessoa costuma estar, usados para sugerir a próxima visita. Grava em `person_availabilities`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 13 Criar e editar pessoa (PES-10, 2 h, sprint 3)
  - Grava em `student_availabilities` pelo formulário. A próxima visita é sugerida no primeiro dia habitual depois do ritmo, à melhor hora

## Visitas e Hoje

Onze tarefas, 28 horas, todas na versão 1. Cobrem P2, P4, P5, P6 e P8, que são o uso diário do app.

- [x] **Registar visita (P2)** - Formulário com a pessoa já escolhida e a data e hora pré-preenchidas: nota, textos usados, dúvida pendente, "Prometi levar" e resultado (encontrei, não estava, remarcada). Sem campo de duração. Grava em `visits`. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 22 Registar visita, Escolher pessoa, Escolher o dia, Escolher a hora (VIS-01, 4 h, sprint 4)
  - Abre pela ficha (Registar visita) e escolhe o estudante quando vem sem ele. Ao guardar, dá por feitas as marcações por cumprir até esse dia. O avanço de lição e o "Tente o seguinte" estão no Estudo (EST-01, EST-04)
- [x] **Não estava em casa (P2)** - Um toque regista a tentativa como visita com `outcome = not_home` e propõe nova data. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 23 Não estava em casa (VIS-02, 1 h, sprint 4)
  - No Registar visita, guardar com "Não estava" abre a folha Tentativa guardada, com Desfazer e Tentar de novo (Amanhã, Sábado, Próxima semana, Escolher data). O toque único fica para o Hoje (HOJ-02)
- [x] **Agendar a próxima visita (P6)** - Dia e hora com sugestão pelo ritmo da pessoa, atalhos de 7 e 14 dias e a escolha Avisar: na hora, 30 minutos antes ou 1 hora antes. Grava em `appointments`. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 24 Agendar a próxima visita (VIS-03, 3 h, sprint 4)
  - Folha Próxima visita com atalhos, dia, hora e Avisar. Grava a hora em `appointments.time` e o aviso em `remind_minutes_before`, que a VIS-04 usa para a notificação
- [x] **Lembretes de visita (P6)** - Notificação local do telemóvel para cada visita marcada, reagendada ou cancelada quando a visita muda. Tocar na notificação abre a pessoa. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 26 Notificações locais (VIS-04, 3 h, sprint 4)
  - Uma notificação local por marcação com hora e aviso ("Visita à Celeste daqui a 1 hora", "10:00 · lição 14 · levar …"). Volta a agendar tudo ao abrir o app e depois de cada mudança em visitas, marcações, pausas ou remoções; quem está em pausa não recebe. Tocar abre o cartão de preparação. Falta: os botões "Ver preparação" e "Adiar" dentro da notificação
- [x] **Histórico e detalhe de visita** - Lista das visitas de uma pessoa, detalhe com tudo o que foi registado, editar e apagar com confirmação, e histórico vazio. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 25 Histórico de visitas, Detalhe de visita, Histórico vazio, Apagar visita (VIS-05, 3 h, sprint 4)
  - Histórico por mês com os filtros Todas, Com estudo e Tentativas; detalhe com a próxima visita marcada nessa visita; editar e apagar. Apagar volta a pôr por cumprir as marcações que a visita tinha dado por feitas. A ficha mostra a dúvida pendente e as três últimas visitas
- [x] **Ecrã Hoje (P4)** - Página inicial com as visitas de hoje, as que estão em atraso e o resumo do mês, por tipo de publicador. Inclui os estados Hoje vazio e Dia concluído. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 6 Hoje; 10 Hoje, pioneiro; 7 Hoje vazio; 7 Dia concluído (HOJ-01, 4 h, sprint 5)
  - Semana com os dias marcados, resumo do mês (estudos e estudantes), horas do mês para pioneiros, Em atraso, Visitas de hoje ("1 de 3 feitas"), Dia concluído com Feitas hoje e Amanhã, e Hoje vazio. Testado num ecrã de 360 dp com letra a 130%
- [x] **Feita ou adiar (P4)** - Em cada pessoa do Hoje: Visita feita abre o registo, Não estava em casa regista a tentativa e Adiar muda a data. Aviso com desfazer. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 8 Feita ou adiar; 8 Feita, com desfazer (HOJ-02, 2 h, sprint 5)
  - Visita feita abre o Registar visita; Não estava em casa regista a tentativa num toque e abre a folha com Desfazer; Adiar (Amanhã, Sábado, Próxima semana, Escolher data) com Desfazer no aviso
- [x] **Acções rápidas** - O botão do Hoje abre a folha com Visita, Estudo, Novo contacto e Horas. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 6 Acções rápidas (HOJ-03, 1 h, sprint 5)
  - Visita, Estudo (abre o registo já com estudo), Novo contacto (captura no terreno) e Horas
- [x] **Alertas por ritmo (P5)** - Calcular quem saiu do seu ritmo a partir da última visita e de `rhythm_days`, e mostrá-los no Hoje. Pessoas em pausa não contam. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 6 Hoje (HOJ-04, 3 h, sprint 5)
  - Secção A sair do ritmo para quem não tem marcação e passou do ritmo desde a última visita (ou o registo), com Agendar; quem está em pausa não conta
- [x] **Notificação do dia (P5)** - Uma notificação local por dia, à hora escolhida, com quem visitar e quem está a sair do ritmo. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 41 Notificações (HOJ-05, 2 h, sprint 5)
  - Agendada para os próximos 7 dias à hora de Mais › Notificações, só nos dias com algo a dizer: "Hoje tens 3 visitas · Celeste às 10:00, … · 2 em atraso", ou quem está em atraso ou a sair do ritmo. Volta a agendar ao abrir o app, ao mudar as definições e depois de cada visita. Tocar abre o Hoje
- [x] **Cartão de preparação (P8)** - Antes da visita mostra a última conversa, a dúvida pendente, o que ficou prometido levar e a lição seguinte. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 9 Cartão de preparação (HOJ-06, 2 h, sprint 5)7
  - Ecrã Preparar a visita (student/[id]/prepare), aberto pelo cartão do Hoje e pelo lembrete da visita: última conversa com notas, dúvida pendente, lição em curso com a parte do livro, "Prometi levar" com caixas para marcar, e Direcções e Registar visita. Com o Estudo, a lição em curso passou a ser o cartão do progresso no livro (EST-06)

## Estudo

Seis tarefas, 14 horas, todas no sprint 6. Cobrem P3: acompanhar o livro *Seja Feliz para Sempre!* lição a lição.

- [x] **Visita com estudo (P3)** - No registo da visita, "Estudaram o livro?" abre a lição e o ponto onde pararam. Grava `lesson_number` e `stopped_at_point`. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 22 Registar visita, com estudo (EST-01, 2 h, sprint 6)
  - A lição vem por defeito na lição em curso. A tabela `lesson_progress` guarda início, conclusão, "Tente o seguinte" e nota; a migração 0007 preenche-a a partir das visitas já registadas
- [x] **Progresso no estudo (P3)** - Lição actual das 60, a parte em que está (1 a 12, 13 a 33, 34 a 47, 48 a 60), o ritmo e o número de sessões por lição. Inclui o estado Estudo por começar. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 27 Progresso no estudo, Estudo por começar (EST-02, 4 h, sprint 6)
  - Ecrã student/[id]/study: lição actual, barra das 60, ritmo (uma lição a cada N visitas) e as 4 partes, com a grelha de lições da parte em curso. Sem lições, mostra Estudo por começar com Registar visita com estudo
- [x] **Detalhe da lição (P3)** - Data de início e de conclusão, "Tente o seguinte" marcado só pelo utilizador, nota e dúvidas pendentes. Grava em `lesson_progress`. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 28 Detalhe da lição (EST-03, 2 h, sprint 6)
  - Ecrã student/[id]/lesson/[n]: datas, número de visitas, "Tente o seguinte", nota, dúvidas pendentes com Respondida (`visits.question_resolved_at`) e Marcar como concluída na última lição
- [x] **Avanço de lição (P3)** - Quando a visita regista uma lição mais avançada, o app fecha a anterior e abre a nova, com desfazer. Se saltar mais de uma, pergunta pelas intermédias. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 29 Avanço de lição com desfazer (EST-04, 3 h, sprint 6)
  - Ao guardar, fecha as lições anteriores com a data da visita, pede o "Tente o seguinte" da que fecha e, na primeira lição, passa o percurso a Estudo iniciado. O toast tem Desfazer. Falta: editar uma visita não volta a calcular o avanço
- [x] **Revisão de parte (P3)** - Ao fechar a última lição de uma parte, propor a revisão e guardá-la como marco. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 30 Revisão de parte como marco (EST-05, 1 h, sprint 6)
  - A folha abre sozinha quando a visita fecha a última lição de uma parte; depois, ao tocar numa parte concluída no Progresso no estudo. Guarda um marco `part_review` com data e nota (`milestones.note`)
- [x] **Estudo na ficha e na preparação** - A ficha da pessoa mostra o progresso no livro e o cartão de preparação passa a mostrar a lição seguinte. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 14 Ficha da pessoa; Hoje › 9 Cartão de preparação (EST-06, 2 h, sprint 6)
  - Cartão do estudo (lição, parte, barra e ritmo) na ficha e na preparação, que abre o Progresso no estudo. A dúvida pendente passa a ser a última por responder

## Relatório e horas

Nove tarefas. Sete eram da versão 1 (16 horas) e cobrem S2, S3 e S4; as outras duas foram feitas antes do previsto. Não há horas de crédito em nenhum ecrã.

- [x] **Relatório do mês (S2)** - Calculado das visitas e das horas, conforme o tipo: o publicador vê participei e número de estudos, o pioneiro vê horas e número de estudos. Grava em `monthly_reports`. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 31 Relatório do mês, publicador e pioneiro (REL-01, 3 h, sprint 7)
- [x] **Partilhar o relatório (S2)** - Gerar o texto do relatório e abrir a partilha do telemóvel (WhatsApp ou outro). Marca o relatório como enviado. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 31 Relatório do mês (REL-02, 1 h, sprint 7). Falta confirmar no Android se fechar a partilha sem enviar também marca como enviado; há Desfazer
- [x] **Histórico de relatórios** - Meses anteriores em lista ou em cartões, conforme a definição Vista das listas, e histórico vazio. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 32 Histórico, em lista; Histórico, em cartões; Histórico vazio (REL-03, 2 h, sprint 7)
- [x] **Horas por tipo de publicador (S4)** - Ecrã de horas para publicador, pioneiro auxiliar e pioneiro regular, e entrada manual de horas. Grava em `time_entries` com origem `manual`. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 33 Horas, publicador; 33 Horas e plano, pioneiro auxiliar; 35 Horas e plano, pioneiro regular; 33 Entrada manual de horas (REL-04, 3 h, sprint 7)
- [x] **Cronómetro (S4)** - Iniciar, pausar e terminar com o app aberto. Grava em `time_entries` com origem `timer`. Opcional e desligado por omissão para publicadores. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 33 Cronómetro e horas (REL-05, 2 h, sprint 7)
- [x] **Plano do mês do pioneiro (S4)** - Escolher os dias da semana e as horas por dia, ver as horas em falta e acertar dia a dia. Grava em `month_plans` e `plan_days`. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 33 Planear os dias do mês (REL-06, 3 h, sprint 7)
- [x] **Avisos de fim de mês (S3)** - Notificação local e aviso no app quando o relatório está por enviar ou o mês acaba sem participação registada. Respeita a hora que o utilizador escolheu. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 34 Avisos de fim de mês (REL-07, 2 h, sprint 8)
- [x] **Cronómetro em segundo plano (S9)** - O cronómetro continua a contar com o app fechado, com notificação fixa para parar. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 35 Cronómetro em segundo plano (REL-08, 8 h, sprint 18)
  - Estava na versão 2 (sprint 18) e foi feita antes, com o resto do Relatório
- [x] **Metas do mês e do ano (S9)** - Progresso face à meta do mês e às 600 horas do ano de serviço, de Setembro a Agosto. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 35 Horas e plano, pioneiro regular (REL-09, 4 h, sprint 19)
  - Estava na versão 2 (sprint 19) e foi feita antes, com o resto do Relatório

## Mais, definições e cópia de segurança

Sete tarefas da versão 1 (13 horas), que cobrem S1 e as definições essenciais de S14. A conta fica para a versão 2.

- [x] **Menu Mais e perfil (S14)** - Menu com os atalhos Relatórios e Apoiar e as definições. No perfil: nome, tipo de publicador e meta do mês, que podem mudar de mês para mês. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 38 Menu Mais; 39 Perfil: tipo de publicador e metas (DEF-01, 3 h, sprint 8)
- [x] **Definições gerais (S14)** - Língua, tema (Claro, Escuro, Do sistema), vista das listas e ritmo por omissão para pessoas novas. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 40 Gerais, 40 Escolher a língua, 41 Ritmo por omissão (DEF-02, 2 h, sprint 8). Falta: a língua só muda os textos com a LAN-01
- [x] **Definições de notificações (S14)** - Hora da notificação do dia, antecedência por omissão dos lembretes de visita e lembrete do relatório mensal. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 41 Notificações (DEF-03, 1 h, sprint 8)
- [x] **Exportar cópia de segurança (S1)** - Exportar todas as tabelas para um ficheiro, sem palavra-passe, e guardá-lo ou partilhá-lo. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 42 Backup e restauro, 42 Cópia exportada (DEF-04, 2 h, sprint 9)
- [x] **Restaurar cópia (S1)** - Restaurar a partir das definições, com confirmação de que substitui os dados, e a partir das boas-vindas num telemóvel novo. Valida o ficheiro antes de escrever. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 42 Restaurar, confirmação; Entrada › 2 Restaurar cópia no arranque (DEF-05, 3 h, sprint 9)
- [x] **Contagens anónimas** - Interruptor desligado por omissão. Ligado, o app conta em `usage_counters` os dias de uso, as visitas, as pessoas criadas e as lições concluídas. O envio é a BKD-03. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 43 Contagens anónimas (DEF-06, 1 h, sprint 9). Falta: contar visitas e lições quando existirem
- [x] **Apoiar** - Número de e-Mola com botão de copiar. O app não processa pagamentos. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 45 Apoiar (DEF-07, 1 h, sprint 9)

## Fechar a versão 1

Duas tarefas fecham a versão 1 (4 horas). O resto do lançamento está na versão 2.

- [ ] **Inglês** - Todos os textos traduzidos e revistos, com a troca de língua a funcionar em todos os ecrãs. UI: todas as páginas do canvas (LAN-01, 2 h, sprint 9)
- [ ] **Entrega aos testadores** - Build de Android, teste num telemóvel modesto e distribuição pelo teste interno da Play Console. UI: sem ecrã (LAN-02, 2 h, sprint 9)

## Critério para passar à versão 2

Testadores a registar pelo menos uma visita por semana durante quatro semanas, como diz o BRD. Só depois se marcam as datas da versão 2.
