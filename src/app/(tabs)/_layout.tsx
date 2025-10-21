import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo'; // <-- 1. IMPORTAR A LOGO

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1C1C1E' },
        headerTintColor: '#FFF',
        tabBarStyle: { backgroundColor: '#1C1C1E' },
        tabBarActiveTintColor: '#FFD60A',
        tabBarInactiveTintColor: '#8E8E93',

        // --- 2. ADICIONAR ESTA LINHA ---
        // Define o componente da logo como o título do header
        headerTitle: () => <HeaderLogo />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Treino', // Este 'title' agora só afeta o texto da aba
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico', // Este 'title' agora só afeta o texto da aba
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer', // Este 'title' agora só afeta o texto da aba
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}