# Preaching Assistant — BRD

Oct 5, 2026 · @Nairo Mudumane

## Resumo

O Preaching Assistant ajuda cada publicador a acompanhar cada estudante do primeiro contacto ao batismo, lembrando o que foi conversado, em que ponto do estudo está e quando voltar.

O objectivo secundário é manter o registo do próprio ministério (relatório mensal e horas de pioneiro) com o mínimo de esforço.

O que o distingue dos apps existentes é o centro. Os outros organizam-se à volta do relatório e do território, e o estudante é um contacto com notas. Aqui o estudante e o seu percurso são o produto, com o livro *Seja Feliz para Sempre!* como espinha dorsal do estudo.

É um app individual, móvel e offline-first, com backend próprio para conta, backup e sincronização.

As tabelas, as regras e os fluxos de dados estão em Modelo e fluxos de dados.

Os passos do utilizador nos três fluxos principais estão em Fluxos do utilizador.

## Contexto e evidência

Três factos sustentam o objectivo: o relatório mudou, a pesquisa aponta para os estudantes e os concorrentes não ocupam esse espaço.

**O relatório mudou.** Desde 1 de Novembro de 2023 os publicadores já não relatam horas, publicações nem revisitas. Indicam apenas se participaram no ministério e quantos estudos bíblicos dirigiram. Só os pioneiros continuam a relatar horas: 15 ou 30 por mês o auxiliar, 50 o regular, e 90 ou 100 o especial e o missionário. O cronómetro deixa por isso de ser o centro do app.

**A pesquisa aponta para os estudantes.** Responderam 14 publicadores em Novembro de 2025, em duas rondas (10 e 4). A amostra é pequena e próxima do autor, por isso indica direcções e não prova nada.

| Sinal | Evidência |
| --- | --- |
| Perder contacto é a dor principal | 8 de 10 esquecem visitas ou perdem contacto às vezes ou frequentemente; ninguém respondeu nunca |
| Falta ver o progresso no estudo | 6 de 10 dizem que é a informação que não conseguem organizar |
| Querem agenda e lembretes | 11 de 14 acham muito útil a integração com o Google Calendar |
| O concorrente real é o caderno | 6 de 9 usam caderno físico ou notas do telemóvel; metade não usa nenhum app |
| Medo de perder os dados | Backup e recuperação citados como limitação dos apps actuais |
| Mapa interactivo divide opiniões | 3 usariam sempre, 3 não têm interesse, 3 talvez |
| Pouca disposição para pagar | 3 de 4 respostas querem gratuito |

**Os concorrentes não ocupam esse espaço.** O [Ministry Assistant](https://play.google.com/store/apps/details?id=com.lostpixels.fieldservice&hl=en_US) lidera no Android, com cerca de 36 mil avaliações, e cobre território, tempo de serviço, relatório, backup e Google Calendar. Essas funcionalidades são o mínimo esperado, não um diferencial. Nenhum dos apps analisados acompanha o percurso do estudante lição a lição.

## Utilizadores

O app tem cinco perfis fixos, e o perfil define a meta de horas, o relatório e a presença do cronómetro. O perfil é escolhido pelo utilizador e pode mudar de mês para mês.

| Perfil | Meta mensal | Relatório mensal | Cronómetro |
| --- | --- | --- | --- |
| Publicador | Sem meta de horas | Participei (sim ou não) e número de estudos | Opcional, desligado por omissão |
| Pioneiro auxiliar | 15 ou 30 horas | Horas e número de estudos | Ligado |
| Pioneiro regular | 50 horas | Horas e número de estudos | Ligado |
| Pioneiro especial | 90 ou 100 horas | Horas e número de estudos | Ligado |
| Missionário | 90 ou 100 horas | Horas e número de estudos | Ligado |

Os perfis e as metas são fixos. Onde há duas opções, o utilizador escolhe uma no perfil, e não existem metas livres.

## Âmbito

Uma funcionalidade é principal se ajuda directamente a lembrar o estudante, a saber o próximo passo ou a voltar a tempo. É secundária se serve o registo do próprio publicador.

Fica fora do âmbito:

- Gestão de território e qualquer função para a congregação ou para os anciãos.
- Partilha de dados entre publicadores, com excepção da passagem voluntária de uma ficha.
- Bots que enviam mensagens a estudantes ou interessados.
- Texto das publicações. O app guarda números de lição e notas do utilizador, nunca conteúdo do livro.
- Rankings, pontuações ou comparações entre utilizadores.
- Assistente de IA, até haver evidência de procura.

## Ponto de partida

O código e o design já cobrem o registo de estudantes, visitas, relatórios e anotações. Falta tudo o que acompanha o percurso do estudante.

| Área | No código (branch dev) | No Figma | Falta para a versão 1 |
| --- | --- | --- | --- |
| Estudantes | Registo, edição e lista de estudantes, com nome, idade, género, contacto e morada | Registo em 2 passos, lista com pesquisa, detalhes | Etapas, marcos, captura rápida e localização |
| Visitas | Registo com notas, publicações, textos e resultado | Novo estudo ou visita, com estudante, data e hora | Lição e ponto, dúvida pendente e "não estava em casa" |
| Progresso no estudo | Não existe | Não existe | Tudo |
| Página inicial | Cronómetro e resumo | Semana, visitas do dia, horas e estudos | Atrasos e alertas por ritmo. O cronómetro sai do centro |
| Agendamento | Disponibilidade semanal por estudante, com notificação | Dias de visita no registo | Visitas com data marcada e pausa |
| Relatório | Registos diários de horas e estudantes, vistas mensal e anual, lembrete mensal | Gráfico por período | Formato novo por tipo de utilizador |
| Anotações | Completas, com etiquetas, cor, emoji e arquivo | Lista, detalhe e edição | Ligação opcional a um estudante |
| Conta | Login Google com Supabase | Login por e-mail com código | O app tem de funcionar sem conta. O Supabase sai |
| Protecção dos dados | Não existe | Ecrã de bloqueio da aplicação | Bloqueio e backup |

O código está na versão 1.0.3 e usa Expo 53, SQLite com Drizzle, NativeWind e Biome. A comparação tabela a tabela está em Modelo e fluxos de dados.

## Funcionalidades principais

São 14 funcionalidades que servem directamente o objectivo central, ordenadas por prioridade. As dez primeiras formam a versão 1.

| # | Funcionalidade | Descrição | Entra em |
| --- | --- | --- | --- |
| P1 | Ficha do estudante e percurso | Perfil de cada estudante com contacto, morada e etapa actual: primeiro contacto, revisita, estudo iniciado, estudo regular, publicador não batizado, batizado. Regista também marcos, como a primeira reunião assistida, primeiro discurso, Primeiro comentario, Primeiro convivio, duvidas e respostas | Versão 1 |
| P2 | Registo rápido de visita | Regista uma visita em poucos segundos: data, nota, textos usados, o que prometeu levar, resultado e próxima visita. O resultado tem três valores: encontrei o estudante, não estava em casa, ou remarcada (o estudante estava mas não pôde, e combinou-se outra data). A visita não guarda duração: as horas vêm só do cronómetro e da entrada manual. Inclui a opção de um toque "não estava em casa". | Versão 1 |
| P3 | Progresso no estudo | Mostra a lição actual das 60 do livro, a parte em que está (1 a 12, 13 a 33, 34 a 47, 48 a 60) e o ritmo. Por lição guarda o que o próprio livro pede: a data em que terminou e se cumpriu o "Tente o seguinte". Guarda também uma nota e as dúvidas pendentes. As revisões no fim de cada parte contam como marcos. | Versão 1 |
| P4 | Ecrã Hoje | Página inicial com os estudantes a visitar hoje e os que estão em atraso. Cada um pode ser marcada como feita ou adiada. | Versão 1 |
| P5 | Alertas por ritmo | Cada estudante tem um ritmo esperado, por exemplo semanal ou quinzenal. O app avisa quando alguém sai do seu ritmo, em vez de usar um número fixo de dias. | Versão 1 |
| P6 | Agendamento e lembretes | Marca a próxima visita com dia e hora e envia uma notificação local, na hora, 30 minutos antes ou 1 hora antes. As notificações são do próprio dispositivo, sem calendário externo. | Versão 1 |
| P7 | Captura no terreno | Cria um contacto em dez segundos com nome provisório, localização actual e uma linha de nota, para completar depois. | Versão 1 |
| P8 | Cartão de preparação | Antes da visita mostra a última conversa, a dúvida pendente, a lição seguinte e o que ficou prometido levar. | Versão 1 |
| P9 | Pausar e retomar | Põe um estudante em pausa com o motivo e uma data para tentar de novo. A lista activa fica limpa e ninguém se perde de vez. | Versão 1 |
| P10 | Localização e direcções | Guarda a localização da casa e abre o Google Maps com as direcções. A foto da casa entra na versão 2. | Versão 1 |
| P11 | Tentativas e melhor horário | A partir das visitas falhadas e conseguidas, mostra em que dias e horas o estudante costuma estar. | Versão 2 |
| P12 | Linha do tempo do estudante | Vista cronológica do percurso, do primeiro contacto até hoje, com visitas, lições e marcos. | Versão 2 |
| P13 | Foto da casa | Fotografia do local associada à ficha, guardada no dispositivo. | Versão 2 |
| P14 | Passar o estudante a outro publicador | Exporta a ficha de um estudante para um colega que vai continuar o acompanhamento. Só acontece por acção do utilizador. | Depois do lançamento |

## Funcionalidades secundárias

São 13 funcionalidades que servem o registo do próprio publicador ou protegem os dados. Sete entram na versão 1 porque já existem no app ou são baratas.

| # | Funcionalidade | Descrição | Entra em |
| --- | --- | --- | --- |
| S1 | Backup e restauro | Exporta todos os dados para um ficheiro, sem palavra-passe, e restaura-os noutro telemóvel. O restauro também está no ecrã de boas-vindas, para quem instala o app num telemóvel novo. Responde ao medo de perder os registos antes de existir sincronização. | Versão 1 |
| S2 | Relatório mensal automático | Gera o relatório conforme o tipo de utilizador, a partir das visitas e das horas, e partilha-o como texto por WhatsApp ou outro canal. | Versão 1 |
| S3 | Lembretes de fim de mês | Avisa quando o relatório está por enviar e quando o mês está a acabar sem participação registada. | Versão 1 |
| S4 | Cronómetro e horas | Modo pioneiro com cronómetro e entrada manual de horas. Inclui o plano do mês: os dias em que o pioneiro conta sair e as horas por dia necessárias para cumprir a meta. Já existe no app e passa a ser opcional para publicadores. | Versão 1 |
| S5 | Bloqueio do app | Protecção por PIN ou biometria ao abrir o app. | Versão 1 |
| S6 | Anotações | Notas livres com título, etiqueta e cor. Uma nota pode ficar ligada a um estudante e aparecer na ficha dele. Implementado. | Versão 1 |
| S7 | Conta e sincronização | Login no backend próprio, com Google em primeiro lugar e email e senha como alternativa, e sincronização entre dispositivos. Depois de entrar, a sessão mantém-se. Quem usa sem conta recebe avisos pontuais a convidar a entrar. O app continua totalmente utilizável sem conta. | Versão 2 |
| S9 | Cronómetro em segundo plano e metas | O cronómetro continua a contar com o app fechado. Mostra o progresso face à meta mensal do perfil. | Versão 2 |
| S10 | Retrospectiva mensal | Resumo pessoal do mês: estudantes acompanhados, visitas feitas, lições concluídas e marcos atingidos. Sem comparações com outros. | Lançamento |
| S11 | Estatísticas pessoais | Tempo médio entre contactos, dias mais produtivos e evolução ao longo dos meses. | Depois do lançamento |
| S12 | Mapa dos estudantes | Mapa com todos os estudantes e sugestão de quem está perto e sem visita recente. | Depois do lançamento |
| S13 | Versão web (PWA) | Versão instalável a partir do navegador, para quem usa iPhone. Substitui um app iOS oficial e depende da conta e da sincronização. | Depois do lançamento |
| S14 | Definições do app | Ecrã onde o utilizador ajusta o comportamento do app: tipo de publicador, língua, bloqueio, lembretes, ritmo por omissão, backup e privacidade. A lista completa está na secção Definições do app. | Versão 1 (essenciais), Lançamento (completas) |

## Requisitos transversais

Estes requisitos aplicam-se a todas as funcionalidades e a todas as versões.

- **Offline primeiro.** Tudo funciona sem internet e sem conta. O SQLite do telemóvel é a fonte de verdade, e o backend serve apenas conta, backup e sincronização.
- **Privacidade.** Os dados dos estudantes acompanhados são sensíveis. Ficam no dispositivo e, quando sincronizados, os campos pessoais e as notas são cifrados antes de saírem. O administrador não consegue lê-los.
- **Preparado para sincronizar.** Desde a versão 1, todas as tabelas usam identificadores UUID gerados no dispositivo, o que o código já faz, e ganham data de alteração e eliminação lógica.
- **Rapidez.** Registar uma visita ou um novo contacto tem de ser mais rápido do que escrever numa nota do telemóvel.
- **Simplicidade.** Cada ecrã mostra só o necessário. A pesquisa mostrou que o excesso de detalhe afasta os utilizadores.
- **Língua e tom.** Português e inglês desde a primeira versão, com linguagem de cuidado e acompanhamento. Sem termos de vendas nem métricas de conversão.
- **Dispositivos.** Android primeiro, incluindo telemóveis modestos. Depois, uma versão web instalável (PWA) para quem usa iPhone. Não haverá app iOS oficial.
- **Independência.** O app identifica-se como ferramenta pessoal não oficial e não usa marcas nem logótipos da organização.

## Medição de uso

O uso mede-se com contagens anónimas e opcionais, nunca com o conteúdo que o utilizador escreve.

- **Play Console.** O teste fechado mostra instalações, dispositivos activos e desinstalações sem escrever código.
- **Contagens anónimas.** As contagens começam desligadas. Só depois de o utilizador as ligar nas definições, o app envia apenas números: dias em que foi aberto, visitas registadas, estudantes criados e lições concluídas. Guarda-os offline e envia quando há internet.
- **Painel admin.** As contagens alimentam o painel que já existe, hoje com dados de exemplo. É a primeira peça real do backend e não toca em dados pessoais.
- **Conversa directa.** Um grupo com os testadores e uma pergunta quinzenal sobre o que usaram e o que faltou.

A métrica principal é o número de testadores que registam pelo menos uma visita por semana. Se esse número se mantiver durante quatro semanas, a versão 1 cumpriu o seu critério.

## Definições do app

| Definição | O que controla | Estado na branch dev | Entra em |
| --- | --- | --- | --- |
| Perfil e meta de horas | O formato do relatório e se o cronómetro aparece | Existe no perfil, com Publicador, Batizado e Pioneiro. Falta trocar pelos cinco perfis fixos e pelas suas metas | Versão 1 |
| Língua | Português ou inglês | Não existe | Versão 1 |
| Bloqueio do app | PIN ou biometria ao abrir | Não existe | Versão 1 |
| Lembrete do relatório mensal | Activar, horário, título, som e vibração | Existe, com ecrã próprio, estado das permissões e histórico. Dispara no dia 1 de cada mês | Versão 1 |
| Lembretes de visita por estudante | Dias da semana e hora de cada estudante | Existe, na disponibilidade do estudante | Versão 1 |
| Notificação do dia e alertas | Hora da notificação do dia e ritmo por omissão para revisitas e estudos | Não existe. O ecrã "Outras notificações" está vazio | Versão 1 |
| Backup e restauro | Exportar e restaurar o ficheiro de backup | Não existe | Versão 1 |
| Contagens anónimas | Ligar ou desligar o envio de contagens de uso | Não existe | Versão 1 |
| Tema | Claro, escuro ou igual ao sistema | Existe como interruptor no menu lateral, só claro e escuro | Versão 1 |
| Vista das listas | Lista ou cartões | Existe nos relatórios e nas anotações | Versão 1 |
| Conta e sincronização | Entrar, sair e apagar a conta e os dados no servidor | Não existe | Versão 2 |
| Dados e privacidade | Apagar todos os dados do telemóvel, política de privacidade e termos | Não existe | Lançamento |
| Ajuda e sobre | Ajuda, contacto, versão do app e aviso de que não é uma ferramenta oficial | Existe a versão do app. O guia do utilizador está vazio | Lançamento |

O estado foi lido no código da branch `dev` do [repositório](https://github.com/Antonio-Sitoe/PreachingApp/tree/dev), no commit de 8 de Dezembro de 2025. O design no Figma tem ainda um ecrã de definições com bloqueio da aplicação, idioma e termos e condições, que não estão implementados.

Um ponto a verificar no código: o agendamento do lembrete mensal parece usar sempre as 9h00 por omissão, em vez do horário que o utilizador guardou.

## Timeline

O projecto avança em quatro fases, e cada uma só começa quando a anterior cumpre o seu critério.

&#91;embedded content: roteiro · 4 fases, 3 critérios de passagem\]

A versão 1 não precisa de backend, por isso pode chegar aos testadores mais cedo. A sincronização, que é a parte mais cara, só avança depois de o app provar que é usado.

Com 7 horas por semana, a estimativa é esta. São ordens de grandeza, a rever no fim de cada fase.

| Fase | Esforço estimado | Duração | Data alvo |
| --- | --- | --- | --- |
| Versão 1 | 125 horas | 18 semanas | Fevereiro de 2027 |
| Versão 2 | 150 horas | 21 semanas | Julho de 2027 |
| Lançamento | 45 horas, mais 14 dias de teste fechado | 8 semanas | Setembro de 2027 |

Trabalho da versão 1, por ordem:

1. Migrar o modelo de dados: renomear cinco tabelas, acrescentar data de alteração e eliminação lógica, e criar as sete tabelas novas. Os identificadores já são UUID.
2. Corrigir os erros conhecidos: modo escuro e dados na lista de relatórios.
3. Adaptar o que já existe: ficha do estudante, visitas, relatório por tipo de utilizador e cronómetro opcional.
4. Construir o que é novo: progresso no estudo, ecrã Hoje, alertas por ritmo, captura no terreno, cartão de preparação e pausa.
5. Proteger os dados: backup por ficheiro e bloqueio do app.
6. Entregar aos testadores e recolher o uso real.

## Riscos e questões em aberto

O maior risco é o âmbito para um só programador, e não o mercado.

| Risco | Resposta |
| --- | --- |
| Âmbito grande para um programador | A versão 1 fica só local e reaproveita o que já existe. Nada da versão 2 começa antes de a versão 1 estar em uso. |
| Sincronização complexa e cara | Backup por ficheiro na versão 1. A sincronização só avança se os testadores a pedirem. |
| Dados sensíveis de terceiros | Cifra dos campos pessoais, bloqueio do app e política de privacidade clara antes do lançamento. |
| Amostra de pesquisa pequena e próxima | Validar com uso real na versão 1, e não com mais inquéritos. |
| Nome parecido com apps existentes | Rever o nome antes do lançamento. |
| A Play Store exige teste fechado a contas pessoais novas | Contas pessoais criadas depois de 13 de Novembro de 2023 precisam de 12 testadores inscritos durante 14 dias seguidos. Recrutar 15 ou mais, a começar pelos 14 publicadores da pesquisa. |
| Offline no navegador é diferente do Android | Fazer um protótipo da PWA com base de dados local antes de a prometer aos utilizadores de iPhone. |

## Decisões tomadas

| Tema | Decisão |
| --- | --- |
| Línguas | Português e inglês desde a primeira versão. |
| Plataformas | Android, depois PWA para iPhone. Sem app iOS oficial. |
| Estrutura do livro | Confirmada no [índice oficial](https://www.jw.org/pt/biblioteca/livros/seja-feliz-para-sempre/): 60 lições em 4 partes, cada parte com revisão e cada lição com data de conclusão e "Tente o seguinte". |
| Tempo disponível | 7 horas por semana. |
| Backend | Node.js com TypeScript é a recomendação, por partilhar tipos e validação com o app. Java continua em aberto. |
| Testadores | Ainda não há. Convidar os 14 publicadores da pesquisa e pedir a cada uma que traga mais alguém. |
| Nome | Em aberto. Candidatos: Revisita, Percurso, Semear, Caminho. |
| Lições e visitas | Uma lição pode levar várias visitas. Cada visita guarda a lição onde pararam. Quando a lição avança, o app fecha a anterior e abre a nova, com opção de desfazer. |
| Calendário e notificações | Sem Google Calendar. Lembretes e alertas são notificações locais do próprio dispositivo. A funcionalidade S8 foi retirada. |
| Horas de crédito | Fora do app. O pioneiro regista só as horas de pregação. Não há campo, coluna nem linha de relatório para crédito. |
| Perfis e metas | Cinco perfis fixos: publicador, pioneiro auxiliar (15 ou 30 horas), pioneiro regular (50), pioneiro especial (90 ou 100) e missionário (90 ou 100). Sem metas livres. |
| Terminologia | "Estudante" em todo o app e nos documentos, do primeiro contacto ao batismo. Nunca "pessoa". No modelo de dados, a tabela é students. |
| Anotações (S6) | Implementadas, segundo o Nairo a 11 de Outubro de 2026: lista e grelha, criação e edição em texto rico, etiquetas, cor, emoji, capa e arquivo. Na branch dev ainda não se vê a ligação a um estudante nem a vista guardada: confirmar. |
