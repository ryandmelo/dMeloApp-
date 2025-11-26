import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  primary?: boolean;
  small?: boolean;
  // 1. NOVA PROPRIEDADE: Aceita um componente de ícone (ReactNode)
  icon?: React.ReactNode; 
}

export default function Button({ title, primary = false, small = false, icon, style, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        primary ? styles.primaryContainer : styles.secondaryContainer,
        small ? styles.smallContainer : null,
        style, 
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {/* 2. RENDERIZAÇÃO: Se houver ícone, mostra ele com uma margem */}
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={[styles.text, primary ? styles.primaryText : styles.secondaryText, small ? styles.smallText : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    minWidth: 100,
    // 3. MUDANÇA: Organiza itens em linha (lado a lado)
    flexDirection: 'row', 
  },
  iconContainer: {
    marginRight: 10, // Espaço entre o ícone e o texto
  },
  smallContainer: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 80,
  },
  primaryContainer: {
    backgroundColor: '#FFD60A', 
  },
  secondaryContainer: {
    backgroundColor: '#2C2C2E', 
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallText: {
    fontSize: 14,
  },
  primaryText: {
    color: '#000', 
  },
  secondaryText: {
    color: '#FFF', 
  },
});