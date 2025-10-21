import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importa os ícones

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1C1C1E' }, // Estilo do cabeçalho
        headerTintColor: '#FFF', // Cor do texto do cabeçalho
        tabBarStyle: { backgroundColor: '#1C1C1E' }, // Estilo da barra de abas
        tabBarActiveTintColor: '#FFD60A', // Cor da aba ativa
        tabBarInactiveTintColor: '#8E8E93', // Cor da aba inativa
      }}
    >
      <Tabs.Screen
        name="index" // Nome do arquivo index.tsx
        options={{
          title: 'Treino', // Título na aba
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history" // Nome do arquivo history.tsx
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer" // Nome do arquivo timer.tsx
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}