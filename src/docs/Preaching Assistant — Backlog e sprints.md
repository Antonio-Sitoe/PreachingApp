# Preaching Assistant — Backlog e sprints

Oct 5, 2026 ·

- &#32;[Preaching Assistant — Design 2.0](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1).&#32;
- &#32;[BRD](https://claude.ai/code/artifact/bf2ff2bc-d715-4a0d-bb72-c1ff11599947).&#32;

## Sprints

Cada sprint entrega uma parte utilizável do app, pela ordem do objectivo central: primeiro as pessoas, depois as visitas, o Hoje e o estudo, e só no fim o relatório e a protecção dos dados.

- [x] Fundações: o app abre, navega entre os quatro separadores e tem a base de dados (FND-01 a FND-06)
- [x] Primeira abertura
- [x] Notas,
  - [x] Lista de notas (S6) - Notas com título, etiqueta e cor, em lista ou cartões, e lista vazia
  - [x] Criar e editar nota (S6) -Título, texto, etiqueta, cor e a linha opcional "Sobre alguém", que liga a nota a uma pessoa. Grava em `notes`

## Fundações

Seis tarefas, 14 horas, todas no sprint 1. Nada do resto começa sem elas.

- [x] **Repositório e projecto base** - Repositório novo com Expo, TypeScript, NativeWind e Biome, estrutura de pastas e build de desenvolvimento a correr no Android. UI: sem ecrã (FND-01, 2 h, sprint 1)
- [x] **Tokens e temas** - Cores, tipografia (Red Hat Display e Sen), espaçamentos e raios como tokens, em claro e escuro, com a escolha Claro, Escuro ou Do sistema. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Cores, Tipografia, Marca e logótipo (FND-02, 2 h, sprint 1)
- [x] **Componentes base** - Botão, etiqueta de etapa, avatar com iniciais, campo de texto, interruptor, selector segmentado, grupo de linhas e cartão de pessoa. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Etiquetas, botões e avatar; Cartão de pessoa; Ícones (FND-03, 3 h, sprint 1)
- [x] **Navegação** - Barra com os separadores Hoje, Pessoas, Notas e Mais, folha inferior, estado vazio e aviso com desfazer, reutilizáveis em todos os ecrãs. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Navegação, folha inferior, estado vazio e aviso (FND-04, 3 h, sprint 1)
- [x] **Línguas** - Estrutura de tradução com português e inglês. Nenhum texto fica escrito directamente no ecrã. UI: sem ecrã (FND-05, 1 h, sprint 1)
- [x] **Base de dados local** - As 17 tabelas no SQLite com Drizzle, com UUID gerado no telemóvel e as colunas `created_at`, `updated_at`, `deleted_at` e `sync_status`, mais as migrações. UI: sem ecrã (FND-06, 3 h, sprint 1)

## Entrada e conta

Seis tarefas. Três são da versão 1 (7 horas): a primeira abertura e o bloqueio. A conta só entra na versão 2, porque o app funciona sem ela.

- [x] **Splash e boas-vindas** - Ecrã de arranque e boas-vindas com Começar e "Tenho uma cópia de segurança". Só aparece na primeira abertura. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 1 Splash, 2 Boas-vindas (ENT-01, 1 h, sprint 2)
- [x] **Configuração inicial** - Dois passos: nome, língua e tipo de publicador, depois as permissões de notificações e localização. Grava em `users`. O app funciona se as permissões forem recusadas. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 3 Configuração inicial, 1 de 2 e 2 de 2 (ENT-02, 2 h, sprint 2)
- [ ] **Bloqueio do app (S5)** - Criar PIN, activar biometria, desbloquear ao abrir, PIN errado e PIN esquecido. Liga e desliga em Mais › Gerais. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 4 Criar PIN, Activar biometria, Desbloquear, PIN errado, Esqueci-me do PIN (ENT-03, 4 h, sprint 9)
- [ ] **Entrar e criar conta (S7)** - Entrar com Google ou com email e senha, criar conta com as quatro regras de senha, confirmar o email com código de 4 dígitos, e os erros de cada passo. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 5 Entrar, Criar conta, Confirmar email, Código incorrecto, Código expirado, Email com o código (ENT-04, 8 h, sprint 14)
- [ ] **Recuperar senha** - Pedido de recuperação por email e definição da senha nova. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 5 Recuperar senha (ENT-05, 2 h, sprint 14)
- [ ] **Convite a entrar** - Avisos pontuais a quem usa sem conta, a convidar a entrar para ter cópia no servidor. Podem ser dispensados. UI: sem ecrã próprio no canvas; aparece no [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) com o componente de aviso (ENT-06, 2 h, sprint 14)

## Pessoas

Treze tarefas. Dez são da versão 1 (26 horas) e cobrem P1, P7, P9 e P10. É o épico maior, porque a pessoa é o centro do app.

- [ ] **Lista de pessoas** - Lista das pessoas activas com etapa e próxima visita, pesquisa por nome, ordenação, lista vazia e pesquisa sem resultados. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 11 Lista de pessoas, Ordenar, Lista vazia, Pesquisa sem resultados (PES-01, 4 h, sprint 2)
- [ ] **Criar e editar pessoa (P1)** - Formulário em que só o nome é obrigatório. Telefone, morada, etapa, ritmo (7, 14, 30 ou um número de dias), faixa etária e género são opcionais. Grava em `people`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 13 Criar e editar pessoa; Criar pessoa, campos com erro (PES-02, 3 h, sprint 2)
- [ ] **Ficha da pessoa (P1)** - Cabeçalho com iniciais e etapa, acções Registar visita, Ligar e Direcções, próxima visita, ritmo e as secções que os outros épicos vão preencher. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 14 Ficha da pessoa (PES-03, 4 h, sprint 2)
- [ ] **Etapa do percurso (P1)** - Mudar a etapa entre as seis do BRD. Cada mudança grava uma linha em `stage_changes`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 15 Etapa do percurso e marcos (PES-04, 2 h, sprint 3)
- [ ] **Marcos (P1)** - Acrescentar um marco em texto livre, com exemplos sugeridos e data. Lista de marcos na ficha. Grava em `milestones`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 15 Novo marco (PES-05, 2 h, sprint 3)
- [ ] **Captura no terreno (P7)** - Criar um contacto em dez segundos: nome provisório, localização actual e uma linha de nota. Fica marcado com `name_is_provisional` para completar depois. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 12 Captura no terreno, Captura com erro (PES-06, 3 h, sprint 3)
- [ ] **Localização e direcções (P10)** - Guardar a ligação do Google Maps ou a posição actual, e abrir o Google Maps com as direcções. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 16 Localização e direcções (PES-07, 2 h, sprint 3)
- [ ] **Pausar e retomar (P9)** - Pôr a pessoa em pausa com motivo e data para tentar de novo, vê-la na lista Em pausa e retomá-la. Grava em `pauses` e muda `people.status`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 17 Pausar, 11 Em pausa (PES-08, 3 h, sprint 3)
- [ ] **Remover pessoa** - Confirmação que oferece a pausa primeiro. A remoção é lógica, com `deleted_at`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 18 Remover pessoa (PES-09, 1 h, sprint 3)
- [ ] **Dias e hora habituais** - Dias da semana e hora em que a pessoa costuma estar, usados para sugerir a próxima visita. Grava em `person_availabilities`. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 13 Criar e editar pessoa (PES-10, 2 h, sprint 3)
- [ ] **Tentativas e melhor horário (P11)** - A partir das visitas conseguidas e falhadas, mostrar em que dias e horas a pessoa costuma estar. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 19 Melhor horário (PES-11, 6 h, sprint 20)
- [ ] **Linha do tempo (P12)** - Vista cronológica do percurso, com visitas, lições, mudanças de etapa e marcos. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 20 Linha do tempo (PES-12, 8 h, sprint 20)
- [ ] **Foto da casa (P13)** - Tirar ou escolher uma fotografia do local, com legenda e "como chegar", guardada só no telemóvel. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 21 Foto da casa (PES-13, 5 h, sprint 15)

## Visitas e Hoje

Onze tarefas, 28 horas, todas na versão 1. Cobrem P2, P4, P5, P6 e P8, que são o uso diário do app.

- [ ] **Registar visita (P2)** - Formulário com a pessoa já escolhida e a data e hora pré-preenchidas: nota, textos usados, dúvida pendente, "Prometi levar" e resultado (encontrei, não estava, remarcada). Sem campo de duração. Grava em `visits`. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 22 Registar visita, Escolher pessoa, Escolher o dia, Escolher a hora (VIS-01, 4 h, sprint 4)
- [ ] **Não estava em casa (P2)** - Um toque regista a tentativa como visita com `outcome = not_home` e propõe nova data. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 23 Não estava em casa (VIS-02, 1 h, sprint 4)
- [ ] **Agendar a próxima visita (P6)** - Dia e hora com sugestão pelo ritmo da pessoa, atalhos de 7 e 14 dias e a escolha Avisar: na hora, 30 minutos antes ou 1 hora antes. Grava em `appointments`. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 24 Agendar a próxima visita (VIS-03, 3 h, sprint 4)
- [ ] **Lembretes de visita (P6)** - Notificação local do telemóvel para cada visita marcada, reagendada ou cancelada quando a visita muda. Tocar na notificação abre a pessoa. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 26 Notificações locais (VIS-04, 3 h, sprint 4)
- [ ] **Histórico e detalhe de visita** - Lista das visitas de uma pessoa, detalhe com tudo o que foi registado, editar e apagar com confirmação, e histórico vazio. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 25 Histórico de visitas, Detalhe de visita, Histórico vazio, Apagar visita (VIS-05, 3 h, sprint 4)
- [ ] **Ecrã Hoje (P4)** - Página inicial com as visitas de hoje, as que estão em atraso e o resumo do mês, por tipo de publicador. Inclui os estados Hoje vazio e Dia concluído. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 6 Hoje; 10 Hoje, pioneiro; 7 Hoje vazio; 7 Dia concluído (HOJ-01, 4 h, sprint 5)
- [ ] **Feita ou adiar (P4)** - Em cada pessoa do Hoje: Visita feita abre o registo, Não estava em casa regista a tentativa e Adiar muda a data. Aviso com desfazer. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 8 Feita ou adiar; 8 Feita, com desfazer (HOJ-02, 2 h, sprint 5)
- [ ] **Acções rápidas** - O botão do Hoje abre a folha com Visita, Estudo, Novo contacto e Horas. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 6 Acções rápidas (HOJ-03, 1 h, sprint 5)
- [ ] **Alertas por ritmo (P5)** - Calcular quem saiu do seu ritmo a partir da última visita e de `rhythm_days`, e mostrá-los no Hoje. Pessoas em pausa não contam. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 6 Hoje (HOJ-04, 3 h, sprint 5)
- [ ] **Notificação do dia (P5)** - Uma notificação local por dia, à hora escolhida, com quem visitar e quem está a sair do ritmo. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 41 Notificações (HOJ-05, 2 h, sprint 5)
- [ ] **Cartão de preparação (P8)** - Antes da visita mostra a última conversa, a dúvida pendente, o que ficou prometido levar e a lição seguinte. UI: [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 9 Cartão de preparação (HOJ-06, 2 h, sprint 5)7

## Estudo

Seis tarefas, 14 horas, todas no sprint 6. Cobrem P3, o que nenhum outro app faz: acompanhar o livro *Seja Feliz para Sempre!* lição a lição.

- [ ] **Visita com estudo (P3)** - No registo da visita, "Estudaram o livro?" abre a lição e o ponto onde pararam. Grava `lesson_number` e `stopped_at_point`. UI: [Visitas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 22 Registar visita, com estudo (EST-01, 2 h, sprint 6)
- [ ] **Progresso no estudo (P3)** - Lição actual das 60, a parte em que está (1 a 12, 13 a 33, 34 a 47, 48 a 60), o ritmo e o número de sessões por lição. Inclui o estado Estudo por começar. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 27 Progresso no estudo, Estudo por começar (EST-02, 4 h, sprint 6)
- [ ] **Detalhe da lição (P3)** - Data de início e de conclusão, "Tente o seguinte" marcado só pelo utilizador, nota e dúvidas pendentes. Grava em `lesson_progress`. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 28 Detalhe da lição (EST-03, 2 h, sprint 6)
- [ ] **Avanço de lição (P3)** - Quando a visita regista uma lição mais avançada, o app fecha a anterior e abre a nova, com desfazer. Se saltar mais de uma, pergunta pelas intermédias. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 29 Avanço de lição com desfazer (EST-04, 3 h, sprint 6)
- [ ] **Revisão de parte (P3)** - Ao fechar a última lição de uma parte, propor a revisão e guardá-la como marco. UI: [Estudo](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 30 Revisão de parte como marco (EST-05, 1 h, sprint 6)
- [ ] **Estudo na ficha e na preparação** - A ficha da pessoa mostra o progresso no livro e o cartão de preparação passa a mostrar a lição seguinte. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 14 Ficha da pessoa; Hoje › 9 Cartão de preparação (EST-06, 2 h, sprint 6)

## Relatório e horas

Nove tarefas. Sete são da versão 1 (16 horas) e cobrem S2, S3 e S4. Não há horas de crédito em nenhum ecrã.

- [ ] **Relatório do mês (S2)** - Calculado das visitas e das horas, conforme o tipo: o publicador vê participei e número de estudos, o pioneiro vê horas e número de estudos. Grava em `monthly_reports`. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 31 Relatório do mês, publicador e pioneiro (REL-01, 3 h, sprint 7)
- [ ] **Partilhar o relatório (S2)** - Gerar o texto do relatório e abrir a partilha do telemóvel (WhatsApp ou outro). Marca o relatório como enviado. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 31 Relatório do mês (REL-02, 1 h, sprint 7)
- [ ] **Histórico de relatórios** - Meses anteriores em lista ou em cartões, conforme a definição Vista das listas, e histórico vazio. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 32 Histórico, em lista; Histórico, em cartões; Histórico vazio (REL-03, 2 h, sprint 7)
- [x] **Horas por tipo de publicador (S4)** - Ecrã de horas para publicador, pioneiro auxiliar e pioneiro regular, e entrada manual de horas. Grava em `time_entries` com origem `manual`. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 33 Horas, publicador; 33 Horas e plano, pioneiro auxiliar; 35 Horas e plano, pioneiro regular; 33 Entrada manual de horas (REL-04, 3 h, sprint 7)
- [x] **Cronómetro (S4)** - Iniciar, pausar e terminar com o app aberto. Grava em `time_entries` com origem `timer`. Opcional e desligado por omissão para publicadores. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 33 Cronómetro e horas (REL-05, 2 h, sprint 7)
- [x] **Plano do mês do pioneiro (S4)** - Escolher os dias da semana e as horas por dia, ver as horas em falta e acertar dia a dia. Grava em `month_plans` e `plan_days`. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 33 Planear os dias do mês (REL-06, 3 h, sprint 7)
- [ ] **Avisos de fim de mês (S3)** - Notificação local e aviso no app quando o relatório está por enviar ou o mês acaba sem participação registada. Respeita a hora que o utilizador escolheu. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 34 Avisos de fim de mês (REL-07, 2 h, sprint 8)
- [x] **Cronómetro em segundo plano (S9)** - O cronómetro continua a contar com o app fechado, com notificação fixa para parar. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 35 Cronómetro em segundo plano (REL-08, 8 h, sprint 18)
- [ ] **Metas do mês e do ano (S9)** - Progresso face à meta do mês e às 600 horas do ano de serviço, de Setembro a Agosto. UI: [Relatório e horas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 35 Horas e plano, pioneiro regular (REL-09, 4 h, sprint 19)

## Mais, definições e cópia de segurança

Oito tarefas. Sete são da versão 1 (13 horas) e cobrem S1 e as definições essenciais de S14.

- [ ] **Menu Mais e perfil (S14)** - Menu com os atalhos Relatórios e Apoiar e as definições. No perfil: nome, tipo de publicador e meta do mês, que podem mudar de mês para mês. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 38 Menu Mais; 39 Perfil: tipo de publicador e metas (DEF-01, 3 h, sprint 8)
- [ ] **Definições gerais (S14)** - Língua, tema (Claro, Escuro, Do sistema), vista das listas e ritmo por omissão para pessoas novas. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 40 Gerais, 40 Escolher a língua, 41 Ritmo por omissão (DEF-02, 2 h, sprint 8)
- [ ] **Definições de notificações (S14)** - Hora da notificação do dia, antecedência por omissão dos lembretes de visita e lembrete do relatório mensal. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 41 Notificações (DEF-03, 1 h, sprint 8)
- [ ] **Exportar cópia de segurança (S1)** - Exportar todas as tabelas para um ficheiro, sem palavra-passe, e guardá-lo ou partilhá-lo. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 42 Backup e restauro, 42 Cópia exportada (DEF-04, 2 h, sprint 9)
- [ ] **Restaurar cópia (S1)** - Restaurar a partir das definições, com confirmação de que substitui os dados, e a partir das boas-vindas num telemóvel novo. Valida o ficheiro antes de escrever. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 42 Restaurar, confirmação; Entrada › 2 Restaurar cópia no arranque (DEF-05, 3 h, sprint 9)
- [ ] **Contagens anónimas** - Interruptor desligado por omissão. Ligado, o app conta em `usage_counters` os dias de uso, as visitas, as pessoas criadas e as lições concluídas. O envio é a BKD-03. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 43 Contagens anónimas (DEF-06, 1 h, sprint 9)
- [ ] **Apoiar** - Número de e-Mola com botão de copiar. O app não processa pagamentos. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 45 Apoiar (DEF-07, 1 h, sprint 9)
- [ ] **Conta e sincronização (S7)** - Estado da conta e da sincronização, sair, e apagar a conta e os dados no servidor com confirmação. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 44 Conta e sincronização; 44 Apagar conta, confirmação (DEF-08, 4 h, sprint 13)

## Backend e sincronização

Treze tarefas, 103 horas, todas na versão 2. A sincronização sozinha leva 44 horas e só avança se os testadores a pedirem, como diz o BRD.

- [ ] **Correcções da versão 1** - Os problemas que os testadores encontrarem nas quatro semanas de uso. UI: os ecrãs afectados (FIX-01, 7 h, sprint 10)
- [ ] **Projecto do backend** - Stack decidida (Node.js com TypeScript ou Java), projecto criado, alojado e com entrega automática. UI: sem ecrã (BKD-01, 6 h, sprint 10)
- [ ] **Receber contagens** - Endpoint que recebe dia, evento e quantidade, sem identificar ninguém. UI: sem ecrã (BKD-02, 3 h, sprint 11)
- [ ] **Enviar contagens** - O app envia as linhas de `usage_counters` quando há internet e marca `sent_at`. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 43 Contagens anónimas (BKD-03, 3 h, sprint 11)
- [ ] **Painel admin com dados reais** - O painel que já existe deixa os dados de exemplo e mostra dispositivos activos, visitas, pessoas e lições por semana. UI: painel admin, fora do canvas (BKD-04, 6 h, sprint 11)
- [ ] **Base de dados do servidor** - Tabelas de contas e de dados sincronizados, com os campos pessoais guardados cifrados. UI: sem ecrã (BKD-05, 6 h, sprint 12)
- [ ] **Login com Google** - Entrar com Google no backend próprio, com sessão que se mantém. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 5 Entrar (BKD-06, 8 h, sprint 12)
- [ ] **Login por email e senha** - Criar conta, envio do email com o código de 4 dígitos, confirmação, recuperação de senha e apagar conta. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 5 Email com o código (BKD-07, 10 h, sprint 13)
- [ ] **Cifra no telemóvel** - Os campos pessoais e as notas são cifrados antes de saírem do telemóvel. O administrador não os consegue ler. UI: sem ecrã (SYN-01, 10 h, sprint 15)
- [ ] **Sincronização: envio** - Enviar as linhas alteradas, usando `updated_at`, `deleted_at` e `sync_status`. UI: sem ecrã (SYN-02, 14 h, sprint 16)
- [ ] **Sincronização: recepção** - Receber as alterações de outro dispositivo e resolver conflitos pela alteração mais recente. UI: sem ecrã (SYN-03, 14 h, sprint 17)
- [ ] **Sincronização em segundo plano** - Sincronizar sem o utilizador pedir e mostrar o estado nas definições. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 44 Conta e sincronização (SYN-04, 6 h, sprint 18)
- [ ] **Testes entre dois telemóveis** - Usar a mesma conta em dois dispositivos, com e sem internet, e corrigir o que falhar. UI: sem ecrã (QA-01, 10 h, sprint 19)

## Entrega e lançamento

Dez tarefas: duas fecham a versão 1 (4 horas) e oito são do lançamento (45 horas, mais os 14 dias de teste fechado).

- [ ] **Inglês** - Todos os textos traduzidos e revistos, com a troca de língua a funcionar em todos os ecrãs. UI: todas as páginas do canvas (LAN-01, 2 h, sprint 9)
- [ ] **Entrega aos testadores** - Build de Android, teste num telemóvel modesto e distribuição pelo teste interno da Play Console. UI: sem ecrã (LAN-02, 2 h, sprint 9)
- [ ] **Dados e privacidade (S14)** - Apagar todos os dados do telemóvel, política de privacidade e termos. UI: sem ecrã no canvas (LAN-03, 6 h, sprint 21)
- [ ] **Ajuda e sobre (S14)** - Guia de uso, contacto, versão do app e aviso de que não é uma ferramenta oficial. UI: sem ecrã no canvas (LAN-04, 5 h, sprint 21)
- [ ] **Revisão final das línguas** - Rever português e inglês em todos os ecrãs novos da versão 2. UI: todas as páginas do canvas (LAN-10, 3 h, sprint 21)
- [ ] **Retrospectiva mensal (S10)** - Resumo pessoal do mês: pessoas acompanhadas, visitas, lições concluídas e marcos. UI: sem ecrã no canvas (LAN-05, 8 h, sprint 22)
- [ ] **Nome e ficha da loja** - Nome final, ícone, descrição e capturas de ecrã para a Play Store. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Marca e logótipo (LAN-06, 6 h, sprint 22)
- [ ] **Teste fechado** - Recrutar 15 ou mais testadores e manter 12 inscritos durante 14 dias seguidos, como a Play Store exige. UI: sem ecrã (LAN-07, 4 h, sprint 23)
- [ ] **Correcções do teste fechado** - Corrigir o que o teste fechado mostrar. UI: os ecrãs afectados (LAN-08, 10 h, sprint 23)
- [ ] **Publicação** - Pedido de produção na Play Console e publicação. UI: sem ecrã (LAN-09, 3 h, sprint 24)

**Versão 2 e lançamento**

As datas marcam-se quando a versão 1 cumprir o critério do BRD: testadores a registar pelo menos uma visita por semana durante quatro semanas.

Ficam fora dos sprints, para depois do lançamento: passar a pessoa a outro publicador (P14), estatísticas pessoais (S11), mapa das pessoas (S12) e a versão web para iPhone (S13).

| Sprint | Objectivo | Tarefas | Horas |
| --- | --- | --- | --- |
| 10 | Correcções pedidas pelos testadores e projecto do backend | FIX-01, BKD-01 | 13 |
| 11 | Contagens anónimas de ponta a ponta, até ao painel admin | BKD-02 a BKD-04 | 12 |
| 12 | Base de dados do servidor e login com Google | BKD-05, BKD-06 | 14 |
| 13 | Login por email e senha, e conta nas definições | BKD-07, DEF-08 | 14 |
| 14 | Ecrãs de entrar e criar conta no app | ENT-04 a ENT-06 | 12 |
| 15 | Cifra dos dados pessoais e foto da casa | SYN-01, PES-13 | 15 |
| 16 | Sincronização: envio | SYN-02 | 14 |
| 17 | Sincronização: recepção e conflitos | SYN-03 | 14 |
| 18 | Sincronização em segundo plano e cronómetro em segundo plano | SYN-04, REL-08 | 14 |
| 19 | Testes entre dois telemóveis e metas de horas | QA-01, REL-09 | 14 |
| 20 | Melhor horário e linha do tempo da pessoa | PES-11, PES-12 | 14 |
| 21 | Privacidade, termos, ajuda e revisão das línguas | LAN-03, LAN-04, LAN-10 | 14 |
| 22 | Retrospectiva mensal, nome e ficha da loja | LAN-05, LAN-06 | 14 |
| 23 | Teste fechado de 14 dias e correcções | LAN-07, LAN-08 | 14 |
| 24 | Publicação na Play Store | LAN-09 | 3 |

## Pontos por decidir

Dois pontos bloqueiam o sprint 1; os outros podem esperar pelo sprint em que a tarefa entra.

| Ponto | Bloqueia | O que proponho |
| --- | --- | --- |
| React Native com Expo ou Flutter | FND-01, sprint 1 | Expo. As 128 horas contam com o código da branch `dev`; em Flutter recomeça-se do zero |
| Fim da tua revisão do design | Início a 12 de Outubro | Se a revisão passar desta semana, todas as datas da versão 1 deslizam o mesmo número de semanas |
| Dados de quem usa a versão 1.0.3 | Sprint 9 | Se houver utilizadores com dados, falta uma tarefa de migração de cerca de 3 horas. As três perguntas da migração estão no Modelo de dados |
| Notas em texto simples ou em blocos | NOT-02, sprint 8 | Texto simples na versão 1. O editor em blocos do canvas pede mais cerca de 8 horas e uma mudança na tabela `notes` |
| Plano do mês do pioneiro na versão 1 | REL-06, sprint 7 | Manter. Se sair, o sprint 7 fica com 3 horas livres |
| PIN esquecido e PIN errado | ENT-03, sprint 9 | Como está no canvas: o PIN não se recupera, restaura-se a cópia; 3 tentativas erradas bloqueiam 1 minuto |
| Números de uso durante o teste da versão 1 | Sprint 9 | O envio das contagens só chega no sprint 11. Até lá, Play Console e a pergunta quinzenal aos testadores. Para ter números antes, puxar BKD-01 a BKD-03 (12 horas) para um sprint 9B |
| Node.js ou Java no backend | BKD-01, sprint 10 | Node.js com TypeScript, como recomenda o BRD |
| Ecrãs que faltam no canvas | Sprints 14 e 21 | Desenhar antes do sprint em que entram: convite a entrar (ENT-06), dados e privacidade (LAN-03), ajuda e sobre (LAN-04) e retrospectiva mensal (LAN-05)\\  |
