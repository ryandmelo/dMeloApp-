import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import { useAuth } from '../../context/AuthContext'; 
import { FirebaseError } from 'firebase/app'; 
import styles from '../../styles/stylesLogin'; 
// O AsyncStorage não é mais necessário aqui diretamente, pois o AuthContext cuida disso, 
// mas se tiver o botão de Hard Reset, mantenha. Se não, pode remover.

export default function LoginScreen() {
  // 1. NOVO ESTADO: Nome do usuário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(''); 
  
  const { signIn, signUp } = useAuth();
  const router = useRouter(); 

  const handleAuth = async () => {
    // Validação básica de campos comuns
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    // Validações Específicas de Cadastro
    if (isSigningUp) {
        // 2. VALIDAÇÃO: O nome é obrigatório no cadastro
        if (!name.trim()) {
            Alert.alert('Erro', 'Por favor, digite seu nome.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas digitadas não coincidem.');
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
            // 3. CHAMADA ATUALIZADA: Passamos o 'name' para a função signUp
            await signUp(name, email, password);
            Alert.alert('Sucesso', 'Conta criada e login efetuado!');
        } else {
            await signIn(email, password);
        }
        
        // Força o redirecionamento
        router.replace('/(tabs)'); 

    } catch (error: any) {
        let errorMessage = "Ocorreu um erro desconhecido.";
        
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential': // Novo código de erro comum
                    errorMessage = "Email ou senha incorretos.";
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

        {/* 4. NOVO INPUT: Nome (Só aparece no modo Cadastro) */}
        {isSigningUp && (
            <Input
                placeholder="Seu Nome"
                value={name}
                onChangeText={setName}
                autoCapitalize="words" // Capitaliza a primeira letra de cada palavra
                placeholderTextColor="#8E8E93"
            />
        )}

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

        {/* Botão "Esqueceu a senha" (Apenas no Login) */}
        {!isSigningUp && (
            <TouchableOpacity 
                style={styles.forgotButton} 
                onPress={() => router.push('/(auth)/reset_password')}
            >
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
        )}
        
      </ScrollView>
    </ScreenBackground>
  );
}