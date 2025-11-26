import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import ScreenBackground from '../../components/ScreenBackground';

export default function LogoutScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await signOut(); 
      router.replace('/(auth)/login'); 
    };

    performLogout();
    
    return () => {};
  }, []); 
  
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