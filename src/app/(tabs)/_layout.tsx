// ARQUIVO: app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo'; 
import HeaderSpacer from '../../components/HeaderSpacer'; // <-- MANTEMOS O SPACER

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1C1C1E' },
        headerTintColor: '#FFF',
        tabBarStyle: { backgroundColor: '#1C1C1E' },
        tabBarActiveTintColor: '#FFD60A',
        tabBarInactiveTintColor: '#8E8E93',

        headerTitle: () => <HeaderLogo />, 
        headerLeft: () => <HeaderSpacer />, // Mantemos o spacer para centralizar
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Treino',
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={24} color={color} />
          ),
          headerLeft: () => <HeaderSpacer />, // Adiciona simetria (para o caso do timer/logout existir)
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
          headerLeft: () => <HeaderSpacer />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => (
            <Ionicons name="timer-outline" size={24} color={color} />
          ),
          headerLeft: () => <HeaderSpacer />,
        }}
      />
      
      {/* --- NOVO: ABA DE LOGOUT --- */}
      <Tabs.Screen
        name="logout" // Corresponde ao arquivo logout.tsx
        options={{
          title: 'Sair', 
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={24} color={color} />
          ),
          // O header será escondido nesta tela, pois ela vai redirecionar imediatamente
          headerShown: false, 
        }}
      />
    </Tabs>
  );
}