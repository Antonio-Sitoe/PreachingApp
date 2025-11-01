O estudante não tem acesso à plataforma.
As disponibilidades e preferências de notificação são cadastradas/alteradas apenas pelo usuário gestor (quem faz o cadastro/edição do estudante).
As notificações são sempre repetitivas e servem como lembrete para realizar a visita.
Ao clicar na notificação, o usuário é levado diretamente para a tela de adicionar visita daquele estudante, podendo registrar a visita ou indicar que não foi realizada.
Funcionamento da Funcionalidade: Agendamento de Visitas com Notificações Repetitivas

1. Cadastro/Edição de Estudante
   Ao cadastrar ou editar um estudante, o usuário informa:
   Um ou mais blocos de disponibilidade (dia da semana + horário de início/fim).
   Para cada bloco, se deseja receber notificações de lembrete.
   Exemplo: Segunda-feira das 8h às 10h (com notificação), Quarta-feira das 14h às 16h (sem notificação).

2. Agendamento Automático de Notificações
   Para cada disponibilidade com notificação ativada, o app agenda uma notificação repetitiva:
   Exemplo: Toda segunda-feira às 8h, o app envia uma notificação para lembrar de realizar a visita ao estudante X.
   As notificações são agendadas localmente no dispositivo do usuário gestor (usando, por exemplo, o Expo Notifications).

3. Interação com a Notificação
   Quando a notificação dispara, o usuário vê o lembrete no dispositivo.
   Ao clicar na notificação, o app abre diretamente a tela de adicionar visita para aquele estudante e horário.
   O usuário pode então:
   Registrar que fez a visita (preenchendo os dados normais da visita).
   Ou indicar que não realizou a visita (opção simples, ex: “Não foi possível realizar a visita”).

4. Repetição e Gestão
   As notificações se repetem semanalmente conforme configuração (ex: toda segunda, toda quarta, etc.).
   Se o usuário editar as disponibilidades ou as preferências de notificação, o app cancela e reprograma as notificações conforme o novo cadastro.
   Se uma disponibilidade for removida, a notificação correspondente também é removida.
   Resumindo o Fluxo
   Usuário cadastra/edita estudante → define dias/horários e ativa/desativa notificações.
   App agenda notificações repetitivas para cada bloco de disponibilidade com notificação ativada.

   Ao receber a notificação, usuário pode registrar a visita ou indicar que não realizou.
   Toda a gestão é feita pelo usuário gestor, nunca pelo estudante.
   Vantagens desse modelo
   Automação: O usuário não precisa lembrar manualmente das visitas, o app faz isso por ele.
   Flexibilidade: Pode configurar diferentes dias/horários e ativar notificações só para os blocos desejados.
   Simplicidade: O fluxo de registro de visita é rápido e direto a partir da notificação.
   Escalável: Permite adicionar/remover blocos de disponibilidade a qualquer momento.
