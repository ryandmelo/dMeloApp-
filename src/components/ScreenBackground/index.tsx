import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Define que o componente pode receber 'children' (filhos)
type Props = {
  children: React.ReactNode;
};

export default function ScreenBackground({ children }: Props) {
  return (
    // 1. Container principal (preto, ocupa a tela toda)
    <View style={styles.container}>
      
      {/* 2. O logo de fundo (posicionado de forma absoluta, por trás) */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logo_dMelo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      {/* 3. O conteúdo da tela (que vem como 'children')
           Ele renderiza "por cima" da logo */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fundo preto base
  },
  logoContainer: {
    // Posicionamento absoluto faz ele "flutuar" no fundo
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Centraliza a imagem
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '70%', // A logo ocupará 70% da largura da tela
    height: '70%', // A logo ocupará 70% da altura (o 'contain' cuida da proporção)
    opacity: 0.15, // Opacidade bem baixa (10%)
  },
});