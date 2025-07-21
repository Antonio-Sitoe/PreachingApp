import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function SignInScreen() {
  const navigation = useNavigation();
  const { login } = useUser();

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('Google user:', userInfo);
      navigation.navigate('/(drawer)/(tabs)/report');
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <View className="bg-black/50 p-8 rounded-2xl">
        <Text className="text-white text-3xl font-bold mb-8">Bem-vindo</Text>

        <TouchableOpacity
          onPress={handleGoogleSignIn}
          className="flex-row items-center bg-white px-4 py-3 rounded-xl"
        >
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
            }}
            className="w-6 h-6 mr-3"
          />
          <Text className="text-black text-base font-medium">
            Entrar com Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
