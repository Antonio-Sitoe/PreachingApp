# Preaching Assistant — Versão 2 (segunda fase)

Tudo o que fica para depois da versão 1: conta, backend, sincronização, três funcionalidades das pessoas e o lançamento na Play Store. A versão 1 está em [V1 — Primeira fase](V1%20—%20Primeira%20fase.md).

- [Preaching Assistant — Design 2.0](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1)
- [BRD](../brd/Preaching%20Assistant%20—%20BRD.md)

As datas marcam-se quando a versão 1 cumprir o critério do BRD: testadores a registar pelo menos uma visita por semana durante quatro semanas.

## Entrada e conta

Três tarefas. A conta só entra agora, porque o app funciona sem ela.

- [ ] **Entrar e criar conta (S7)** - Entrar com Google ou com email e senha, criar conta com as quatro regras de senha, confirmar o email com código de 4 dígitos, e os erros de cada passo. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 5 Entrar, Criar conta, Confirmar email, Código incorrecto, Código expirado, Email com o código (ENT-04, 8 h, sprint 14)
- [ ] **Recuperar senha** - Pedido de recuperação por email e definição da senha nova. UI: [Entrada](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 5 Recuperar senha (ENT-05, 2 h, sprint 14)
- [ ] **Convite a entrar** - Avisos pontuais a quem usa sem conta, a convidar a entrar para ter cópia no servidor. Podem ser dispensados. UI: sem ecrã próprio no canvas; aparece no [Hoje](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) com o componente de aviso (ENT-06, 2 h, sprint 14)

## Pessoas

Três tarefas (19 horas). A linha do tempo e o melhor horário já têm os dados todos no telemóvel (visitas, lições, etapas e marcos) e não dependem do backend, por isso podem ser puxados para antes se fizer falta.

- [ ] **Tentativas e melhor horário (P11)** - A partir das visitas conseguidas e falhadas, mostrar em que dias e horas a pessoa costuma estar. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 19 Melhor horário (PES-11, 6 h, sprint 20)
- [ ] **Linha do tempo (P12)** - Vista cronológica do percurso, com visitas, lições, mudanças de etapa e marcos. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 20 Linha do tempo (PES-12, 8 h, sprint 20)
- [ ] **Foto da casa (P13)** - Tirar ou escolher uma fotografia do local, com legenda e "como chegar", guardada só no telemóvel. UI: [Pessoas](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 21 Foto da casa (PES-13, 5 h, sprint 15)

## Mais, definições e cópia de segurança

Uma tarefa: o ecrã da conta, que depende do login.

- [ ] **Conta e sincronização (S7)** - Estado da conta e da sincronização, sair, e apagar a conta e os dados no servidor com confirmação. UI: [Mais e definições](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › 44 Conta e sincronização; 44 Apagar conta, confirmação (DEF-08, 4 h, sprint 13)

## Backend e sincronização

Treze tarefas, 103 horas. A sincronização sozinha leva 44 horas e só avança se os testadores a pedirem, como diz o BRD.

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

Oito tarefas (45 horas, mais os 14 dias de teste fechado).

- [ ] **Dados e privacidade (S14)** - Apagar todos os dados do telemóvel, política de privacidade e termos. UI: sem ecrã no canvas (LAN-03, 6 h, sprint 21)
- [ ] **Ajuda e sobre (S14)** - Guia de uso, contacto, versão do app e aviso de que não é uma ferramenta oficial. UI: sem ecrã no canvas (LAN-04, 5 h, sprint 21)
- [ ] **Revisão final das línguas** - Rever português e inglês em todos os ecrãs novos da versão 2. UI: todas as páginas do canvas (LAN-10, 3 h, sprint 21)
- [ ] **Retrospectiva mensal (S10)** - Resumo pessoal do mês: pessoas acompanhadas, visitas, lições concluídas e marcos. UI: sem ecrã no canvas (LAN-05, 8 h, sprint 22)
- [ ] **Nome e ficha da loja** - Nome final, ícone, descrição e capturas de ecrã para a Play Store. UI: [Componentes](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1) › Marca e logótipo (LAN-06, 6 h, sprint 22)
- [ ] **Teste fechado** - Recrutar 15 ou mais testadores e manter 12 inscritos durante 14 dias seguidos, como a Play Store exige. UI: sem ecrã (LAN-07, 4 h, sprint 23)
- [ ] **Correcções do teste fechado** - Corrigir o que o teste fechado mostrar. UI: os ecrãs afectados (LAN-08, 10 h, sprint 23)
- [ ] **Publicação** - Pedido de produção na Play Console e publicação. UI: sem ecrã (LAN-09, 3 h, sprint 24)

## Sprints

A REL-08 (sprint 18) e a REL-09 (sprint 19) já foram feitas na versão 1, por isso saíram destes sprints.

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
| 18 | Sincronização em segundo plano | SYN-04 | 6 |
| 19 | Testes entre dois telemóveis | QA-01 | 10 |
| 20 | Melhor horário e linha do tempo da pessoa | PES-11, PES-12 | 14 |
| 21 | Privacidade, termos, ajuda e revisão das línguas | LAN-03, LAN-04, LAN-10 | 14 |
| 22 | Retrospectiva mensal, nome e ficha da loja | LAN-05, LAN-06 | 14 |
| 23 | Teste fechado de 14 dias e correcções | LAN-07, LAN-08 | 14 |
| 24 | Publicação na Play Store | LAN-09 | 3 |

Ficam fora dos sprints, para depois do lançamento: passar a pessoa a outro publicador (P14), estatísticas pessoais (S11), mapa das pessoas (S12) e a versão web para iPhone (S13).

## Pontos por decidir (do plano original)

Os pontos já decididos na versão 1 saíram desta tabela: Expo, a revisão do design, notas sem editor em blocos, o plano do pioneiro e o PIN como no canvas. Ficam os que ainda contam para a versão 2.

| Ponto | Bloqueia | O que proponho |
| --- | --- | --- |
| Dados de quem usa a versão 1.0.3 | Sprint 9 | Se houver utilizadores com dados, falta uma tarefa de migração de cerca de 3 horas. As três perguntas da migração estão no Modelo de dados |
| Números de uso durante o teste da versão 1 | Sprint 9 | O envio das contagens só chega no sprint 11. Até lá, Play Console e a pergunta quinzenal aos testadores. Para ter números antes, puxar BKD-01 a BKD-03 (12 horas) para um sprint 9B |
| Node.js ou Java no backend | BKD-01, sprint 10 | Node.js com TypeScript, como recomenda o BRD |
| Ecrãs que faltam no canvas | Sprints 14 e 21 | Desenhar antes do sprint em que entram: convite a entrar (ENT-06), dados e privacidade (LAN-03), ajuda e sobre (LAN-04) e retrospectiva mensal (LAN-05)|
