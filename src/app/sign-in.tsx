'use client';

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input-component';
import { Card } from '@/components/ui/card-item';
import { GoogleIcon } from '@/lib/icons/google';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simular login
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Simular login com Google
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert('Sucesso', 'Login com Google realizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha no login com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Funcionalidade em desenvolvimento');
  };

  const handleSignUp = () => {
    Alert.alert('Criar Conta', 'Funcionalidade em desenvolvimento');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>
              Entre na sua conta para continuar
            </Text>
          </View>

          <Card style={styles.card}>
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />

              <Input
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry
                autoComplete="password"
                error={errors.password}
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>
                  Esqueceu sua senha?
                </Text>
              </TouchableOpacity>

              <Button
                title={loading ? 'Entrando...' : 'Entrar'}
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Continuar com Google"
                onPress={handleGoogleLogin}
                variant="outline"
                disabled={loading}
                style={styles.googleButton}
                textStyle={styles.googleButtonText}
              />
            </View>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Não tem uma conta?{' '}
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpText}>Criar conta</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#18181b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    marginBottom: 24,
  },
  form: {
    gap: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e4e4e7',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#71717a',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleButtonText: {
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#71717a',
    textAlign: 'center',
  },
  signUpText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
});
