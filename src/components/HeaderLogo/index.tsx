import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function HeaderLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/logo_dMelo.png')}
        style={styles.logo}
        resizeMode="contain" // Garante que a logo caiba sem distorcer
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150, // largura 
    height: 50, // altura
    resizeMode: "contain",
  },
});