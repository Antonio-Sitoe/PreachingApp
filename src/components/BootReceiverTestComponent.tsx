import React, { useState } from 'react';
import {
  View,
  Button,
  Alert,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { notificationManager } from '@/lib/notifications/weekly-notification';
import { BootReceiverService } from '@/lib/notifications/BootReceiverService';
import * as Notifications from 'expo-notifications';
import { availabilitiesAction } from '@/database/actions';

export function BootReceiverTestComponent() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const testBootReceiver = async () => {
    try {
      addLog('🧪 Iniciando teste do Boot Receiver...');
      const bootService = BootReceiverService.getInstance();
      await bootService.testBootReceiver();
      addLog('✅ Boot Receiver testado com sucesso!');
      Alert.alert('Teste', 'Boot Receiver testado com sucesso!');
    } catch (error) {
      addLog(`❌ Erro no teste: ${error}`);
      Alert.alert('Erro', 'Falha no teste do Boot Receiver');
      console.error(error);
    }
  };

  const simulateReboot = async () => {
    try {
      addLog('🔄 Simulando reboot - cancelando todas as notificações...');
      await Notifications.cancelAllScheduledNotificationsAsync();
      addLog('✅ Todas as notificações foram canceladas');

      Alert.alert(
        'Simulação de Reboot',
        'Todas as notificações foram canceladas.\n\nAgora feche e abra o app para testar a restauração automática!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      addLog(`❌ Erro na simulação: ${error}`);
      console.error('Erro na simulação:', error);
    }
  };

  const checkNotifications = async () => {
    try {
      addLog('🔍 Verificando estado das notificações...');
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      addLog(`📱 Sistema: ${scheduled.length} notificações agendadas`);

      // Aqui você pode adicionar uma verificação do banco de dados se necessário
      addLog('✅ Verificação concluída');
    } catch (error) {
      addLog(`❌ Erro na verificação: ${error}`);
    }
  };

  const cleanupDuplicates = async () => {
    try {
      addLog('🧹 Limpando notificações duplicadas...');
      const removed = await notificationManager.cleanupDuplicateNotifications();
      addLog(`✅ ${removed} notificações duplicadas removidas`);
    } catch (error) {
      addLog(`❌ Erro na limpeza: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testNotification = async () => {
    try {
      // Substitua 'student-123' pelo ID real de um estudante
      await notificationManager.createTestNotification('student-123');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar notificação de teste');
      console.error(error);
    }
  };

  const checkScheduledNotifications = async () => {
    try {
      const notifications = await availabilitiesAction.getAll();
      Alert.alert('Notificações', `Total: ${notifications.length}`);
      console.log(
        '📋 Notificações agendadas:',
        JSON.stringify(notifications, null, 2)
      );
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚀 Teste Boot Receiver</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="🧪 Testar Boot Receiver"
          onPress={testBootReceiver}
          color="#007AFF"
        />

        <Button
          title="🔄 Simular Reboot"
          onPress={simulateReboot}
          color="#FF9500"
        />

        <Button
          title="🔍 Verificar Notificações"
          onPress={checkNotifications}
          color="#34C759"
        />

        <Button
          title="🧹 Limpar Duplicatas"
          onPress={cleanupDuplicates}
          color="#FF3B30"
        />

        <Button title="🗑️ Limpar Logs" onPress={clearLogs} color="#8E8E93" />

        <Button
          title="🧪 Teste Notificação (3s)"
          onPress={testNotification}
          color="#007AFF"
        />
        <Button
          title="📋 Listar Notificações"
          onPress={checkScheduledNotifications}
          color="#34C759"
        />
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>📋 Logs de Debug:</Text>
        {logs.map((log, index) => (
          <Text key={`log-${Date.now()}-${index}`} style={styles.logText}>
            {log}
          </Text>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyLogs}>Nenhum log ainda...</Text>
        )}
      </View>

      <Text style={styles.info}>
        💡 Para testar realmente:{'\n'}
        1. Configure algumas notificações{'\n'}
        2. Clique em "Simular Reboot"{'\n'}
        3. Feche e abra o app{'\n'}
        4. Verifique se as notificações foram restauradas{'\n\n'}
        📱 Para teste real:{'\n'}
        1. Faça um build de produção{'\n'}
        2. Instale no dispositivo{'\n'}
        3. Configure notificações{'\n'}
        4. Reinicie o dispositivo{'\n'}
        5. Abra o app e verifique os logs
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  logContainer: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    maxHeight: 300,
  },
  logTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logText: {
    color: '#00ff00',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  emptyLogs: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'left',
  },
});
