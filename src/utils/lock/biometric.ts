import * as LocalAuthentication from 'expo-local-authentication';

export async function canUseBiometrics(): Promise<boolean> {
  try {
    return (
      (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync())
    );
  } catch {
    return false;
  }
}

// O PIN do app é a alternativa; não deixa cair no PIN do telemóvel.
export async function authenticate(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Desbloquear o Preaching Assistant',
      cancelLabel: 'Usar o PIN',
      disableDeviceFallback: true,
    });
    return result.success;
  } catch {
    return false;
  }
}
