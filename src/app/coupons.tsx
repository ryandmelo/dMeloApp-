import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard'; // Opcional: para copiar o código
import ScreenBackground from '../components/ScreenBackground';
import { Ionicons } from '@expo/vector-icons';

export default function CouponsScreen() {
  
  const coupons = [
    { id: 1, partner: 'Growth Supplements', discount: '10% OFF', code: 'DMELO10' },
    { id: 2, partner: 'Insider Store', discount: '12% OFF', code: 'DMELOVIP' },
    { id: 3, partner: 'Centauro', discount: '15% OFF', code: 'DMELOFIT' },
  ];

  const copyToClipboard = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert('Copiado!', `O código ${code} foi copiado para a área de transferência.`);
  };

  return (
    <ScreenBackground>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Cupons Exclusivos VIP 💎</Text>
        <Text style={styles.subtitle}>Aproveite os descontos dos nossos parceiros!</Text>

        {coupons.map((coupon) => (
          <View key={coupon.id} style={styles.card}>
            <View>
                <Text style={styles.partnerName}>{coupon.partner}</Text>
                <Text style={styles.discountText}>{coupon.discount}</Text>
            </View>
            <TouchableOpacity 
                style={styles.codeButton} 
                onPress={() => copyToClipboard(coupon.code)}
            >
                <Text style={styles.codeText}>{coupon.code}</Text>
                <Ionicons name="copy-outline" size={16} color="black" style={{marginLeft: 5}}/>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFD60A', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#DDD', marginBottom: 30, textAlign: 'center' },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  partnerName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  discountText: { color: '#8E8E93', fontSize: 14, marginTop: 5 },
  codeButton: {
    backgroundColor: '#FFD60A',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  codeText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});