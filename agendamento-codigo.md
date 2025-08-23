```typescript
// types/VisitScheduling.ts
export interface AvailabilityBlock {
  id: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Domingo, 1 = Segunda...
  startTime: string; // "08:00"
  endTime: string; // "10:00"
  notificationEnabled: boolean;
  description?: string;
}

export interface Student {
  id: string;
  name: string;
  availabilityBlocks: AvailabilityBlock[];
  // outros campos do estudante...
}

export interface ScheduledVisitNotification {
  id: string;
  studentId: string;
  availabilityBlockId: string;
  calendarEventId: string; // ID do evento no Google Calendar
  isActive: boolean;
}

// services/GoogleCalendarVisitScheduler.ts
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export class GoogleCalendarVisitScheduler {
  // 🔧 Configurar Google Calendar API
  async initializeGoogleCalendar() {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      webClientId: 'SEU_WEB_CLIENT_ID',
      offlineAccess: true,
    });
  }

  // 🔑 Autenticar usuário
  async authenticateUser() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      return { success: true, accessToken: tokens.accessToken };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return { success: false, error: error.message };
    }
  }

  // 📅 Criar evento recorrente no Google Calendar
  async createRecurringVisitReminder(
    student: Student,
    availabilityBlock: AvailabilityBlock
  ) {
    try {
      const { accessToken } = await this.authenticateUser();
      if (!accessToken) throw new Error('Não autenticado');

      // Calcular próxima ocorrência do dia da semana
      const nextOccurrence = this.getNextWeekdayOccurrence(
        availabilityBlock.dayOfWeek,
        availabilityBlock.startTime
      );

      const event = {
        summary: `📖 Visita - ${student.name}`,
        description: this.buildEventDescription(student, availabilityBlock),
        start: {
          dateTime: nextOccurrence.toISOString(),
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: new Date(
            nextOccurrence.getTime() + 30 * 60000
          ).toISOString(), // +30 min
          timeZone: 'America/Sao_Paulo',
        },
        // 🔁 RECORRÊNCIA SEMANAL - A CHAVE DO SUCESSO!
        recurrence: [
          `RRULE:FREQ=WEEKLY;BYDAY=${this.getDayAbbreviation(
            availabilityBlock.dayOfWeek
          )}`,
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 15 }, // 15 min antes
            { method: 'popup', minutes: 0 }, // na hora exata
          ],
        },
        // 🎯 Metadados para deep linking
        extendedProperties: {
          private: {
            appId: 'preaching-app',
            studentId: student.id,
            availabilityBlockId: availabilityBlock.id,
            actionType: 'visit_reminder',
          },
        },
        // 🔗 URL personalizada para deep link
        location: `preachingapp://visit/add?studentId=${student.id}&blockId=${availabilityBlock.id}`,
      };

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Salvar referência local
        await this.saveScheduledNotification({
          id: `visit_${student.id}_${availabilityBlock.id}`,
          studentId: student.id,
          availabilityBlockId: availabilityBlock.id,
          calendarEventId: result.id,
          isActive: true,
        });

        return {
          success: true,
          eventId: result.id,
          eventLink: result.htmlLink,
          nextOccurrence,
        };
      } else {
        throw new Error(result.error?.message || 'Erro ao criar evento');
      }
    } catch (error) {
      console.error('Erro ao agendar visita:', error);
      return { success: false, error: error.message };
    }
  }

  // 🗑️ Cancelar notificações de um estudante específico
  async cancelStudentNotifications(studentId: string) {
    try {
      const { accessToken } = await this.authenticateUser();
      const savedNotifications = await this.getSavedNotifications();

      const studentNotifications = savedNotifications.filter(
        (n) => n.studentId === studentId && n.isActive
      );

      for (const notification of studentNotifications) {
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${notification.calendarEventId}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        // Marcar como inativo localmente
        notification.isActive = false;
      }

      await this.saveAllNotifications(savedNotifications);
      return { success: true, cancelledCount: studentNotifications.length };
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
      return { success: false, error: error.message };
    }
  }

  // 🔄 Re-agendar todas as notificações de um estudante
  async rescheduleStudentNotifications(student: Student) {
    // 1. Cancelar existentes
    await this.cancelStudentNotifications(student.id);

    // 2. Criar novas para blocos com notificação ativada
    const results = [];
    for (const block of student.availabilityBlocks) {
      if (block.notificationEnabled) {
        const result = await this.createRecurringVisitReminder(student, block);
        results.push(result);
      }
    }

    return results;
  }

  // 🎯 Processar clique na notificação (deep link)
  async handleNotificationClick(studentId: string, blockId: string) {
    // Navegar diretamente para tela de adicionar visita
    // Esta função seria chamada pelo seu sistema de deep linking
    const navigationData = {
      screen: 'AddVisit',
      params: {
        studentId,
        availabilityBlockId: blockId,
        fromNotification: true,
      },
    };

    return navigationData;
  }

  // 🛠️ Funções auxiliares
  private getNextWeekdayOccurrence(
    dayOfWeek: number,
    timeString: string
  ): Date {
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);

    const nextDate = new Date();
    nextDate.setHours(hours, minutes, 0, 0);

    // Calcular próxima ocorrência do dia da semana
    const daysUntilTarget = (dayOfWeek - today.getDay() + 7) % 7;
    if (daysUntilTarget === 0 && nextDate <= today) {
      nextDate.setDate(today.getDate() + 7); // Próxima semana se já passou hoje
    } else {
      nextDate.setDate(today.getDate() + daysUntilTarget);
    }

    return nextDate;
  }

  private getDayAbbreviation(dayOfWeek: number): string {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[dayOfWeek];
  }

  private buildEventDescription(
    student: Student,
    block: AvailabilityBlock
  ): string {
    const dayNames = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];

    return `
🎯 Lembrete de Visita

👤 Estudante: ${student.name}
📅 Disponibilidade: ${dayNames[block.dayOfWeek]} das ${block.startTime} às ${
      block.endTime
    }
${block.description ? `📝 Obs: ${block.description}` : ''}

💡 Toque nesta notificação para registrar a visita!

---
Gerado pelo PreachingApp
    `.trim();
  }

  // 💾 Persistência local (AsyncStorage)
  private async saveScheduledNotification(
    notification: ScheduledVisitNotification
  ) {
    const saved = await this.getSavedNotifications();
    const existing = saved.findIndex((n) => n.id === notification.id);

    if (existing >= 0) {
      saved[existing] = notification;
    } else {
      saved.push(notification);
    }

    await this.saveAllNotifications(saved);
  }

  private async getSavedNotifications(): Promise<ScheduledVisitNotification[]> {
    try {
      const saved = await AsyncStorage.getItem('scheduled_visit_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar notificações salvas:', error);
      return [];
    }
  }

  private async saveAllNotifications(
    notifications: ScheduledVisitNotification[]
  ) {
    try {
      await AsyncStorage.setItem(
        'scheduled_visit_notifications',
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }
}

// hooks/useVisitScheduling.ts
export const useVisitScheduling = () => {
  const scheduler = new GoogleCalendarVisitScheduler();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    scheduler.initializeGoogleCalendar().then(() => {
      setIsInitialized(true);
    });
  }, []);

  const scheduleStudentVisits = async (student: Student) => {
    if (!isInitialized) return { success: false, error: 'Não inicializado' };

    return await scheduler.rescheduleStudentNotifications(student);
  };

  const cancelStudentVisits = async (studentId: string) => {
    return await scheduler.cancelStudentNotifications(studentId);
  };

  return {
    isInitialized,
    scheduleStudentVisits,
    cancelStudentVisits,
    scheduler,
  };
};

// Exemplo de uso no componente
export const StudentFormExample = () => {
  const { scheduleStudentVisits } = useVisitScheduling();
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'João Silva',
    availabilityBlocks: [
      {
        id: '1',
        dayOfWeek: 1, // Segunda-feira
        startTime: '08:00',
        endTime: '10:00',
        notificationEnabled: true,
        description: 'Horário preferencial',
      },
      {
        id: '2',
        dayOfWeek: 3, // Quarta-feira
        startTime: '14:00',
        endTime: '16:00',
        notificationEnabled: false, // Sem notificação
      },
    ],
  });

  const handleSaveStudent = async () => {
    // 1. Salvar estudante no banco local (Drizzle)
    // await saveStudentToDatabase(student);

    // 2. Agendar notificações no Google Calendar
    const results = await scheduleStudentVisits(student);

    const successCount = results.filter((r) => r.success).length;
    Alert.alert(
      'Estudante Salvo!',
      `${successCount} lembretes agendados no Google Calendar`
    );
  };

  return (
    <View>
      {/* Seu formulário aqui */}
      <Button title="Salvar e Agendar Visitas" onPress={handleSaveStudent} />
    </View>
  );
};
```
