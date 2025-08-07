import { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import Snackbar from 'react-native-snackbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TouchableOpacity, { View, Text } from '@/components/Themed';
import {
  RefreshCw,
  XCircle,
  Clock,
  Bell,
  CheckCircle,
} from 'lucide-react-native';
import { monthlyReportNotificationManager } from '@/services/notifications/monthly-report-notification-manager';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import * as Notifications from 'expo-notifications';
import Colors from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';

dayjs.locale('pt-br');

interface NotificationStatus {
  permissionStatus: boolean;
  lastSync: string | null;
  scheduledCount: number;
  nextNotification: Date | null;
}

interface StatusItemProps {
  label: string;
  value: string | number | boolean | null;
  type: 'permission' | 'date' | 'number' | 'boolean';
  icon?: React.ReactNode;
}

const StatusItem: React.FC<StatusItemProps> = ({
  label,
  value,
  type,
  icon,
}) => {
  const formatValue = () => {
    switch (type) {
      case 'permission':
        return value ? 'Concedidas' : 'Negadas';
      case 'date':
        return value
          ? dayjs(value as string).format('DD/MM/YYYY HH:mm')
          : 'Nunca';
      case 'number':
        return value?.toString() || '0';
      case 'boolean':
        return value ? 'Sim' : 'Não';
      default:
        return value?.toString() || 'N/A';
    }
  };

  const getStatusColor = () => {
    switch (type) {
      case 'permission':
        return value
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800';
      case 'date':
        return value
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-800';
      case 'number':
        return (value as number) > 0
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800';
      case 'boolean':
        return value
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <View
      className="flex-row items-center justify-between py-2 border-b border-gray-200"
      lightColor={Colors.light.background}
      darkColor={Colors.dark.darkBgSecundary}
    >
      <View
        className="flex-row items-center flex-1"
        lightColor={Colors.light.background}
        darkColor={Colors.dark.darkBgSecundary}
      >
        {icon && (
          <View
            lightColor={Colors.light.background}
            darkColor={Colors.dark.darkBgSecundary}
            className="mr-2"
          >
            {icon}
          </View>
        )}

        <Text className="text-sm font-medium text-gray-700 flex-1">
          {label}
        </Text>
      </View>
      <Badge className={getStatusColor()}>
        <Text
          lightColor={Colors.light.text}
          darkColor={Colors.light.text}
          className="text-xs font-medium"
        >
          {formatValue()}
        </Text>
      </Badge>
    </View>
  );
};

export const NotificationStatusCard: React.FC = () => {
  const { isDark } = useTheme();
  const [status, setStatus] = useState<NotificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const forceReschedule = async () => {
    try {
      setRefreshing(true);
      await monthlyReportNotificationManager.forceReschedule();
      await loadNotificationStatus();
      Snackbar.show({
        text: 'Notificações re-agendadas com sucesso!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      });
    } catch (error) {
      console.error('Erro ao re-agendar:', error);
      Snackbar.show({
        text: 'Não foi possível re-agendar as notificações',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const testNotification = async () => {
    try {
      await monthlyReportNotificationManager.testNotification();
      Snackbar.show({
        text: 'Notificação de teste será enviada em 5 segundos',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      });
    } catch (error) {
      console.error('Erro ao testar notificação:', error);
      Snackbar.show({
        text: 'Não foi possível enviar notificação de teste',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    }
  };

  const loadNotificationStatus = useCallback(async () => {
    try {
      setLoading(true);

      const [permissionStatus, lastSync, scheduledCount, nextNotification] =
        await Promise.all([
          monthlyReportNotificationManager.getPermissionStatus(),
          monthlyReportNotificationManager.getLastSync(),
          monthlyReportNotificationManager.getScheduledCount(),
          monthlyReportNotificationManager.getNextNotification(),
        ]);

      setStatus({
        permissionStatus:
          permissionStatus === Notifications.PermissionStatus.GRANTED,
        lastSync,
        scheduledCount,
        nextNotification,
      });
    } catch (error) {
      console.error('Erro ao carregar status:', error);
      Snackbar.show({
        text: 'Não foi possível carregar o status das notificações',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotificationStatus();
  }, [loadNotificationStatus]);

  return (
    <ScrollView className="flex-1 p-4 mb-10">
      <Card
        className="mb-4"
        style={{
          backgroundColor: isDark
            ? Colors.dark.darkBgSecundary
            : Colors.light.background,
        }}
      >
        <CardHeader className="flex-row items-center gap-2">
          <Bell
            className="mr-2"
            size={20}
            color={isDark ? Colors.dark.tint : Colors.light.tint}
          />
          <CardTitle
            style={{ color: isDark ? Colors.dark.text : Colors.light.text }}
          >
            Status das Notificações
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" />
              <Text className="mt-2 text-gray-500">Carregando status...</Text>
            </View>
          ) : status ? (
            <View>
              <StatusItem
                label="Permissões"
                value={status.permissionStatus}
                type="permission"
                icon={
                  <CheckCircle
                    size={16}
                    color={status.permissionStatus ? '#10b981' : '#ef4444'}
                  />
                }
              />

              <StatusItem
                label="Última sincronização"
                value={status.lastSync}
                type="date"
                icon={<RefreshCw size={16} color="#3b82f6" />}
              />

              <StatusItem
                label="Notificações agendadas"
                value={status.scheduledCount}
                type="number"
                icon={<Bell size={16} color="#10b981" />}
              />

              <StatusItem
                label="Próxima notificação"
                value={status.nextNotification?.toISOString() || null}
                type="date"
                icon={<Clock size={16} color="#f59e0b" />}
              />
            </View>
          ) : (
            <View className="py-8 items-center">
              <XCircle size={48} color="#ef4444" />
              <Text className="mt-2 text-gray-500">
                Erro ao carregar status
              </Text>
            </View>
          )}
        </CardContent>

        <View
          lightColor={Colors.light.background}
          darkColor={Colors.dark.darkBgSecundary}
          className="flex-row justify-between py-4 border-t border-gray-200"
        >
          <TouchableOpacity
            onPress={loadNotificationStatus}
            disabled={loading}
            className={`flex-1 mr-2 py-3 rounded-md border border-gray-300 items-center justify-center ${
              loading ? 'opacity-50' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text className="font-text text-sm text-gray-800">Atualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={forceReschedule}
            disabled={refreshing}
            className={`flex-1 mr-2 py-3 rounded-md border border-gray-300 items-center justify-center ${
              refreshing ? 'opacity-50' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text className="font-text text-sm text-gray-800">
              {refreshing ? 'Re-agendando...' : 'Re-agendar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={testNotification}
            className="flex-1 mr-2 py-3 rounded-md border border-gray-300 items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="font-text text-sm text-gray-800">Testar</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};
