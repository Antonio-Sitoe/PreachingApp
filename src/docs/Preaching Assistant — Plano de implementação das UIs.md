# Preaching Assistant — Plano de implementação das UIs

Oct 5, 2026 · @Nairo Mudumane

O plano cobre 45 ecrãs em 10 etapas: 26 a criar, 16 a modificar e 3 a manter. Inclui tudo o que o BRD marca como Versão 1 (39 ecrãs) e Versão 2 (6 ecrãs).

## Abordagem

O design novo nasce numa página nova do Figma, e a página "1.1.1 Current" fica intacta como referência.

- **Reaproveitar primeiro.** Os ecrãs actuais são copiados para a página nova e alterados lá. Cores, tipografia e componentes mantêm-se, salvo decisão em contrário.
- **Ordem pelos fluxos que decidem.** Primeiro Hoje, estudantes, visitas e estudo, que são o centro do BRD. Relatório, definições e entrada vêm depois.
- **Cada ecrã com os seus estados.** Vazio, preenchido, erro e confirmação são desenhados junto com o ecrã, e não no fim.
- **Uma etapa de cada vez.** No fim de cada etapa mostro-te o resultado no Figma e só avanço depois da tua revisão.
- **Português primeiro.** Os textos são escritos em português. O inglês e o tema escuro são verificados na etapa final.

Ficam fora deste plano as funcionalidades que o BRD marca para o lançamento ou depois: P14, S10, S11, S12, S13 e as definições de dados, privacidade e ajuda.

## Ponto de partida

A página "1.1.1 Current" tem 44 ecrãs em 9 secções, e a maior parte precisa de mudar porque foi desenhada à volta do registo e das horas, e não do percurso do estudante.

| Secção actual | Ecrãs | O que tem | Destino |
| --- | --- | --- | --- |
| Splash e login | 5 | Entrada por email, com erro de credenciais | Splash fica. O login é refeito com Google em primeiro lugar e email e senha como alternativa |
| Onboarding | 11 | Registo por email com código de confirmação | Substituído por uma configuração inicial sem conta |
| Home | 1 | Calendário, visitas do dia, horas e estudos | Passa a ser o ecrã Hoje |
| Definições | 3 | Menu, bloqueio, idioma, termos e perfil | Modificar e completar |
| Estudantes | 12 | Registo em 2 passos, lista, filtros, detalhes | Mantém o nome Estudantes. Faixa etária e género deixam de ser obrigatórios |
| Adicionar estudo | 6 | Tipo de actividade, estudante, data e hora | Passa a registo rápido de visita |
| Relatórios | 1 | Gráfico por período, horas e estudos | Refeito por tipo de utilizador |
| Doação | 2 | Pedido de apoio | Mantém-se, mas não está no BRD |
| Notas | 3 | Lista com etiquetas, criar e editar | Implementado |

Esta leitura vem dos nomes e textos das camadas no Figma. Ainda não vi os ecrãs renderizados, o que faço no início da etapa 1.

Não existem no Figma: progresso no estudo, captura no terreno, cartão de preparação, pausa, localização, cronómetro, backup e notificações.

## Mapa de ecrãs

Cada linha é um ecrã ou um grupo de estados do mesmo ecrã, ligado à funcionalidade do BRD que o justifica.

| # | Área | Ecrã | BRD | Acção | Versão |
| --- | --- | --- | --- | --- | --- |
| 1 | Entrada | Splash | Requisitos transversais | Modificar | 1 |
| 2 | Entrada | Boas-vindas, com o aviso de ferramenta pessoal não oficial | Requisitos transversais | Criar | 1 |
| 3 | Entrada | Configuração inicial: língua, tipo de publicador e permissões | S14 | Criar | 1 |
| 4 | Entrada | Bloqueio: criar PIN, desbloquear e biometria | S5 | Criar | 1 |
| 5 | Entrada | Entrar: Google em primeiro, email e senha, criar conta, recuperar senha e continuar sem conta | S7 | Modificar | 2 |
| 6 | Hoje | Hoje: visitas do dia, em atraso e alertas por ritmo | P4, P5 | Modificar | 1 |
| 7 | Hoje | Hoje vazio e dia concluído | P4 | Criar | 1 |
| 8 | Hoje | Marcar como feita ou adiar | P4 | Criar | 1 |
| 9 | Hoje | Cartão de preparação | P8 | Criar | 1 |
| 10 | Hoje | Bloco de horas e meta, só para pioneiros | S4 | Modificar | 1 |
| 11 | Estudantes | Lista: pesquisa, filtro por etapa, ordenação e em pausa | P1, P9 | Modificar | 1 |
| 12 | Estudantes | Captura no terreno | P7 | Criar | 1 |
| 13 | Estudantes | Criar e editar estudante: só o nome obrigatório, ritmo, dias e hora | P1, P5 | Modificar | 1 |
| 14 | Estudantes | Ficha do estudante | P1 | Modificar | 1 |
| 15 | Estudantes | Etapa do percurso e marcos | P1 | Criar | 1 |
| 16 | Estudantes | Localização e direcções | P10 | Criar | 1 |
| 17 | Estudantes | Pausar e retomar | P9 | Criar | 1 |
| 18 | Estudantes | Remover estudante, com confirmação | P1 | Modificar | 1 |
| 19 | Estudantes | Melhor horário | P11 | Criar | 2 |
| 20 | Estudantes | Linha do tempo | P12 | Criar | 2 |
| 21 | Estudantes | Foto da casa | P13 | Criar | 2 |
| 22 | Visitas | Registar visita: data, nota, textos, resultado, lição e próxima visita | P2 | Modificar | 1 |
| 23 | Visitas | "Não estava em casa" num toque, com desfazer | P2 | Criar | 1 |
| 24 | Visitas | Agendar a próxima visita | P6 | Modificar | 1 |
| 25 | Visitas | Histórico e detalhe de visita | P2 | Modificar | 1 |
| 26 | Visitas | Notificações locais: visita, dia e ritmo | P5, P6 | Criar | 1 |
| 27 | Estudo | Progresso: 60 lições em 4 partes, lição actual e ritmo | P3 | Criar | 1 |
| 28 | Estudo | Detalhe da lição: data, "Tente o seguinte", nota e dúvidas | P3 | Criar | 1 |
| 29 | Estudo | Avanço de lição com desfazer | P3 | Criar | 1 |
| 30 | Estudo | Revisão de parte como marco | P3 | Criar | 1 |
| 31 | Relatório | Relatório do mês, para publicador e para pioneiro, com partilha | S2 | Modificar | 1 |
| 32 | Relatório | Histórico de relatórios, em lista e em cartões | S2 | Modificar | 1 |
| 33 | Relatório | Cronómetro e entrada manual de horas | S4 | Criar | 1 |
| 34 | Relatório | Aviso de fim de mês | S3 | Criar | 1 |
| 35 | Relatório | Cronómetro em segundo plano e metas do mês e do ano | S9 | Criar | 2 |
| 36 | Notas | Lista de notas | S6 | Implementado | 1 |
| 37 | Notas | Criar e editar nota | S6 | Implementado | 1 |
| 38 | Definições | Menu Mais | S14 | Modificar | 1 |
| 39 | Definições | Perfil: tipo de publicador e metas de horas | S14 | Modificar | 1 |
| 40 | Definições | Gerais: língua, tema, bloqueio e vista das listas | S14 | Modificar | 1 |
| 41 | Definições | Notificação do dia, ritmo por omissão e lembrete do relatório | S14 | Criar | 1 |
| 42 | Definições | Backup e restauro | S1 | Criar | 1 |
| 43 | Definições | Contagens anónimas | Medição de uso | Criar | 1 |
| 44 | Definições | Conta e sincronização: sair, apagar, estado e avisos para entrar | S7 | Criar | 2 |
| 45 | Definições | Apoiar | Fora do BRD | Manter | 1 |

## Plano de actividades

São 10 etapas, e cada uma termina com ecrãs prontos no Figma para reveres. Os números na coluna Ecrãs são os do mapa acima.

| Etapa | Actividade | Ecrãs | Entrega |
| --- | --- | --- | --- |
| 1 | Preparar o Figma e os componentes base | Nenhum | Página nova criada, ecrãs reaproveitáveis copiados, e os componentes comuns: barra de navegação, cartão de estudante, etiqueta de etapa, folha inferior e estado vazio |
| 2 | Hoje | 6 a 10 | Ecrã inicial novo, com feito e adiar, cartão de preparação e variante para pioneiro |
| 3 | Estudantes: lista e criação | 11 a 13 | Lista com etapas e pausa, captura no terreno e formulário completo |
| 4 | Ficha do estudante | 14 a 18 | Ficha com etapa, marcos, localização, pausa e remoção |
| 5 | Visitas | 22 a 26 | Registo rápido, "não estava em casa", agendamento, histórico e notificações |
| 6 | Estudo | 27 a 30 | Progresso nas 60 lições, detalhe da lição, avanço com desfazer e revisões |
| 7 | Relatório e horas | 31 a 34 | Relatório por tipo de utilizador, histórico, cronómetro e aviso de fim de mês |
| 8 | Definições e entrada | 1 a 4, 36 a 43, 45 | Splash, boas-vindas, configuração inicial, bloqueio, menu, perfil, definições e backup. As notas já estão implementadas |
| 9 | Versão 2 | 5, 19 a 21, 35, 44 | Conta Google e sincronização, melhor horário, linha do tempo, foto da casa e metas |
| 10 | Revisão final | Todos | Textos em inglês verificados, tema escuro, protótipo navegável dos três fluxos principais e BRD actualizado |

A etapa 8 é a maior, com 13 ecrãs, mas a maioria são listas de opções simples. A entrada fica para essa etapa porque depende das definições de língua, tipo de publicador e bloqueio.

Os três fluxos do protótipo são os que o BRD aponta como decisivos: captura no terreno, registo de visita e dia de pregação.

## Calendário

O ritmo depende da tua revisão e não do desenho: com uma etapa revista por dia, as 10 etapas ficam em cerca de duas semanas. É uma estimativa minha, a corrigir depois da etapa 2, que é a primeira com ecrãs reais.

As etapas 1 a 8 fecham a versão 1 e podem seguir para implementação sem esperar pela etapa 9.

## Decisões tomadas

Nove decisões ficaram fechadas a 5 de Outubro de 2026. A palavra-passe do backup ficou decidida no mesmo dia: não leva.

| Decisão | Resultado |
| --- | --- |
| Tamanho do ecrã | 402 por 874, para reaproveitar os ecrãs actuais |
| Nome do separador | "Estudantes". Decisão do Nairo a 10 de Outubro de 2026: é o termo único em todo o app e nos documentos, do primeiro contacto ao batizado |
| Login | Google em primeiro lugar, com email e senha como alternativa. As duas formas são desenhadas já |
| Sessão | Depois de entrar, o app não volta a pedir login. Quem usa sem conta vê avisos pontuais a convidar a entrar, para ter backup na nuvem e sincronização |
| Tema escuro | Cores escuras definidas, e só os ecrãs principais desenhados nos dois temas |
| Faixa etária e género | Opcionais na ficha |
| Doação | Mantém-se como "Apoiar" no menu Mais |
| Nome do app | Preaching Assistant |
| Organização no Figma | O design novo é separado por páginas |
| Palavra-passe do backup | Sem palavra-passe |

Dois pontos a confirmar durante o trabalho:

- Li a decisão do login assim: o app continua utilizável sem conta, como diz o BRD, e os avisos servem para levar o utilizador a entrar. Se a ideia for obrigar ao login logo na entrada, o ecrã "Continuar sem conta" sai.
- A ligação ao Figma usa a conta do Antonio Sitoe, no plano Starter, que pode limitar o número de páginas por ficheiro.

## Estado da etapa 1

A etapa 1 está a meio, parada a 5 de Outubro de 2026 pelo limite de chamadas do conector Figma no plano Starter.

| Item | Estado |
| --- | --- |
| Variáveis de cor e medidas, 11 estilos de texto | Feito |
| 24 ícones, Avatar, Etiqueta de etapa, Botão, Barra de estado, Barra de navegação | Feito, por verificar visualmente |
| Cartão de estudante, folha inferior, estado vazio | Por fazer |
| Cópia dos ecrãs reaproveitáveis | Por fazer |

O plano Starter obrigou a dois desvios das decisões:

- Não deixa criar páginas. O design novo está na página "V1.1.2 Next release", que estava vazia, separado por secções em vez de páginas.
- Só permite um modo por colecção de variáveis. O tema escuro não pode ser um modo, e as cores escuras ficam por aplicar.

## Estado a 5 de Outubro de 2026

Os 45 ecrãs do plano estão desenhados no canvas do Claude Design, incluindo os da versão 2 (19, 20, 21 e 35). A etapa 10 está descrita na secção seguinte.

Decisões tomadas depois de importar os ecrãs antigos do Figma:

- O botão de acções do Hoje abre quatro opções: visita, estudo, novo contacto e horas.
- O registo de visita tem o resultado com três valores e não guarda duração.
- O ritmo de cada estudante aceita os atalhos semanal, quinzenal e mensal, ou um número de dias.
- Os marcos são texto livre, com exemplos.
- A localização abre no Google Maps; não há mapa dentro do app.
- O pioneiro tem um plano do mês com dias e horas por dia; há um ecrã de horas para cada tipo de publicador.
- Apoiar mostra o número e-Mola; o app não processa pagamentos.
- O código de confirmação tem 4 dígitos e a senha exige um carácter especial.
- O ficheiro de backup não leva palavra-passe.
- Tipo de letra e cor dos botões ficam como estão no canvas.

## Etapa 10: revisão final

A etapa 10 está feita, excepto o inglês, que fica para depois da revisão do Nairo. O canvas tem 103 artboards em 10 páginas.

| Ponto da etapa 10 | Estado | Como foi feito |
| --- | --- | --- |
| Revisão visual | Feita | Os 103 artboards foram renderizados fora do canvas, com as fontes reais, e vistos um a um. Nenhum tem conteúdo cortado nem texto a sair da caixa |
| Navegação | Feita | 19 percursos verificados nas ligações, incluindo os três fluxos principais. Não foi testado em modo Play dentro do canvas |
| Estados de cada ecrã | Feitos | 16 artboards novos: listas vazias, erros de formulário e confirmações |
| Tema escuro | Feito | Seis ecrãs principais: Hoje, Estudantes, ficha do estudante, registar visita, progresso no estudo e menu Mais |
| BRD actualizado | Feito | Backup sem palavra-passe, plano do mês do pioneiro, visita sem duração, campos em falta no modelo de dados |
| Inglês | Por fazer | Fica como última coisa, depois da revisão |

Correcções feitas na revisão visual:

- O botão de acções do Hoje tapava o botão Agendar do último cartão.
- Vinte e um artboards tinham altura a mais ou a menos e foram ajustados ao conteúdo.
- O fundo do ecrã de planear o mês mostrava a meta de 50 h em vez de 30 h.

Ecrãs que só se abrem pelo canvas, por serem estados alternativos: erros de login e de código, listas vazias, Hoje vazio e dia concluído, avisos de fim de mês, cronómetro em segundo plano, horas do pioneiro regular e as variantes escuras.

Duas decisões novas a confirmar pelo Nairo:

- Esquecer o PIN: o ecrã diz que o PIN não se recupera e que é preciso restaurar a última cópia.
- PIN errado: o ecrã fala em 3 tentativas antes de esperar 1 minuto.
