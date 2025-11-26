import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenBackground from '../../components/ScreenBackground';
import Button from '../../components/Button';

export default function StoreScreen() {

    // Função placeholder para o futuro botão de compra
    const handlePlaceholderPurchase = () => {
        alert('Esta função será ativada na próxima fase: In-App Purchase (IAP).');
    };

    return (
        <ScreenBackground>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>dMelo Loja Premium</Text>
                <Text style={styles.subtitle}>Melhore seu treino e remova anúncios!</Text>

                {/* --- CARD DE ASSINATURA PREMIUM --- */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Assinatura Pro</Text>
                    <Text style={styles.description}>
                        - Remoção de todos os anúncios.{'\n'}
                        - Acesso a cupons de desconto exclusivos.{'\n'}
                        - Gráficos de progresso avançados.
                    </Text>
                    <Text style={styles.price}>R$ 9,90 / mês</Text>
                    <Button 
                        title="Assinar Agora (Em Breve)" 
                        primary 
                        onPress={handlePlaceholderPurchase} 
                        disabled={true} // Desabilita o botão para fase de teste
                        style={styles.button}
                    />
                </View>
                
                <Text style={styles.note}>
                    * Recurso de compra real será implementado na fase final do app.
                </Text>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    content: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFD60A',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 30,
    },
    card: {
        width: '90%',
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2C2C2E',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
    },
    description: {
        color: '#DDD',
        fontSize: 14,
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFD60A',
        marginBottom: 20,
    },
    button: {
        width: '80%',
    },
    note: {
        color: '#8E8E93',
        marginTop: 20,
        fontSize: 12,
    }
});