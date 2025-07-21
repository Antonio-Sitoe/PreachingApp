import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, Button, Image } from 'react-native';
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
import Z from 'zod';
import Snackbar from 'react-native-snackbar';
import { Picker } from '@react-native-picker/picker';

const schema = Z.object({
  name: Z.string(),
  email: Z.string().email('Digite um email valido'),
  avatar_image: Z.string().url(),
  profile: Z.string(),
});

export default function Profile() {
  const { isDark } = useTheme();
  const { back } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setProfileUser, user } = useUser();
  const [image, setImage] = useState(user.avatar_image || '');
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar_image: user.avatar_image,
      profile: user.profile || 'publisher',
    },
  });
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
    }
  }
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const newDate = { ...data, avatar_image: image };
      const user = await usersActions.create(newDate);
      setProfileUser(user);
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

  return (
    <View className="flex-1" darkColor={Colors.dark.darkBgSecundary}>
      <SafeAreaView className="flex-1 px-4">
        <KeyboardAvoidingView behavior="height">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              className="flex-row justify-between mt-8 items-center"
              darkColor={Colors.dark.darkBgSecundary}
            >
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
            <Text className="font-title text-xl text-center mb-4">
              Editar Perfil
            </Text>
            <View className="w-full" style={{ flexDirection: 'row' }}>
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
                      {getValues().name ? getValues().name : 'Preaching App'}
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
                    }}
                    placeholder="Nome"
                    placeholderTextColor={
                      isDark ? Colors.dark.tint : Colors.light.tint
                    }
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="name"
              />

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
                    }}
                    placeholder="Email"
                    placeholderTextColor={
                      isDark ? Colors.dark.tint : Colors.light.tint
                    }
                    keyboardType="email-address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
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

            <Button
              loading={isLoading}
              title="Salvar"
              titleStyle={{ textTransform: 'capitalize', color: 'white' }}
              color={isDark ? Colors.dark.tint : Colors.light.tint}
              style={{ padding: 5, marginTop: 20 }}
              onPress={handleSubmit(onSubmit)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
