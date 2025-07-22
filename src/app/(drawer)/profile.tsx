import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, TextInput, Image } from 'react-native';
import { usersActions } from '@/database/actions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { Camera, ChevronLeft } from 'lucide-react-native';
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { zodResolver } from '@hookform/resolvers/zod';
import Colors from '@/constants/Colors';
import useTheme from '@/hooks/useTheme';
import * as ImagePicker from 'expo-image-picker';
import { z } from 'zod/v4';
import Snackbar from 'react-native-snackbar';
import { Picker } from '@react-native-picker/picker';
import { cn } from '@/lib/utils';
import { Text } from '@/components/Themed';

const schema = z.object({
  username: z.string().min(2, 'Nome é obrigatório'),
  avatarImage: z.url('URL da imagem inválida').optional().or(z.literal('')),
  profile: z
    .enum(['publisher', 'baptized_publisher', 'pioneer'])
    .default('publisher'),
});

export default function Profile() {
  const { isDark } = useTheme();
  const { back } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setProfileUser, user, userSession } = useUser();
  const userName = user?.username || userSession?.name || '';

  const [image, setImage] = useState(user?.avatarImage || '');
  const { control, handleSubmit, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: userName,
      avatarImage: image,
      profile:
        user?.profile &&
        ['publisher', 'baptized_publisher', 'pioneer'].includes(user.profile)
          ? (user.profile as 'publisher' | 'baptized_publisher' | 'pioneer')
          : 'publisher',
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const newDate = { ...data, avatarImage: image, id: user?.id ?? '' };
      const userUpdated = await usersActions.upsert(newDate);
      setProfileUser(userUpdated);
      Snackbar.show({
        text: 'Perfil Atualizado com sucesso',
        duration: Snackbar.LENGTH_LONG,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (user?.avatarImage) {
      setImage(user?.avatarImage);
    } else if (userSession?.avatarImage) {
      setImage(userSession?.avatarImage);
    } else {
      setImage('');
    }
  }, [user, userSession]);

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: isDark
          ? Colors.dark.darkBgSecundary
          : Colors.light.background,
      }}
    >
      <SafeAreaView className="flex-1 px-4">
        <KeyboardAvoidingView behavior="height">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between mt-8 items-center">
              <TouchableOpacity
                className="w-10 h-10 items-center justify-center"
                onPress={back}
              >
                <ChevronLeft
                  size={45}
                  color={isDark ? Colors.dark.tint : Colors.light.tint}
                />
              </TouchableOpacity>
            </View>
            <Text
              className="font-title text-xl text-center mb-4"
              lightColor="black"
              darkColor="white"
            >
              Editar Perfil
            </Text>
            <View className="w-full justify-center items-center mb-4">
              <TouchableOpacity className="relative" onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 75,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 75,
                      backgroundColor: isDark
                        ? Colors.dark.tint
                        : Colors.light.tint,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 20 }}>
                      {getValues().username
                        ? getValues().username
                        : 'Preaching App'}
                    </Text>
                  </View>
                )}
                <Camera
                  color="white"
                  fill={isDark ? Colors.dark.tint : Colors.light.tint}
                  size={28}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 28,
                    height: 28,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{
                      marginBottom: 10,
                      backgroundColor: isDark
                        ? Colors.dark.background
                        : 'white',
                      color: isDark ? 'white' : Colors.dark.background,
                      height: 50,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: isDark
                        ? Colors.dark.tint
                        : Colors.light.tint,
                      paddingHorizontal: 10,
                    }}
                    placeholder="Digite o teu nome"
                    placeholderTextColor={
                      isDark ? Colors.dark.tint : Colors.light.tint
                    }
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="username"
              />

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: isDark
                        ? Colors.dark.background
                        : 'white',
                    }}
                  >
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={{
                        color: isDark ? 'white' : Colors.dark.background,
                      }}
                    >
                      <Picker.Item label="Publicador" value="publisher" />
                      <Picker.Item
                        label="Batizado"
                        value="baptized_publisher"
                      />
                      <Picker.Item label="Pioneiro" value="pioneer" />
                    </Picker>
                  </View>
                )}
                name="profile"
              />
            </View>

            <TouchableOpacity
              disabled={isLoading}
              className={cn('text-center p-4 rounded-md mt-10')}
              style={{
                backgroundColor: isDark ? Colors.dark.tint : Colors.light.tint,
              }}
              onPress={handleSubmit(onSubmit)}
            >
              <Text
                className="text-white text-center"
                lightColor="white"
                darkColor="white"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
