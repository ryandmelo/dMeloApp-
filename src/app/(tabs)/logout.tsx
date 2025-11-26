import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ScreenBackground from '../../components/ScreenBackground';

export default function LogoutScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  // Usamos useEffect para garantir que o logout ocorra imediatamente quando a tela for montada
  useEffect(() => {
    const performLogout = async () => {
      // 1. Executa o logout do Firebase
      await signOut(); 
      
      // 2. Força o redirecionamento imediato para a tela de login
      router.replace('/(auth)/login'); 
    };

    performLogout();
    
    // Retorna uma função vazia de cleanup (não precisamos de nada aqui)
    return () => {};
  }, []); // O array de dependências vazio garante que isso rode apenas uma vez

  // Enquanto o logout é processado, mostramos um loader (embora seja rápido)
  return (
    <ScreenBackground>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFD60A" />
        <Text style={styles.text}>Saindo da sessão...</Text>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    marginTop: 15,
    fontSize: 16,
  },
});