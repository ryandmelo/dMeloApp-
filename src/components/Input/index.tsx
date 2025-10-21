import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

// Permite passar todas as propriedades de um TextInput normal
interface InputProps extends TextInputProps {}

export default function Input({ style, ...rest }: InputProps) {
  return (
    <TextInput
      style={[styles.container, style]} // Combina estilos padrão com estilos passados por props
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2C2C2E',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
});