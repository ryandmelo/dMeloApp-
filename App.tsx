import 'expo-router/entry';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function App() {
  // O app agora é controlado pelo Expo Router (pasta 'app')
  // Podemos usar este espaço para carregar fontes, provedores de contexto, etc.
  return <StatusBar style="auto" />;
}