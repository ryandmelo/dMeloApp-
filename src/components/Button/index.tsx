import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

// Define as propriedades que o botão pode receber
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  primary?: boolean; // Para um botão de destaque
  small?: boolean; // Para um botão menor
}

// Passamos 'style' como parte de ...rest para que possamos adicionar estilos externos
export default function Button({ title, primary = false, small = false, style, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        primary ? styles.primaryContainer : styles.secondaryContainer,
        small ? styles.smallContainer : null,
        style, // Aplica estilos passados por props
      ]}
      {...rest}
    >
      <Text style={[styles.text, primary ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Os estilos foram movidos para cá para simplificar (você pode manter em styles.ts se preferir)
const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  smallContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  primaryContainer: {
    backgroundColor: '#FFD60A', // Cor principal (amarelo)
  },
  secondaryContainer: {
    backgroundColor: '#2C2C2E', // Cor secundária
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#000',
  },
  secondaryText: {
    color: '#FFF',
  },
});