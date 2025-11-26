import React, { useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth'; // Função do Firebase
import { auth } from '../../services/firebaseConfig'; // Nossa instância auth

import Input from '../../components/Input';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import styles from '../../styles/stylesLogin'; // Reusamos o estilo do login

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu e-mail.');
      return;
    }

    setLoading(true);

    try {
      // Envia o e-mail de redefinição
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        'E-mail Enviado!', 
        'Verifique sua caixa de entrada (e spam) para redefinir sua senha.',
        [
            { text: "Voltar ao Login", onPress: () => router.back() }
        ]
      );
    } catch (error: any) {
      let msg = "Não foi possível enviar o e-mail.";
      if (error.code === 'auth/user-not-found') msg = "Usuário não encontrado.";
      if (error.code === 'auth/invalid-email') msg = "E-mail inválido.";
      
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Digite seu e-mail para receber o link de redefinição.
        </Text>

        <Input
          placeholder="Seu E-mail cadastrado"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#8E8E93"
        />

        <Button 
          title="Enviar E-mail" 
          onPress={handleReset} 
          primary 
          disabled={loading}
          style={{ marginTop: 20 }}
        />
        
        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#FFD60A" />}

        <TouchableOpacity style={styles.forgotButton} onPress={() => router.back()}>
          <Text style={[styles.toggleText, { marginTop: 0 }]}>Voltar para o Login</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenBackground>
  );
}