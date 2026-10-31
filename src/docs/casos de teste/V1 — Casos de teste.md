# Preaching Assistant — Casos de teste da versão 1

Lista para testar à mão tudo o que a versão 1 tem: funcionalidade, fluidez, usabilidade, responsividade e desempenho. Cada caso tem os passos e o resultado esperado. Marca a caixa quando o caso passar; quando falhar, deixa por marcar e escreve a falha por baixo, com o telemóvel e a versão do Android.

O que cada caso cobre está no [backlog da versão 1](../backlog/V1%20—%20Primeira%20fase.md). Os ecrãs de referência estão no [canvas Design 2.0](https://claude.ai/artifact/Ja8xqKnSJ3L61wqBXRgcA1).

## Antes de começar

### Telemóveis e definições

Correr os casos marcados com **[R]** (responsividade) em pelo menos três combinações:

- [ ] Telemóvel pequeno: 360 × 640 dp, ou um Android de entrada de gama (ex.: Galaxy A0x, Redmi série A)
- [ ] Telemóvel médio ou grande: 411 × 891 dp ou mais (ex.: Pixel 7 ou 9)
- [ ] Tablet ou ecrã largo: 600 dp ou mais de largura
- [ ] Letra do sistema a 130% (Definições do Android › Ecrã › Tamanho da letra) no telemóvel pequeno
- [ ] Navegação por gestos e navegação por 3 botões
- [ ] Tema claro e tema escuro

No emulador, o tamanho e a letra mudam-se assim (repor no fim com `reset`):

```bash
adb shell wm size 720x1280 && adb shell wm density 320 && adb shell settings put system font_scale 1.3
```

### Dados de teste

- [ ] Um utilizador publicador e outro pioneiro regular (muda-se em Mais › Perfil)
- [ ] Pelo menos 5 estudantes em etapas diferentes, um com nome provisório, um em pausa e um com estudo começado
- [ ] Um estudante com nome muito comprido (40 caracteres ou mais) e outro com acentos e cedilhas
- [ ] Uma cópia de segurança exportada antes de testar o restauro e o PIN esquecido

### Como ler os casos

- **[F]** funcionalidade · **[U]** usabilidade e textos · **[R]** responsividade · **[D]** desempenho e fluidez
- "Toast" é o aviso que aparece em baixo durante 5 segundos, às vezes com **Desfazer**

## 1. Transversais

Valem para todos os ecrãs. Passa por eles no fim de cada secção.

### Fluidez e desempenho

- [ ] **CT-GER-01 [D]** Abrir o app a frio (depois de o fechar nas recentes). → O Hoje aparece em menos de 3 segundos num telemóvel médio, sem ecrã branco depois do splash
- [ ] **CT-GER-02 [D]** Fazer scroll rápido na lista de pessoas com 50 ou mais estudantes. → Sem saltos nem linhas em branco
- [ ] **CT-GER-03 [D]** Abrir e fechar uma folha inferior (ex.: Adiar) 10 vezes seguidas. → A animação é suave e a folha nunca fica presa a meio
- [ ] **CT-GER-04 [D]** Guardar uma visita e voltar ao Hoje. → A lista já está actualizada ao chegar, sem precisar de puxar para actualizar
- [ ] **CT-GER-05 [D]** Usar o app 10 minutos seguidos a navegar entre separadores. → Não fica mais lento, não aquece de forma anormal e não aparece "O app não está a responder"
- [ ] **CT-GER-06 [D]** Tocar duas vezes rápido em "Guardar" num formulário. → Grava uma só vez
- [ ] **CT-GER-07 [D]** Deixar o app em segundo plano 10 minutos e voltar. → Volta ao mesmo ecrã (ou ao bloqueio, se estiver ligado), com os dados que lá estavam

### Usabilidade

- [ ] **CT-GER-08 [U]** Em cada ecrã, a seta de voltar e o gesto de voltar do Android levam ao ecrã anterior, sem saltar passos nem fechar o app
- [ ] **CT-GER-09 [U]** Todos os botões e linhas tocáveis têm pelo menos 44 dp de altura e reagem ao toque (mudam de cor)
- [ ] **CT-GER-10 [U]** Os textos estão em português de Portugal, sem gralhas, e falam com o utilizador por "tu"
- [ ] **CT-GER-11 [U]** Cada acção que apaga ou muda muito (remover, apagar, restaurar) pede confirmação ou mostra Desfazer
- [ ] **CT-GER-12 [U]** Com o TalkBack ligado, os botões só com ícone dizem o que fazem (ex.: "Mês anterior", "Voltar")
- [ ] **CT-GER-13 [U]** O teclado não tapa o campo que está a ser escrito, e "Guardar" continua alcançável com o teclado aberto

### Responsividade

- [ ] **CT-GER-14 [R]** No telemóvel pequeno com letra a 130%, nenhum texto fica cortado sem reticências e nada sai do ecrã na horizontal
- [ ] **CT-GER-15 [R]** As folhas inferiores altas têm scroll e não tapam a barra de estado
- [ ] **CT-GER-16 [R]** No tablet, o conteúdo fica centrado e limitado a uma largura de leitura (cerca de 640 dp), sem linhas esticadas de lado a lado
- [ ] **CT-GER-17 [R]** Rodar o telemóvel para horizontal num formulário. → Nada se perde do que foi escrito
- [ ] **CT-GER-18 [R]** Com navegação por 3 botões, o botão + e a barra de separadores não ficam por baixo dos botões do sistema

### Tema

- [ ] **CT-GER-19 [U]** Em Mais › Gerais › Tema, alternar Claro, Escuro e Do sistema. → Todos os ecrãs, folhas, diálogos e toasts mudam de cores, sem texto escuro sobre fundo escuro
- [ ] **CT-GER-20 [U]** Com Do sistema, mudar o tema do Android com o app aberto. → O app acompanha

### Sem internet

- [ ] **CT-GER-21 [F]** Ligar o modo de avião e usar todas as funcionalidades da versão 1. → Tudo funciona, excepto abrir o Google Maps e partilhar por apps que precisam de rede

## 2. Primeira abertura (ENT-01, ENT-02)

Testar com o app acabado de instalar, ou depois de apagar os dados do app nas definições do Android.

- [ ] **CT-ENT-01 [F]** Abrir o app pela primeira vez. → Splash e depois as boas-vindas com **Começar** e a opção de restaurar uma cópia
- [ ] **CT-ENT-02 [F]** Começar › escrever o nome › escolher o tipo de publicador › Seguinte. → Passa ao passo 2 de 2, das permissões
- [ ] **CT-ENT-03 [F]** Tentar avançar sem nome. → Não avança e diz o que falta
- [ ] **CT-ENT-04 [F]** No passo das permissões, aceitar as notificações e a localização. → O Android pede cada uma; o app abre no Hoje
- [ ] **CT-ENT-05 [F]** Repetir recusando todas as permissões. → O app abre e funciona; os lembretes simplesmente não aparecem
- [ ] **CT-ENT-06 [F]** Fechar e voltar a abrir o app. → Vai directo ao Hoje; as boas-vindas não voltam
- [ ] **CT-ENT-07 [F]** Nas boas-vindas, restaurar uma cópia válida. → Os dados da cópia aparecem e o app abre no Hoje
- [ ] **CT-ENT-08 [F]** Restaurar um ficheiro que não é uma cópia do app. → Mensagem de erro e nada é apagado
- [ ] **CT-ENT-09 [R]** Correr os passos acima no telemóvel pequeno com letra a 130%. → Os botões de baixo nunca ficam tapados

## 3. Bloqueio do app (ENT-03)

- [ ] **CT-LCK-01 [F]** Mais › Gerais › Pedir PIN ao abrir › criar PIN de 4 dígitos e confirmar. → Pergunta se quer usar a impressão digital ou o rosto
- [ ] **CT-LCK-02 [F]** Confirmar o PIN com dígitos diferentes. → Diz que não coincidem e deixa repetir
- [ ] **CT-LCK-03 [F]** Activar a biometria, fechar e reabrir o app. → Pede a impressão digital; ao aceitar, abre o app
- [ ] **CT-LCK-04 [F]** Cancelar a biometria. → Mostra o teclado do PIN
- [ ] **CT-LCK-05 [F]** Errar o PIN 3 vezes. → Bloqueia novas tentativas durante 1 minuto, com a contagem visível
- [ ] **CT-LCK-06 [F]** Tocar em "Esqueceste-te do PIN?". → Explica que o PIN não se recupera e oferece apagar os dados deste telemóvel, com confirmação
- [ ] **CT-LCK-07 [F]** Apagar os dados pelo PIN esquecido e restaurar a cópia nas boas-vindas. → Os dados voltam e o bloqueio fica desligado
- [ ] **CT-LCK-08 [F]** Alterar o PIN em Mais › Gerais. → Pede o PIN actual antes do novo
- [ ] **CT-LCK-09 [F]** Desligar "Pedir PIN ao abrir". → Ao reabrir, entra sem PIN
- [ ] **CT-LCK-10 [F]** Ir para segundo plano e voltar com o bloqueio ligado. → Pede o PIN, sem mostrar o conteúdo do app antes
- [ ] **CT-LCK-11 [R]** Teclado do PIN no telemóvel pequeno com letra a 130%. → As 10 teclas e "Esqueceste-te do PIN?" cabem sem scroll

## 4. Hoje (HOJ-01 a HOJ-06)

### Ecrã e estados

- [ ] **CT-HOJ-01 [F]** Abrir o Hoje com visitas marcadas para hoje. → Data no topo, semana com o dia de hoje destacado e pontos nos dias com marcações, resumo do mês e "Visitas de hoje" com "x de y feitas"
- [ ] **CT-HOJ-02 [F]** Tocar noutro dia da semana. → Mostra as marcações desse dia
- [ ] **CT-HOJ-03 [F]** Ter uma marcação de ontem por cumprir. → Aparece em "Em atraso" com o número e "há N dias"
- [ ] **CT-HOJ-04 [F]** Um estudante sem marcação que passou do seu ritmo. → Aparece em "A sair do ritmo" com o botão Agendar
- [ ] **CT-HOJ-05 [F]** Pôr esse estudante em pausa. → Desaparece de "A sair do ritmo" e de "Em atraso"
- [ ] **CT-HOJ-06 [F]** Dia sem nada marcado e ninguém em atraso. → Estado "Hoje vazio"
- [ ] **CT-HOJ-07 [F]** Dar por feitas todas as visitas de hoje. → Estado "Dia concluído" com "Feitas hoje" e "Amanhã"
- [ ] **CT-HOJ-08 [F]** Como publicador. → O resumo mostra estudos e estudantes, sem horas
- [ ] **CT-HOJ-09 [F]** Como pioneiro. → Mostra também as horas do mês, a barra da meta e o que falta
- [ ] **CT-HOJ-10 [R]** No telemóvel pequeno com letra a 130%: a semana mostra os 7 dias sem cortar, os círculos são redondos e os cartões do resumo não transbordam

### Feita ou adiar (HOJ-02)

- [ ] **CT-HOJ-11 [F]** Tocar no visto de uma visita de hoje › Visita feita. → Abre o Registar visita já com a pessoa
- [ ] **CT-HOJ-12 [F]** › Não estava em casa. → Regista a tentativa num toque e abre a folha com Desfazer e Tentar de novo
- [ ] **CT-HOJ-13 [F]** › Adiar › Amanhã. → A visita passa para amanhã; o toast tem Desfazer
- [ ] **CT-HOJ-14 [F]** Tocar em Desfazer logo a seguir. → A visita volta para hoje
- [ ] **CT-HOJ-15 [F]** Adiar › Escolher data. → Abre o calendário; a data escolhida é a da marcação

### Acções rápidas (HOJ-03)

- [ ] **CT-HOJ-16 [F]** Tocar no botão + do Hoje. → Folha com Visita, Estudo, Novo contacto e Horas
- [ ] **CT-HOJ-17 [F]** Visita › escolher a pessoa. → Abre o Registar visita
- [ ] **CT-HOJ-18 [F]** Estudo. → Abre o Registar visita com "Estudaram o livro?" em Sim
- [ ] **CT-HOJ-19 [F]** Novo contacto. → Abre a captura no terreno
- [ ] **CT-HOJ-20 [F]** Horas. → Abre a entrada de horas

### Notificação do dia e preparação (HOJ-05, HOJ-06)

- [ ] **CT-HOJ-21 [F]** Em Mais › Notificações, pôr a hora do resumo 2 minutos à frente. → Chega a notificação "Hoje tens N visitas · …" ou o aviso de quem está em atraso
- [ ] **CT-HOJ-22 [F]** Num dia sem nada a dizer. → Não chega notificação
- [ ] **CT-HOJ-23 [F]** Tocar na notificação do dia. → Abre o Hoje
- [ ] **CT-HOJ-24 [F]** Abrir a preparação a partir de um cartão do Hoje. → Última conversa, dúvida pendente (a última por responder), cartão do estudo e "Prometi levar" com caixas
- [ ] **CT-HOJ-25 [F]** Marcar uma caixa de "Prometi levar", sair e voltar. → Continua marcada
- [ ] **CT-HOJ-26 [F]** Tocar em Direcções e em Registar visita na preparação. → Abrem o Google Maps e o registo
- [ ] **CT-HOJ-27 [U]** Avisos de fim de mês no topo do Hoje (relatório por enviar). → Aparecem só nos últimos dias do mês ou no início do seguinte, e podem ser dispensados

## 5. Pessoas (PES-01 a PES-10)

### Lista (PES-01)

- [ ] **CT-PES-01 [F]** Abrir Pessoas. → Lista das pessoas activas com etapa, lição e próxima visita
- [ ] **CT-PES-02 [F]** Pesquisar por parte do nome, sem acentos (ex.: "joao" encontra "João"). → Filtra enquanto se escreve
- [ ] **CT-PES-03 [F]** Pesquisar um nome que não existe. → Estado "sem resultados"
- [ ] **CT-PES-04 [F]** Mudar a ordenação. → A lista reordena e a escolha mantém-se ao voltar ao separador
- [ ] **CT-PES-05 [F]** Sem nenhuma pessoa. → Estado "lista vazia" com o botão para criar
- [ ] **CT-PES-06 [F]** Ver a lista "Em pausa". → Só quem está em pausa, com a data para tentar de novo
- [ ] **CT-PES-07 [R]** Nome com 40 caracteres ou mais. → Fica numa linha com reticências, sem empurrar a etapa para fora

### Captura no terreno (PES-06)

- [ ] **CT-PES-08 [F]** Novo contacto › só um nome › Guardar. → Fica gravado em menos de 10 segundos, com a localização actual e marcado como nome provisório
- [ ] **CT-PES-09 [F]** Guardar sem nome. → Mostra o erro no campo
- [ ] **CT-PES-10 [F]** Preencher "Quando voltas?". → Cria a marcação e aparece no Hoje desse dia
- [ ] **CT-PES-11 [F]** Sem permissão de localização. → Grava na mesma, sem localização
- [ ] **CT-PES-12 [F]** "Preencher a ficha completa". → Abre o formulário com o que já foi escrito

### Criar e editar (PES-02, PES-10)

- [ ] **CT-PES-13 [F]** Criar com só o nome. → Grava; os outros campos ficam vazios
- [ ] **CT-PES-14 [F]** Preencher todos os campos (telefone, morada, etapa, ritmo de 7, 14, 30 dias ou outro número, faixa etária, género, dias e hora habituais). → Ao reabrir a edição, está tudo como foi gravado
- [ ] **CT-PES-15 [F]** Ritmo com um número inválido (0 ou letras). → Não aceita e explica
- [ ] **CT-PES-16 [F]** Escolher os dias habituais (ex.: sábado de manhã). → A próxima visita sugerida cai num sábado depois do ritmo
- [ ] **CT-PES-17 [F]** Sair do formulário com alterações por guardar. → Pergunta se quer descartar
- [ ] **CT-PES-18 [R]** Formulário no telemóvel pequeno com letra a 130%. → Todos os campos acessíveis por scroll e Guardar visível

### Ficha (PES-03)

- [ ] **CT-PES-19 [F]** Abrir uma pessoa. → Cabeçalho com iniciais e etapa, Registar visita, Ligar, Direcções, próxima visita, ritmo, estudo, dúvida pendente e as três últimas visitas
- [ ] **CT-PES-20 [F]** Ligar. → Abre o marcador do telefone com o número
- [ ] **CT-PES-21 [F]** Pessoa sem telefone. → O botão Ligar não aparece ou fica desactivado com explicação
- [ ] **CT-PES-22 [F]** Pessoa com nome provisório. → A ficha mostra que o nome é provisório e convida a completar

### Etapa e marcos (PES-04, PES-05)

- [ ] **CT-PES-23 [F]** Tocar na etiqueta da etapa › "Passar a …". → Avança uma etapa; o toast tem Desfazer
- [ ] **CT-PES-24 [F]** Desfazer. → Volta à etapa anterior
- [ ] **CT-PES-25 [F]** Novo marco com um exemplo sugerido e uma data. → Aparece na lista de marcos com a data
- [ ] **CT-PES-26 [F]** Recuar uma etapa pelo formulário de editar. → A etapa muda e fica no histórico

### Localização (PES-07)

- [ ] **CT-PES-27 [F]** Direcções › guardar a posição actual. → Fica gravada com a data
- [ ] **CT-PES-28 [F]** Abrir no Google Maps. → Abre as direcções até ao ponto (ou até à morada, se não houver ponto)
- [ ] **CT-PES-29 [F]** Escrever "Como chegar". → Aparece na ficha e na preparação
- [ ] **CT-PES-30 [F]** Num telemóvel real com GPS. → O ponto gravado fica na casa certa (o emulador não serve para este)

### Pausar, retomar e remover (PES-08, PES-09)

- [ ] **CT-PES-31 [F]** Pausar com motivo, nota e data para tentar de novo. → Sai da lista activa e entra em "Em pausa"; deixa de ter lembretes
- [ ] **CT-PES-32 [F]** Retomar na lista Em pausa ou na ficha. → Volta à lista activa
- [ ] **CT-PES-33 [F]** Remover. → Primeiro oferece a pausa; ao confirmar a remoção, sai de todas as listas e as marcações por cumprir são canceladas
- [ ] **CT-PES-34 [F]** Depois de remover. → Não aparece no Hoje, na pesquisa nem nas notificações

## 6. Visitas (VIS-01 a VIS-05)

### Registar visita (VIS-01, VIS-03)

- [ ] **CT-VIS-01 [F]** Registar visita a partir da ficha. → Pessoa já escolhida, dia e hora de agora
- [ ] **CT-VIS-02 [F]** Registar visita a partir do botão +. → Pede primeiro a pessoa
- [ ] **CT-VIS-03 [F]** Preencher conversa, textos usados, dúvida pendente e "Prometi levar" › Guardar. → Aparece no histórico e na ficha
- [ ] **CT-VIS-04 [F]** Mudar o dia para ontem e a hora. → A visita fica com essa data
- [ ] **CT-VIS-05 [F]** "Próxima visita" sugerida. → Data pelo ritmo e pelos dias habituais, com a explicação de onde veio
- [ ] **CT-VIS-06 [F]** Mudar a próxima visita (atalhos de 7 e 14 dias, dia, hora, Avisar). → Grava a marcação com o aviso escolhido
- [ ] **CT-VIS-07 [F]** Guardar uma visita com uma marcação de hoje por cumprir. → A marcação fica dada por feita no Hoje
- [ ] **CT-VIS-08 [F]** Resultado "Remarcada". → Grava sem contar como encontro

### Não estava em casa (VIS-02)

- [ ] **CT-VIS-09 [F]** Resultado "Não estava" › Guardar. → Abre a folha "Tentativa guardada" com Desfazer e Tentar de novo
- [ ] **CT-VIS-10 [F]** Tentar de novo › Sábado. → Cria a marcação para sábado
- [ ] **CT-VIS-11 [F]** Desfazer na folha. → A tentativa é apagada e o formulário volta como estava

### Lembretes (VIS-04)

- [ ] **CT-VIS-12 [F]** Marcar uma visita para daqui a 35 minutos com aviso de 30 minutos antes. → A notificação chega na hora certa, com o nome, a hora, a lição e o que levar
- [ ] **CT-VIS-13 [F]** Tocar no lembrete. → Abre a preparação dessa pessoa
- [ ] **CT-VIS-14 [F]** Adiar ou apagar a marcação antes da hora. → O lembrete antigo não chega
- [ ] **CT-VIS-15 [F]** Pôr a pessoa em pausa. → Os lembretes dela não chegam
- [ ] **CT-VIS-16 [F]** Com o telemóvel em poupança de bateria ou em Não incomodar. → Anotar se o lembrete chega a horas (comportamento do Android, não do app)
- [ ] **CT-VIS-17 [F]** Reiniciar o telemóvel com uma visita marcada para mais tarde. → O lembrete continua a chegar

### Histórico e detalhe (VIS-05)

- [ ] **CT-VIS-18 [F]** Ficha › Últimas visitas › Ver todas. → Histórico por mês com os filtros Todas, Com estudo e Tentativas
- [ ] **CT-VIS-19 [F]** Pessoa sem visitas. → Estado "histórico vazio"
- [ ] **CT-VIS-20 [F]** Abrir uma visita. → Tudo o que foi registado, incluindo a próxima visita marcada nessa visita
- [ ] **CT-VIS-21 [F]** Editar a visita e guardar. → As alterações aparecem no detalhe, no histórico e na ficha
- [ ] **CT-VIS-22 [F]** Apagar a visita, com confirmação. → Sai do histórico e as marcações que tinha dado por feitas voltam a estar por cumprir

## 7. Estudo (EST-01 a EST-06)

- [ ] **CT-EST-01 [F]** Pessoa sem estudo › ficha › Estudo por começar › Registar visita com estudo › lição 1 › Guardar. → Toast "Estudo iniciado na lição 1." e a etapa passa a Estudo iniciado
- [ ] **CT-EST-02 [F]** Nova visita com estudo. → A lição vem por omissão na lição actual
- [ ] **CT-EST-03 [F]** Escolher a lição seguinte. → Aparece a nota "A lição N fica fechada com a data desta visita…" e o interruptor "Tente o seguinte" da lição que fecha
- [ ] **CT-EST-04 [F]** Guardar. → Toast "Lição N fechada. A M é agora a actual." com Desfazer
- [ ] **CT-EST-05 [F]** Tocar em Desfazer nos 5 segundos. → A lição nova desaparece, a anterior volta a estar em curso e a etapa volta, se tinha mudado
- [ ] **CT-EST-06 [F]** Saltar uma lição (ex.: da 3 para a 5). → Pergunta "A lição 4 também ficou concluída?" com "Sim, ficou concluída" e "Não, saltaram-na"
- [ ] **CT-EST-07 [F]** Saltar várias (ex.: da 3 para a 7) e responder Sim. → Toast "Lições 3 a 6 fechadas…"; as intermédias ficam concluídas com a data da visita
- [ ] **CT-EST-08 [F]** Responder "Não, saltaram-nas". → Só a lição em curso fecha; as intermédias ficam por fazer
- [ ] **CT-EST-09 [F]** Marcar à mão uma lição como concluída no detalhe e depois registar a seguinte. → A lição actual fecha na mesma (a que ainda não tinha registo)
- [ ] **CT-EST-10 [F]** Progresso no estudo (tocar no cartão do estudo). → Lição N de 60, barra, ritmo, as 4 partes e a grelha de 6 colunas da parte em curso
- [ ] **CT-EST-11 [F]** Tocar numa lição da grelha. → Detalhe da lição: datas, visitas nesta lição, "Tente o seguinte", nota e dúvidas pendentes
- [ ] **CT-EST-12 [F]** Escrever uma nota da lição e voltar. → A nota fica guardada
- [ ] **CT-EST-13 [F]** Tocar em "Respondida" numa dúvida. → Sai do detalhe, da ficha e da preparação
- [ ] **CT-EST-14 [F]** Fechar a lição 12 com uma visita. → Abre a folha "Terminaram a parte 1"
- [ ] **CT-EST-15 [F]** Guardar como marco com data e nota. → O marco "Revisão da parte 1" aparece em Etapa e marcos e a parte mostra "Concluída · revista"
- [ ] **CT-EST-16 [F]** "Ainda não fizemos a revisão". → A folha fecha; tocar mais tarde na parte concluída volta a abri-la
- [ ] **CT-EST-17 [F]** Cartão do estudo na ficha e na preparação. → Lição, parte, barra e ritmo iguais aos do Progresso no estudo
- [ ] **CT-EST-18 [U]** Editar uma visita antiga e mudar a lição. → Anotar o resultado: hoje o avanço não é recalculado ao editar (limitação conhecida)
- [ ] **CT-EST-19 [R]** Progresso no estudo e detalhe no telemóvel pequeno com letra a 130%. → A grelha mantém 6 colunas e os números cabem nos quadrados

## 8. Notas

- [ ] **CT-NOT-01 [F]** Criar uma nota com título, texto, etiqueta e cor. → Aparece na lista com a cor e a etiqueta
- [ ] **CT-NOT-02 [F]** Ligar a nota a uma pessoa ("Sobre alguém"). → A nota mostra o nome da pessoa
- [ ] **CT-NOT-03 [F]** Pesquisar pelo título e pelo texto. → Encontra a nota
- [ ] **CT-NOT-04 [F]** Filtrar por etiqueta. → Só as notas dessa etiqueta
- [ ] **CT-NOT-05 [F]** Alternar entre lista e cartões (Mais › Gerais › Vista das listas). → A vista muda e mantém-se
- [ ] **CT-NOT-06 [F]** Apagar uma nota, com confirmação. → Sai da lista
- [ ] **CT-NOT-07 [F]** Sem notas. → Estado "lista vazia"
- [ ] **CT-NOT-08 [D]** Nota com texto muito longo (várias páginas). → Escrever e fazer scroll sem atrasos
- [ ] **CT-NOT-09 [R]** Cartões no telemóvel pequeno e no tablet. → As colunas ajustam-se à largura

## 9. Relatório e horas (REL-01 a REL-09)

- [ ] **CT-REL-01 [F]** Publicador › Mais › Relatórios › mês actual. → "Participei no ministério" calculado das visitas e o número de estudos
- [ ] **CT-REL-02 [F]** Pioneiro. → Horas do mês e número de estudos
- [ ] **CT-REL-03 [F]** Corrigir o número de estudos à mão. → Fica o valor corrigido; o automático pode ser reposto
- [ ] **CT-REL-04 [F]** Partilhar. → Abre a partilha do Android com o texto do relatório; o relatório fica marcado como enviado, com Desfazer
- [ ] **CT-REL-05 [F]** Fechar a partilha sem enviar. → Anotar se fica marcado como enviado (por confirmar no Android)
- [ ] **CT-REL-06 [F]** "Marcar como enviado sem partilhar" e "Marcar como por enviar". → O estado muda
- [ ] **CT-REL-07 [F]** Mês anterior e mês seguinte. → Navega entre meses; não deixa ir para o futuro
- [ ] **CT-REL-08 [F]** Ver meses anteriores. → Histórico em lista ou em cartões, conforme a definição; vazio quando não há meses
- [ ] **CT-REL-09 [F]** Horas › Adicionar horas à mão. → Fica na lista do dia com a origem manual; apagar tem Desfazer
- [ ] **CT-REL-10 [F]** Cronómetro: iniciar, pausar, retomar e terminar. → Grava o tempo certo no dia
- [ ] **CT-REL-11 [F]** Iniciar o cronómetro e fechar o app. → A notificação fixa continua a contar; parar pela notificação grava o tempo
- [ ] **CT-REL-12 [F]** Pioneiro › Plano do mês › escolher dias da semana e horas por dia. → Mostra as horas em falta e os próximos dias; acertar um dia actualiza o total
- [ ] **CT-REL-13 [F]** Pioneiro regular. → Meta do mês e progresso das 600 horas do ano de serviço (Setembro a Agosto)
- [ ] **CT-REL-14 [F]** Último dia do mês com o relatório por enviar. → Aviso no Hoje e notificação à hora escolhida
- [ ] **CT-REL-15 [F]** Mudar de publicador para pioneiro a meio do mês. → O relatório do mês passa a pedir horas; os meses anteriores ficam como estavam
- [ ] **CT-REL-16 [R]** Relatório e horas no telemóvel pequeno com letra a 130%. → O número grande das horas e os botões cabem

## 10. Mais e definições (DEF-01 a DEF-07)

- [ ] **CT-DEF-01 [F]** Mais. → Atalhos Relatórios, Horas e Apoiar, e as definições
- [ ] **CT-DEF-02 [F]** Perfil: mudar o nome, o tipo de publicador e a meta. → O Hoje e o relatório reflectem a mudança
- [ ] **CT-DEF-03 [F]** Gerais › Língua. → Anotar o resultado: a troca para inglês ainda não muda os textos (LAN-01)
- [ ] **CT-DEF-04 [F]** Notificações: hora do resumo do dia, antecedência dos lembretes, lembrete do relatório, som e vibração. → Cada mudança é respeitada nas notificações seguintes
- [ ] **CT-DEF-05 [F]** Ritmo por omissão das revisitas e dos estudos. → Uma pessoa nova fica com o ritmo da etapa
- [ ] **CT-DEF-06 [F]** Android 12 ou mais: "Alarmes e lembretes". → Leva às definições do Android para os lembretes à hora certa
- [ ] **CT-DEF-07 [F]** Backup › Exportar cópia. → Guarda ou partilha o ficheiro
- [ ] **CT-DEF-08 [F]** Backup › Restaurar de um ficheiro, com confirmação. → Substitui os dados pelos da cópia e as notificações voltam a ser agendadas
- [ ] **CT-DEF-09 [F]** Restaurar uma cópia de uma versão anterior do app. → Restaura e aplica as migrações, sem perder dados
- [ ] **CT-DEF-10 [F]** Contagens anónimas: ligar e desligar. → Desligado por omissão; o ecrã explica o que nunca sai do telemóvel
- [ ] **CT-DEF-11 [F]** Apoiar › Copiar. → Copia o número de e-Mola; o toast confirma

## 11. Integridade dos dados

- [ ] **CT-DAT-01 [F]** Fechar o app à força (nas recentes) logo depois de Guardar. → O que foi guardado está lá ao reabrir
- [ ] **CT-DAT-02 [F]** Actualizar o app por cima de uma versão anterior (instalar o APK novo sem desinstalar). → As migrações correm e todos os dados se mantêm
- [ ] **CT-DAT-03 [F]** Exportar, apagar os dados do app e restaurar. → Pessoas, visitas, lições, marcos, notas, horas e relatórios iguais aos de antes
- [ ] **CT-DAT-04 [F]** Mudar a data do telemóvel para o dia seguinte. → O Hoje passa ao novo dia e os atrasos aparecem
- [ ] **CT-DAT-05 [F]** Fuso horário diferente. → As horas das visitas e dos lembretes continuam certas

## Registo de execução

| Data | Telemóvel e Android | Versão do app | Secções | Falhas encontradas |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
