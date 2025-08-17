import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { Header } from '@/components/Header';
import { useTheme } from '@/hooks/useTheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  Heart,
  Coffee,
  Mail,
  Phone,
  Star,
  Gift,
  Sparkles,
  MessageCircle,
  Zap,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Animated } from 'react-native';

export default function HelpUs() {
  const { isDark } = useTheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Animações
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [heartBeat] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação contínua do coração
    const heartAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeat, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeat, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    heartAnimation.start();

    return () => heartAnimation.stop();
  }, [fadeAnim, scaleAnim, heartBeat]);

  const handleContact = (type: 'email' | 'phone') => {
    if (type === 'email') {
      Linking.openURL(
        'mailto:antoniositoehl@gmail.com?subject=Apoio ao App de Pregação'
      );
    } else {
      Linking.openURL('tel:+258878984953');
    }
  };

  const handleDonation = () => {
    // Aqui você pode adicionar link para doação ou abrir modal
    Linking.openURL(
      'mailto:antoniositoehl@gmail.com?subject=Doação para Apoio ao App'
    );
  };

  const benefits = [
    { id: 'zap', icon: Zap, text: 'Desenvolver novas funcionalidades' },
    { id: 'star', icon: Star, text: 'Manter o app sempre atualizado' },
    { id: 'gift', icon: Gift, text: 'Adicionar recursos premium gratuitos' },
    {
      id: 'message',
      icon: MessageCircle,
      text: 'Melhorar a experiência do usuário',
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <Header />

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Section */}
        <Animated.View
          className="items-center py-10"
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Partículas flutuantes */}
          <View className="absolute inset-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <Animated.View
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: tintColor + '40',
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [i * 10, 0],
                      }),
                    },
                  ],
                }}
              />
            ))}
          </View>

          <View
            className="w-36 h-36 rounded-full items-center justify-center mb-8 relative"
            style={{
              backgroundColor: isDark ? '#1f2937' : '#f8fafc',
              shadowColor: tintColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 16,
            }}
          >
            {/* Anel de brilho */}
            <View
              className="absolute inset-0 rounded-full"
              style={{
                borderWidth: 2,
                borderColor: tintColor + '30',
                shadowColor: tintColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 20,
              }}
            />

            <Animated.View style={{ transform: [{ scale: heartBeat }] }}>
              <Heart size={70} color={tintColor} fill={tintColor} />
            </Animated.View>
          </View>

          <Text
            className="font-title text-4xl font-bold text-center mb-4"
            style={{ color: textColor }}
          >
            Apoie o App
          </Text>

          <Text
            className="font-text text-lg text-center opacity-80 leading-7 px-4"
            style={{ color: textColor }}
          >
            Ajude-nos a continuar desenvolvendo ferramentas para facilitar o
            trabalho dos publicadores
          </Text>
        </Animated.View>

        {/* Benefícios */}
        <View className="mb-10">
          <Text
            className="font-title text-xl font-bold mb-6 text-center"
            style={{ color: textColor }}
          >
            ✨ O que seu apoio nos permite fazer?
          </Text>

          <View className="space-y-5 flex-col gap-4">
            {benefits.map((item) => (
              <Animated.View
                key={item.id}
                className="p-5 rounded-3xl"
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                  shadowColor: isDark ? '#000' : '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: isDark ? '#374151' : '#f3f4f6',
                }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-5"
                    style={{
                      backgroundColor: tintColor + '20',
                      shadowColor: tintColor,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
                    <item.icon size={24} color={tintColor} />
                  </View>
                  <Text
                    className="font-text text-base flex-1 leading-6"
                    style={{ color: textColor }}
                  >
                    {item.text}
                  </Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Opções de Apoio */}
        <View className="mb-10">
          <Text
            className="font-title text-xl font-bold mb-6 text-center"
            style={{ color: textColor }}
          >
            🎯 Como você pode nos apoiar?
          </Text>

          {/* Doação */}
          <TouchableOpacity
            onPress={handleDonation}
            className="p-6 rounded-3xl mb-5"
            style={{
              backgroundColor: tintColor,
              shadowColor: tintColor,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 12,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mr-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Coffee size={28} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-title text-lg font-bold text-white mb-2">
                  Doação Voluntária
                </Text>
                <Text className="font-text text-white opacity-90 leading-5">
                  Qualquer valor faz a diferença para continuarmos
                </Text>
              </View>
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <Sparkles size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Feedback */}
          <TouchableOpacity
            className="p-6 rounded-3xl"
            style={{
              backgroundColor: isDark ? '#374151' : '#ffffff',
              borderWidth: 2,
              borderColor: isDark ? '#4b5563' : '#e5e7eb',
              shadowColor: isDark ? '#000' : '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mr-5"
                style={{ backgroundColor: tintColor + '20' }}
              >
                <MessageCircle size={28} color={tintColor} />
              </View>
              <View className="flex-1">
                <Text
                  className="font-title text-lg font-bold mb-2"
                  style={{ color: textColor }}
                >
                  Feedback e Sugestões
                </Text>
                <Text
                  className="font-text opacity-70 leading-5"
                  style={{ color: textColor }}
                >
                  Suas ideias nos ajudam a melhorar o app
                </Text>
              </View>
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: tintColor + '20' }}
              >
                <MessageCircle size={20} color={tintColor} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contato */}
        <View className="mb-10">
          <Text
            className="font-title text-xl font-bold mb-6 text-center"
            style={{ color: textColor }}
          >
            📞 Entre em Contato
          </Text>

          <View className="space-y-4 flex-col gap-4">
            <TouchableOpacity
              onPress={() => handleContact('email')}
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                shadowColor: isDark ? '#000' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.08,
                shadowRadius: 4,
                elevation: 4,
                borderWidth: 1,
                borderColor: isDark ? '#374151' : '#f3f4f6',
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: tintColor + '20' }}
                >
                  <Mail size={22} color={tintColor} />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-text text-sm opacity-60 mb-1"
                    style={{ color: textColor }}
                  >
                    Email
                  </Text>
                  <Text
                    className="font-text font-medium text-base"
                    style={{ color: textColor }}
                  >
                    antoniositoehl@gmail.com
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleContact('phone')}
              className="p-5 rounded-2xl"
              style={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                shadowColor: isDark ? '#000' : '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isDark ? 0.2 : 0.08,
                shadowRadius: 4,
                elevation: 4,
                borderWidth: 1,
                borderColor: isDark ? '#374151' : '#f3f4f6',
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: tintColor + '20' }}
                >
                  <Phone size={22} color={tintColor} />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-text text-sm opacity-60 mb-1"
                    style={{ color: textColor }}
                  >
                    WhatsApp/Telefone
                  </Text>
                  <Text
                    className="font-text font-medium text-base"
                    style={{ color: textColor }}
                  >
                    +258 878984953
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          className="items-center py-8 px-6 rounded-3xl"
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            shadowColor: isDark ? '#000' : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 8,
          }}
        >
          {/* Ícone flutuante */}
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: tintColor + '20',
              shadowColor: tintColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-3xl">🙏</Text>
          </View>

          <Text
            className="font-title text-xl font-bold text-center mb-3"
            style={{ color: textColor }}
          >
            Obrigado pelo seu apoio!
          </Text>

          <Text
            className="font-text text-center opacity-70 leading-6 text-base"
            style={{ color: textColor }}
          >
            Cada contribuição, por menor que seja, nos ajuda a continuar
            desenvolvendo ferramentas que fazem a diferença na vida de muitos
            publicadores.
          </Text>

          {/* Linha decorativa */}
          <View
            className="w-20 h-1 rounded-full mt-4"
            style={{ backgroundColor: tintColor + '40' }}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
