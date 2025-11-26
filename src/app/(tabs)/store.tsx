import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
// 1. MUDANÇA NO IMPORT: Trocamos updateDoc por setDoc
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConfig';
import ScreenBackground from '../../components/ScreenBackground';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/stylesStore'; 

export default function StoreScreen() {
    const { user, isPremium, refreshProfile } = useAuth(); 
    const [purchasing, setPurchasing] = useState(false);

    const handleSimulatePurchase = async () => {
        if (!user) return;
        setPurchasing(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); 

            const userRef = doc(db, "users", user.uid);
            
            // 2. CORREÇÃO: Usamos setDoc com merge: true
            // Isso cria o documento se ele não existir, ou atualiza se já existir.
            await setDoc(userRef, {
                isPremium: true,
                email: user.email // Garante que o email fique salvo também se for um doc novo
            }, { merge: true });

            await refreshProfile();
            Alert.alert("Sucesso!", "Compra simulada com sucesso. Você agora é Premium!");

        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao simular compra.");
        } finally {
            setPurchasing(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!user) return;
        setPurchasing(true);
        try {
            const userRef = doc(db, "users", user.uid);
            
            // 3. CORREÇÃO: Também usamos setDoc aqui para evitar erros
            await setDoc(userRef, { 
                isPremium: false 
            }, { merge: true });
            
            await refreshProfile();
            Alert.alert("Cancelado", "Sua assinatura foi removida (Teste).");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Falha ao cancelar.");
        } finally {
            setPurchasing(false);
        }
    };

    return (
        <ScreenBackground>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Loja dMelo</Text>

                {isPremium ? (
                    <View style={[styles.card, { borderColor: '#FFD60A' }]}>
                        <Text style={styles.cardTitle}>Membro VIP 👑</Text>
                        <Text style={styles.description}>
                            Sua assinatura está ativa. Aproveite todos os benefícios!
                        </Text>
                        <Button 
                            title="Cancelar Assinatura (Teste)" 
                            onPress={handleCancelSubscription} 
                            small
                            style={{ marginTop: 10, backgroundColor: '#D11A2A' }}
                        />
                    </View>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Assinatura Premium</Text>
                        <Text style={styles.description}>
                            - Acesso a conteúdo exclusivo.{'\n'}
                            - Sem anúncios.{'\n'}
                            - Suporte prioritário.
                        </Text>
                        <Text style={styles.price}>R$ 9,90 / mês</Text>
                        
                        {purchasing ? (
                            <ActivityIndicator color="#FFD60A" />
                        ) : (
                            <Button 
                                title="Simular Compra (Grátis)" 
                                primary 
                                onPress={handleSimulatePurchase} 
                                style={styles.button}
                            />
                        )}
                        <Text style={styles.note}>* Modo de Teste: Nenhuma cobrança será feita.</Text>
                    </View>
                )}
            </ScrollView>
        </ScreenBackground>
    );
}