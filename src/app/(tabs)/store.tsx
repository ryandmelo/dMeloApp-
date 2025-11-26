import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../../services/firebaseConfig';
import ScreenBackground from '../../components/ScreenBackground';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/stylesStore'; 

// 1. IMPORTAR OS ÍCONES
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function StoreScreen() {
    const { user, isPremium, refreshProfile } = useAuth(); 
    const [purchasing, setPurchasing] = useState(false);
    const router = useRouter(); 

    const handleSimulatePurchase = async () => {
        if (!user) return;
        setPurchasing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); 
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { isPremium: true, email: user.email }, { merge: true });
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
            await setDoc(userRef, { isPremium: false }, { merge: true });
            await refreshProfile();
            Alert.alert("Cancelado", "Sua assinatura foi removida (Teste).");
        } catch (error) {
            console.error(error);
        } finally {
            setPurchasing(false);
        }
    };

    const handleViewCoupons = () => {
        if (isPremium) {
            router.push('/coupons');
        } else {
            showRestrictedAlert("Cupons disponíveis apenas para assinantes VIP.");
        }
    };

    const handleSupport = () => {
        if (isPremium) {
            const phone = "+5582993763399";
            const message = "Preciso de ajuda com o suporte prioritário.";
            const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
            
            Linking.openURL(url).catch(() => {
                Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
            });
        } else {
            showRestrictedAlert("Suporte prioritário via WhatsApp disponível apenas para assinantes VIP.");
        }
    };

    const showRestrictedAlert = (message: string) => {
        Alert.alert(
            "Acesso Restrito",
            message,
            [
                { text: "Voltar", style: "cancel" },
                { text: "Ok", style: "default" }
            ]
        );
    };

    return (
        <ScreenBackground>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Loja dMelo</Text>

                {isPremium ? (
                    <View style={[styles.card, { borderColor: '#FFD60A' }]}>
                        <Text style={styles.cardTitle}>Membro VIP 👑</Text>
                        <Text style={styles.description}>
                            Sua assinatura está ativa.
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

                {/* 2. BOTÃO DE CUPONS COM ÍCONE */}
                <Button 
                    title="Ver Cupons de Parceiros" 
                    onPress={handleViewCoupons} 
                    style={styles.couponButton} 
                    // Ícone de Ticket Amarelo
                    icon={<Ionicons name="pricetag-outline" size={20} color="#FFD60A" />}
                />

                {/* 3. BOTÃO DE SUPORTE COM ÍCONE WHATSAPP */}
                <Button 
                    title="Suporte Prioritário" 
                    onPress={handleSupport} 
                    style={styles.supportButton} 
                    // Ícone do WhatsApp Verde
                    icon={<FontAwesome name="whatsapp" size={22} color="#25D366" />}
                />

            </ScrollView>
        </ScreenBackground>
    );
}