import {
  Avatar,
  Box,
  Button,
  Flex,
  TextInput,
} from '@react-native-material/core'
import Snackbar from 'react-native-snackbar'

import { IUser } from '@/@types/interfaces'
import { Picker } from '@react-native-picker/picker'
import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { View, Text } from '@/components/Themed'
import { CREATE_USER } from '@/database/actions/user/create'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Controller, useForm } from 'react-hook-form'
import { Camera, ChevronLeft } from 'lucide-react-native'
import { KeyboardAvoidingView } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { zodResolver } from '@hookform/resolvers/zod'
import Colors from '@/constants/Colors'
import useTheme from '@/hooks/useTheme'
import * as ImagePicker from 'expo-image-picker'
import Z from 'zod'

const schema = Z.object({
  name: Z.string(),
  email: Z.string().email('Digite um email valido'),
  avatar_image: Z.string().url(),
  profile: Z.string(),
})

export default function Profile() {
  const { isDark } = useTheme()
  const { back } = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { setProfileUser, user } = useUser()
  const [image, setImage] = useState(user.avatar_image || '')
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
  })
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (result.assets) {
      setImage(result.assets[0].uri)
    }
  }
  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const newDate = { ...data, avatar_image: image } as IUser
      const user = await CREATE_USER(newDate)
      setProfileUser(user)
      Snackbar.show({
        text: 'Perfil Atualizado com sucesso',
        duration: Snackbar.LENGTH_LONG,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

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
            <Flex className="w-full" mt={10} mb={10} items="center">
              <TouchableOpacity className="relative" onPress={pickImage}>
                {image ? (
                  <Avatar
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                    size={150}
                    image={{ uri: image }}
                  />
                ) : (
                  <Avatar
                    label={
                      getValues().name ? getValues().name : 'Preaching App'
                    }
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                    size={150}
                  />
                )}
                <Camera
                  color="white"
                  fill={isDark ? Colors.dark.tint : Colors.light.tint}
                  size={28}
                  className="absolute bottom-1 right-3 w-2 h-2"
                />
              </TouchableOpacity>
            </Flex>

            <Box mt={20}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    variant="outlined"
                    placeholder="Nome"
                    label={isDark ? '' : 'Nome'}
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                    maxLength={25}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    style={{
                      marginBottom: 10,
                    }}
                    inputStyle={{
                      backgroundColor: isDark
                        ? Colors.dark.background
                        : 'white',
                      color: isDark ? 'white' : Colors.dark.background,
                    }}
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
                    style={{ marginBottom: 10 }}
                    variant="outlined"
                    placeholder="Email"
                    keyboardType="email-address"
                    label={isDark ? '' : 'Email'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    color={isDark ? Colors.dark.tint : Colors.light.tint}
                    helperText={errors.email?.message}
                    inputStyle={{
                      backgroundColor: isDark
                        ? Colors.dark.background
                        : 'white',
                      color: isDark ? 'white' : Colors.dark.background,
                    }}
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
                  <View className="border rounded border-gray-200">
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
            </Box>

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
  )
}
