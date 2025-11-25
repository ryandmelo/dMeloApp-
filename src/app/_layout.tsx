import { Stack, Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext'; 

function InitialLoader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#FFD60A" />
    </View>
  );
}

function RootLayoutContent() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <InitialLoader />;
  }

  return (
    <Stack>
      
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Se estiver autenticado, garante que a URL vá para a rota principal */}
      {isAuthenticated && <Redirect href="/(tabs)" />}
      
      {/* Se NÃO estiver autenticado, garante que a URL vá para a rota de login */}
      {!isAuthenticated && <Redirect href="/(auth)/login" />}
    </Stack>
  );
}

// O componente que fornece o Contexto a todo o App
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});