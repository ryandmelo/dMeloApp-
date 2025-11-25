import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import { useAuth } from '../../context/AuthContext'; 
import { FirebaseError } from 'firebase/app'; 
import styles from '../../styles/stylesLogin'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  // NOVO: Estado para a confirmação de senha
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  const { signIn, signUp } = useAuth();
  const router = useRouter(); 

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    // Validação de Confirmação de Senha e Comprimento
    if (isSigningUp) {
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas digitadas não coincidem. Por favor, verifique.');
            setLoading(false);
            return;
        }
        if (password.length < 6) { 
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }
    }

    setLoading(true);
    
    try {        
        if (isSigningUp) {
            await signUp(email, password);
        } else {
            await signIn(email, password);
        }
        if (isSigningUp) {
            Alert.alert('Sucesso', 'Conta criada e login efetuado!');
        }
        
        router.replace('/(tabs)'); 

    } catch (error: any) {
        let errorMessage = "Ocorreu um erro desconhecido.";
        
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = "Este e-mail já está em uso. Tente fazer o login.";
                    break;
                default:
                    errorMessage = error.message; 
            }
        }
        
        Alert.alert('Erro de Autenticação', errorMessage);
        
    } finally {
        setLoading(false); 
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>dMelo</Text>
        <Text style={styles.subtitle}>
          {isSigningUp ? 'Crie sua conta' : 'Acesse sua conta'}
        </Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#8E8E93"
        />
        <Input
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#8E8E93"
        />

        {isSigningUp && (
            <Input
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#8E8E93"
            />
        )}


        <View style={styles.buttonGroup}>
          <Button 
            title={isSigningUp ? 'Cadastrar' : 'Entrar'} 
            onPress={handleAuth} 
            primary 
            disabled={loading}
          />
          {loading && <ActivityIndicator style={styles.loading} size="small" color="#FFD60A" />}
        </View>

        <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
          <Text style={styles.toggleText}>
            {isSigningUp 
              ? 'Já tem conta? Faça o Login' 
              : 'Não tem conta? Registre-se'}
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </ScreenBackground>
  );
}