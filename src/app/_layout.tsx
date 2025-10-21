import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    // Stack é o tipo de navegação (empilhar telas)
    <Stack>
      {/* A tela principal será o nosso layout de abas */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}