import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function HeaderLogo() {
  return (
    <View style={styles.container}>
      <Image
        // O caminho sai 3 níveis (HeaderLogo -> components -> src -> root)
        source={require('../../../assets/logoo.png')}
        style={styles.logo}
        resizeMode="contain" // Garante que a logo caiba sem distorcer
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Flex: 1 para ocupar o espaço do título
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Ajuste fino caso a logo não fique centralizada
    // Pode ser necessário no Android
    // paddingRight: Platform.OS === 'android' ? 50 : 0, 
  },
  logo: {
    width: 300, // Defina a largura da sua logo
    height: 105, // Defina a altura da sua logo
  },
});