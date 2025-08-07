import {
  View as RNView,
  Text as RNText,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  RefreshCw,
  RotateCcw,
  TrendingUp,
  Clock,
  Bell,
  CheckCircle,
} from 'lucide-react-native';
import {
  monthlyReportNotificationManager,
  type Analytics,
} from '@/services/notifications/monthly-report-notification-manager';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useQuery } from '@tanstack/react-query';
import { View, Text } from '@/components/Themed';
import { useTheme } from '@/hooks/useTheme';
import Colors from '@/constants/Colors';

dayjs.locale('pt-br');

interface AnalyticItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const AnalyticItem: React.FC<AnalyticItemProps> = ({ label, value, icon }) => {
  const { isDark } = useTheme();
  return (
    <View
      lightColor={Colors.light.background}
      darkColor={Colors.dark.darkBgSecundary}
      className="flex-row items-center justify-between py-3 border-b border-gray-200"
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
      <Badge
        className="bg-blue-100 text-blue-800"
        style={{
          backgroundColor: isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Text className="text-xs font-medium">{value}</Text>
      </Badge>
    </View>
  );
};

export const AnalyticsCard: React.FC = () => {
  const { isDark } = useTheme();
  const {
    data: analytics,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => monthlyReportNotificationManager.getAnalytics(),
  });

  const resetAnalytics = async () => {
    try {
      await monthlyReportNotificationManager.resetAnalytics();
      await refetch();
      Snackbar.show({
        text: 'Estatísticas resetadas com sucesso!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      });
    } catch (error) {
      console.error('Erro ao resetar analytics:', error);
      Snackbar.show({
        text: 'Não foi possível resetar as estatísticas',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    }
  };

  const formatValue = (key: keyof Analytics, value: any): string => {
    switch (key) {
      case 'lastReceived':
        return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : 'Nunca';
      case 'successRate':
        return `${value}%`;
      case 'avgRescheduleTime':
        return `${value}ms`;
      default:
        return value?.toString() || '0';
    }
  };

  const getIcon = (key: keyof Analytics) => {
    switch (key) {
      case 'totalSent':
        return <Bell size={16} color="#10b981" />;
      case 'lastReceived':
        return <CheckCircle size={16} color="#3b82f6" />;
      case 'successRate':
        return <TrendingUp size={16} color="#f59e0b" />;
      case 'avgRescheduleTime':
        return <Clock size={16} color="#8b5cf6" />;
      case 'syncCount':
        return <RefreshCw size={16} color="#ef4444" />;
      default:
        return <BarChart3 size={16} color="#6b7280" />;
    }
  };

  if (isLoading || isFetching) {
    return (
      <Card
        className="mb-4"
        lightColor={Colors.light.background}
        darkColor={Colors.dark.darkBgSecundary}
      >
        <CardHeader>
          <CardTitle className="flex-row items-center">
            <BarChart3 className="mr-2" size={20} />
            Estatísticas de Uso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View className="py-8 items-center">
            <Text className="text-gray-500">Carregando estatísticas...</Text>
          </View>
        </CardContent>
      </Card>
    );
  }

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
          <BarChart3
            className="mr-2"
            size={20}
            color={isDark ? 'white' : 'black'}
          />
          <CardTitle style={{ color: isDark ? 'white' : 'black' }}>
            Estatísticas de Uso
          </CardTitle>
          {isFetching && (
            <ActivityIndicator
              size="small"
              color={isDark ? 'white' : 'black'}
            />
          )}
        </CardHeader>

        <CardContent>
          {analytics ? (
            <View>
              <AnalyticItem
                label="Total de notificações enviadas"
                value={formatValue('totalSent', analytics.totalSent)}
                icon={getIcon('totalSent')}
              />

              <AnalyticItem
                label="Última notificação recebida"
                value={formatValue('lastReceived', analytics.lastReceived)}
                icon={getIcon('lastReceived')}
              />

              <AnalyticItem
                label="Taxa de sucesso"
                value={formatValue('successRate', analytics.successRate)}
                icon={getIcon('successRate')}
              />

              <AnalyticItem
                label="Tempo médio de re-agendamento"
                value={formatValue(
                  'avgRescheduleTime',
                  analytics.avgRescheduleTime
                )}
                icon={getIcon('avgRescheduleTime')}
              />

              <AnalyticItem
                label="Sincronizações este mês"
                value={formatValue('syncCount', analytics.syncCount)}
                icon={getIcon('syncCount')}
              />
            </View>
          ) : (
            <View className="py-8 items-center">
              <BarChart3 size={48} color="#6b7280" />
              <Text className="mt-2 text-gray-500">
                Nenhuma estatística disponível
              </Text>
            </View>
          )}
        </CardContent>

        <View
          lightColor={Colors.light.background}
          darkColor={Colors.dark.darkBgSecundary}
          className="flex-row justify-between p-4 border-t border-gray-200"
        >
          <TouchableOpacity
            onPress={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex-1 mr-2 flex-row py-3 gap-2 items-center justify-center border border-gray-200 rounded-md p-2"
          >
            <RefreshCw
              size={16}
              className="mr-1"
              color={isDark ? 'white' : 'black'}
            />
            <Text className="text-sm font-medium">Atualizar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetAnalytics}
            className="flex-1 flex-row gap-2 items-center justify-center border border-gray-200 rounded-md p-2"
          >
            <RotateCcw
              size={16}
              className="mr-1"
              color={isDark ? 'white' : 'black'}
            />
            <Text className="text-sm font-medium">Resetar Estatísticas</Text>
          </TouchableOpacity>
        </View>

        <RNView className="p-4 bg-green-50 border-t border-green-200">
          <RNText className="text-green-800 text-xs">
            📊 Estas estatísticas ajudam a monitorar o funcionamento do sistema
            de notificações mensais.
          </RNText>
        </RNView>
      </Card>
    </ScrollView>
  );
};
