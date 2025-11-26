import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderLogo from '../../components/HeaderLogo'; 
import HeaderSpacer from '../../components/HeaderSpacer'; 

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
        headerLeft: () => <HeaderSpacer />, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Treino',
          tabBarIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={24} color={color} />
          ),
          headerLeft: () => <HeaderSpacer />,
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
      
      {/* --- NOVO: ABA DA LOJA (ENTRE TIMER E LOGOUT) --- */}
      <Tabs.Screen
        name="store" // Corresponde ao arquivo store.tsx
        options={{
          title: 'Loja', 
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart-outline" size={24} color={color} />
          ),
          headerLeft: () => <HeaderSpacer />,
        }}
      />
      
      {/* --- ABA DE LOGOUT (ÚLTIMA) --- */}
      <Tabs.Screen
        name="logout" 
        options={{
          title: 'Sair', 
          tabBarIcon: ({ color }) => (
            <Ionicons name="log-out-outline" size={24} color={color} />
          ),
          headerShown: false, // Esconde o header nesta tela
        }}
      />
    </Tabs>
  );
}