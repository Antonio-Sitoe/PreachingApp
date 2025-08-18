import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Bell,
  Settings as SettingsIcon,
} from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import { BackButton } from '@/components/ui/BackButton';
import { version } from '../../../../package.json';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  onPress: () => void;
  showArrow?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  icon,
  onPress,
  showArrow = true,
}) => {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4"
      style={{
        borderBottomColor: isDark ? Colors.dark.background : '#e5e7eb',
      }}
    >
      <View className="flex-row items-center flex-1">
        <View className="mr-3">{icon}</View>
        <View className="flex-1">
          <Text
            className="text-base font-medium"
            style={{
              color: isDark ? Colors.dark.text : Colors.light.text,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-sm mt-1"
              style={{
                color: isDark ? Colors.dark.tint : Colors.light.tint,
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && (
        <ChevronRight
          size={20}
          color={isDark ? Colors.dark.tint : Colors.light.tint}
        />
      )}
    </TouchableOpacity>
  );
};

export default function Settings() {
  const { isDark } = useTheme();
  const router = useRouter();

  const handleNotificationsPress = () => {
    router.push('/settings/notifications/');
  };

  const handleMonthlyReportsPress = () => {
    router.push('/settings/notifications/report');
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark ? Colors.dark.background : '#F6F6F9',
        paddingBottom: 50,
      }}
    >
      <SafeAreaView className="flex-1 px-6">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-6 flex-row items-center">
            <BackButton />
            <View className="ml-4">
              <Text
                className="text-2xl font-bold"
                style={{
                  color: isDark ? Colors.dark.text : Colors.light.text,
                }}
              >
                Definições
              </Text>
              <Text
                className="text-base font-title"
                style={{
                  color: isDark ? Colors.dark.tint : Colors.light.tint,
                }}
              >
                Gerencie as configurações do aplicativo
              </Text>
            </View>
          </View>

          <Card
            className="mb-6"
            style={{
              backgroundColor: isDark
                ? Colors.dark.darkBgSecundary
                : Colors.light.background,
            }}
          >
            <CardHeader className="flex-row items-center gap-2">
              <Bell
                size={20}
                color={isDark ? Colors.dark.tint : Colors.light.tint}
              />
              <CardTitle
                style={{
                  color: isDark ? Colors.dark.text : Colors.light.text,
                }}
              >
                Notificações
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <SettingItem
                title="Definições de Notificações"
                subtitle="Configure alertas e lembretes"
                icon={
                  <SettingsIcon
                    size={20}
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                  />
                }
                onPress={handleNotificationsPress}
              />
              <SettingItem
                title="Relatórios Mensais"
                subtitle="Configurar relatórios automáticos"
                icon={
                  <SettingsIcon
                    size={20}
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                  />
                }
                onPress={handleMonthlyReportsPress}
              />
            </CardContent>
          </Card>

          {/* App Information Section */}
          <Card
            className="mb-6"
            style={{
              backgroundColor: isDark
                ? Colors.dark.darkBgSecundary
                : Colors.light.background,
            }}
          >
            <CardHeader className="flex-row items-center gap-2">
              <SettingsIcon
                size={20}
                color={isDark ? Colors.dark.tint : Colors.light.tint}
              />
              <CardTitle
                style={{
                  color: isDark ? Colors.dark.text : Colors.light.text,
                }}
              >
                Informações do App
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <SettingItem
                title="Versão do Aplicativo"
                subtitle={version}
                icon={
                  <SettingsIcon
                    size={20}
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                  />
                }
                onPress={() => {}}
                showArrow={false}
              />
            </CardContent>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
