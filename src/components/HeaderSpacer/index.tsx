import React from 'react';
import { View } from 'react-native';

// O botão "Sair (Logout)" tem aproximadamente 100-120px de largura.
// Este componente cria um espaço invisível para equilibrar o centro da logo.
const SPACER_WIDTH = 120; 

export default function HeaderSpacer() {
  // Retorna uma View vazia com largura fixa.
  return <View style={{ width: SPACER_WIDTH }} />;
}