import {
  Settings,
  Clock,
  Calendar,
  Volume2,
  Vibrate,
  Bell,
} from 'lucide-react-native';

import {
  View as RNView,
  Text as RNText,
  TextInput,
  Switch,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';

import {
  monthlyReportNotificationManager,
  type NotificationConfig,
} from '@/services/notifications/monthly-report-notification-manager';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TouchableOpacity, { View, Text } from '@/components/Themed';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { Textarea, TextareaInput } from '@/components/ui/textarea';

import Colors from '@/constants/Colors';
import * as Notifications from 'expo-notifications';

interface SettingRowProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  children,
  icon,
  className,
}) => {
  return (
    <View
      lightColor={Colors.light.background}
      darkColor={Colors.dark.darkBgSecundary}
      className={cn(
        'flex-row items-center justify-between py-3 border-b border-gray-200',
        className ?? ''
      )}
    >
      <View
        className="flex-row items-center flex-1"
        lightColor={Colors.light.background}
        darkColor={Colors.dark.darkBgSecundary}
      >
        {icon && <View className="mr-2">{icon}</View>}
        <Text className="text-sm font-medium text-gray-700 flex-1">
          {label}
        </Text>
      </View>
      <View className="ml-4">{children}</View>
    </View>
  );
};

const TimePicker: React.FC<{
  value: { hour: number; minute: number };
  onChange: (time: { hour: number; minute: number }) => void;
}> = ({ value, onChange }) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { isDark } = useTheme();

  const handleTimeChange = (_, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      onChange({
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      });
    }
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        className="flex-row items-center px-2 w-20 gap-2 py-2 border border-gray-300 rounded-md bg-white"
        activeOpacity={0.7}
        style={{
          borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
          backgroundColor: isDark
            ? Colors.dark.background
            : Colors.light.background,
        }}
      >
        <Clock
          size={16}
          className="mr-2"
          color={isDark ? Colors.dark.tint : Colors.light.tint}
        />
        <Text
          className="text-sm font-medium"
          style={{ color: isDark ? Colors.dark.text : Colors.light.text }}
        >
          {formatTime(value.hour, value.minute)}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={new Date(2023, 0, 1, value.hour, value.minute)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export const NotificationSettingsCard: React.FC = () => {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState<NotificationConfig>({
    enabled: true,
    hour: 9,
    minute: 0,
    title: 'Relatório Mensal',
    body: 'Seu relatório mensal está disponível!',
    sound: true,
    vibration: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<boolean | null>(
    null
  );

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const config = await monthlyReportNotificationManager.getConfig();
      setSettings(config);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      Snackbar.show({
        text: 'Não foi possível carregar as configurações',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    } finally {
      setLoading(false);
    }
  }, []);
  const requestPermissions = async () => {
    try {
      const result =
        await monthlyReportNotificationManager.requestPermissions();
      if (result === Notifications.PermissionStatus.GRANTED) {
        setPermissionStatus(true);
        Snackbar.show({
          text: 'Permissões concedidas!',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
        });
      } else {
        Snackbar.show({
          text: 'As notificações não funcionarão sem permissão',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Colors.light.Error,
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      Snackbar.show({
        text: 'Erro ao solicitar permissões',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    }
  };

  const checkPermissionStatus = useCallback(async () => {
    try {
      const status =
        await monthlyReportNotificationManager.getPermissionStatus();
      setPermissionStatus(status === Notifications.PermissionStatus.GRANTED);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
    }
  }, []);

  const updateSettings = async (newSettings: Partial<NotificationConfig>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await monthlyReportNotificationManager.updateConfig(updatedSettings);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await monthlyReportNotificationManager.updateConfig(settings);
      await monthlyReportNotificationManager.initializeOnAppLaunch();
      Snackbar.show({
        text: 'Configurações salvas e notificações re-agendadas!',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      Snackbar.show({
        text: 'Não foi possível salvar as configurações',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: Colors.light.Error,
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  if (loading) {
    return (
      <Card className="mb-4 flex-1">
        <ActivityIndicator
          size="large"
          color={isDark ? Colors.dark.text : Colors.light.text}
        />
      </Card>
    );
  }

  return (
    <ScrollView className="flex-1 p-4" contentContainerClassName="pb-20">
      <Card
        style={{
          backgroundColor: isDark
            ? Colors.dark.darkBgSecundary
            : Colors.light.background,
        }}
        className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
      >
        <CardHeader className="flex-row items-center gap-2">
          <Calendar
            className="mr-2"
            size={24}
            color={isDark ? Colors.dark.tint : Colors.light.tint}
          />
          <CardTitle
            style={{ color: isDark ? Colors.dark.text : Colors.light.text }}
          >
            Sistema de Notificações Mensais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-gray-700 mb-3">
            Configure e gerencie as notificações automáticas que são enviadas
            todo dia 1º de cada mês.
          </Text>

          <View
            className="flex-row items-center justify-between"
            lightColor={Colors.light.background}
            darkColor={Colors.dark.darkBgSecundary}
          >
            <View className="flex-row items-center ">
              <Badge
                className={
                  permissionStatus
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }
              >
                <Text
                  lightColor={Colors.light.text}
                  darkColor={Colors.light.text}
                  className="text-xs font-medium"
                >
                  {permissionStatus
                    ? 'Permissões Concedidas'
                    : 'Permissões Negadas'}
                </Text>
              </Badge>
            </View>

            {!permissionStatus && (
              <TouchableOpacity
                onPress={requestPermissions}
                style={{
                  borderColor: isDark ? Colors.dark.tint : Colors.light.tint,
                }}
                className="flex-row items-center px-3 gap-2 py-3 rounded-md border bg-blue-50 border-blue-300"
                activeOpacity={0.7}
              >
                <Bell
                  size={16}
                  className="mr-2"
                  color={isDark ? Colors.dark.tint : Colors.light.tint}
                />
                <Text className="text-blue-700 font-medium">
                  Solicitar Permissões
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </CardContent>
      </Card>

      <Card
        style={{
          backgroundColor: isDark
            ? Colors.dark.darkBgSecundary
            : Colors.light.background,
        }}
        className="mb-4"
      >
        <CardHeader className="flex-row items-center gap-2">
          <Settings
            className="mr-2"
            size={20}
            color={isDark ? Colors.dark.text : Colors.light.text}
          />
          <CardTitle style={{ color: isDark ? 'white' : 'black' }}>
            Configurações de Notificação
          </CardTitle>
        </CardHeader>

        <CardContent>
          <SettingRow
            label="Notificações ativas"
            icon={<Settings size={16} color="#3b82f6" />}
          >
            <Switch
              value={settings.enabled}
              onValueChange={(enabled) => updateSettings({ enabled })}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={settings.enabled ? '#ffffff' : '#f3f4f6'}
              style={{
                backgroundColor: isDark
                  ? Colors.dark.darkBgSecundary
                  : Colors.light.background,
              }}
            />
          </SettingRow>

          <SettingRow
            label="Horário"
            icon={<Clock size={16} color="#f59e0b" />}
          >
            <TimePicker
              value={{ hour: settings.hour, minute: settings.minute }}
              onChange={(time) => updateSettings(time)}
            />
          </SettingRow>

          <SettingRow label="Título da notificação">
            <TextInput
              value={settings.title}
              onChangeText={(title) => setSettings({ ...settings, title })}
              className={cn(
                'w-40 h-10 border border-gray-300 rounded px-2 text-sm'
              )}
              style={{
                color: isDark ? Colors.dark.text : Colors.light.text,
              }}
              placeholder="Título"
            />
          </SettingRow>

          <View
            lightColor={Colors.light.background}
            darkColor={Colors.dark.darkBgSecundary}
            className={cn(
              'flex-col items-center justify-between py-3 border-b border-gray-200'
            )}
          >
            <View
              className="flex-row items-center flex-1"
              lightColor={Colors.light.background}
              darkColor={Colors.dark.darkBgSecundary}
            >
              <Text className="text-sm font-medium text-gray-700 flex-1">
                Mensagem
              </Text>
            </View>
            <View className="flex-1 w-full mt-4">
              <Textarea
                size="md"
                isReadOnly={false}
                isInvalid={false}
                isDisabled={false}
                className="w-full border border-gray-300 rounded px-2 text-sm"
                style={{ textAlignVertical: 'top' }}
              >
                <TextareaInput
                  value={settings.body}
                  onChangeText={(body) => setSettings({ ...settings, body })}
                  style={{ textAlignVertical: 'top' }}
                />
              </Textarea>
            </View>
          </View>

          <SettingRow label="Som" icon={<Volume2 size={16} color="#10b981" />}>
            <Switch
              value={settings.sound}
              onValueChange={(sound) => updateSettings({ sound })}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor={settings.sound ? '#ffffff' : '#f3f4f6'}
              style={{
                backgroundColor: isDark
                  ? Colors.dark.darkBgSecundary
                  : Colors.light.background,
              }}
            />
          </SettingRow>

          <SettingRow
            label="Vibração"
            icon={<Vibrate size={16} color="#8b5cf6" />}
          >
            <Switch
              value={settings.vibration}
              onValueChange={(vibration) => updateSettings({ vibration })}
              trackColor={{ false: '#d1d5db', true: '#8b5cf6' }}
              thumbColor={settings.vibration ? '#ffffff' : '#f3f4f6'}
              style={{
                backgroundColor: isDark
                  ? Colors.dark.darkBgSecundary
                  : Colors.light.background,
              }}
            />
          </SettingRow>
        </CardContent>

        <View
          className="p-4"
          lightColor={Colors.light.background}
          darkColor={Colors.dark.darkBgSecundary}
        >
          <TouchableOpacity
            onPress={saveSettings}
            disabled={saving}
            lightColor={Colors.light.tint}
            darkColor={Colors.dark.tint}
            className="w-full flex-row gap-2 items-center justify-center rounded-md p-2 py-4"
          >
            <Text
              className="text-sm font-medium text-white"
              lightColor="white"
              darkColor="white"
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Text>
          </TouchableOpacity>
        </View>

        <RNView className="p-4 bg-blue-50 border-t border-blue-200">
          <RNText className="text-blue-800 text-sm">
            💡 As configurações são aplicadas automaticamente. Use o botão
            "Salvar" para forçar a aplicação.
          </RNText>
        </RNView>
      </Card>
    </ScrollView>
  );
};
