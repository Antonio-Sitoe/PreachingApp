# Schedule Notifie - Persistent Notification Module

## 🎯 Objetivo

Fazer notificações funcionarem **EXATAMENTE como apps de medicamento**: mesmo que o celular reinicie e o usuário **NUNCA abra o app**, as notificações chegam no horário certo!

## ✅ Como Funciona Agora

### 📱 Experiência do Usuário

```
1. Usuario agenda notificação para segunda-feira 9:30h
2. Celular perde bateria e reinicia
3. Usuario usa celular SEM abrir o app
4. Segunda-feira 9:30h: ✅ NOTIFICAÇÃO APARECE!
```

### 🔧 Implementação Técnica

```
📱 Android Boot
      ↓
🔌 BootReceiver (Automático)
      ↓
📊 Lê banco SQLite diretamente
      ↓
⏰ Reagenda TODAS as notificações com AlarmManager
      ↓
🎯 Notificações funcionam SEM abrir app!
```

## 🏗️ Arquitetura

### Android Native (INDEPENDENTE do JavaScript)

1. **BootReceiver.kt** - Detecta boot automaticamente
2. **Lê banco SQLite** - Mesmo banco usado pelo Drizzle/JavaScript
3. **AlarmManager** - Reagenda notificações semanais
4. **NotificationReceiver.kt** - Exibe notificações quando disparam

### JavaScript (COMPLEMENTAR)

- **weekly-notification.ts** - Funciona normalmente ✅
- **boot-aware-notification-manager.ts** - Wrapper que adiciona detection

## 🔍 Detalhes Técnicos

### Banco de Dados

- **BootReceiver lê diretamente**: `/data/data/{package}/databases/preachingDB.sqlite`
- **Tabela**: `student_availabilities` (mesma que Drizzle usa)
- **Query**: `SELECT * FROM student_availabilities WHERE isActive = 1`

### Notificações Nativas

- **AlarmManager.setRepeating()**: Alarmes semanais persistentes
- **NotificationReceiver**: Exibe notificação quando alarme dispara
- **Canal persistente**: `weekly_reminder_persistent`

### Navegação

- **Clique na notificação** → Abre app na tela `createVisit`
- **Parâmetros**: `student_id`, `student_name`, `notification_action`

## 🚀 Vantagens

- ✅ **100% Independente** - Não precisa abrir app
- ✅ **Lê banco diretamente** - Mesmo fonte que JavaScript
- ✅ **Alarmes nativos** - AlarmManager é mais confiável que Expo
- ✅ **Boot automático** - Restaura tudo automaticamente
- ✅ **Experiência real** - Como apps profissionais de medicamento

## 💻 Uso no App

```typescript
import { bootAwareNotificationManager } from '@/lib/notifications/boot-aware-notification-manager';

// Funciona EXATAMENTE igual ao weekly-notification.ts
await bootAwareNotificationManager.createWeeklyNotification({
  id: uuid(),
  studentId: 'student-123',
  name: 'João Silva',
  weekday: WeekDayEnum.MONDAY,
  hour: 9,
  minute: 30,
  title: 'Visita ao João Silva',
  body: 'Lembrete da sua visita!',
  isActive: true,
});

// PLUS: Agora funciona após boot SEM abrir app! 🎉
```

## 🧪 Como Testar

1. **Agendar notificação** para próximos 10 minutos
2. **Reiniciar celular** completamente
3. **NÃO abrir o app** - usar celular normalmente
4. **Aguardar horário** da notificação
5. ✅ **Notificação aparece** mesmo sem ter aberto o app!

## 📊 Logs para Debug

```bash
# Ver logs do boot
adb logcat | grep "BootReceiver"

# Ver notificações sendo exibidas
adb logcat | grep "NotificationReceiver"

# Ver módulo sendo inicializado
adb logcat | grep "ScheduleNotifieModule"
```

## 🔧 Componentes

### Android (Independente)

- `BootReceiver.kt` - Restaura após boot SEM JavaScript
- `NotificationReceiver.kt` - Exibe notificações nativas
- `ScheduleNotifieModule.kt` - Módulo Expo (canal de notificação)

### JavaScript (Wrapper)

- `boot-aware-notification-manager.ts` - Adiciona detecção de boot
- `weekly-notification.ts` - Sistema original (INALTERADO)

## 🎉 Resultado Final

**Agora o sistema funciona EXATAMENTE como apps profissionais de medicamento:**

- 📱 **Reinicia o celular** → BootReceiver age automaticamente
- 🔋 **Nunca abre o app** → Notificações chegam mesmo assim
- ⏰ **Horário exato** → AlarmManager é mais preciso que Expo
- 🎯 **100% Confiável** → Funciona independente do JavaScript

**O usuário NUNCA MAIS perde notificações, mesmo reiniciando o celular e nunca abrindo o app!** 🚀
