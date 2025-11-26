import React, { useState } from 'react';
import { Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig'; 

import Input from '../../components/Input';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import styles from '../../styles/stylesLogin'; 

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    // 1. Validação básica dos campos
    if (!email.trim() || !name.trim()) {
      Alert.alert('Erro', 'Por favor, preencha seu Nome e E-mail.');
      return;
    }

    setLoading(true);

    try {
      // 2. Busca o usuário no Firestore pelo E-mail
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      // Se não achou o e-mail no banco
      if (querySnapshot.empty) {
        Alert.alert('Erro', 'Nenhuma conta encontrada com este e-mail.');
        setLoading(false);
        return;
      }

      // 3. Validação de Segurança: O Nome confere?
      const userData = querySnapshot.docs[0].data();
      const dbName = userData.name ? userData.name.toLowerCase().trim() : '';
      const inputName = name.toLowerCase().trim();

      // Se o nome não bater, bloqueia o envio
      if (dbName !== inputName) {
         Alert.alert('Acesso Negado', 'O nome informado não confere com o cadastro deste e-mail.');
         setLoading(false);
         return;
      }

      // 4. Se validou tudo, envia o e-mail oficial do Firebase
      await sendPasswordResetEmail(auth, email);
      
      Alert.alert(
        'Sucesso!', 
        'Um link para criar sua nova senha foi enviado para seu e-mail. Verifique sua caixa de entrada e spam.',
        [
            { text: "Voltar para Login", onPress: () => router.back() }
        ]
      );

    } catch (error: any) {
      console.log("Erro no reset:", error);
      
      // Tratamento se as regras do Firestore impedirem a leitura (Fallback de segurança)
      if (error.code === 'permission-denied' || error.code === 'firestore/permission-denied') {
          // Tenta enviar mesmo assim, o Auth do Firebase fará a segurança final
          sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert('Aviso', 'Não conseguimos validar seu nome devido à segurança, mas enviamos o link para o e-mail se ele for válido.');
                router.back();
            })
            .catch(() => Alert.alert('Erro', 'E-mail inválido ou inexistente.'));
      } 
      else if (error.code === 'auth/invalid-email') {
          Alert.alert('Erro', 'Formato de e-mail inválido.');
      } 
      else {
          Alert.alert('Erro', 'Não foi possível processar a solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          Confirme seus dados de segurança para receber o link de alteração.
        </Text>

        <Input
          placeholder="Seu Nome Completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholderTextColor="#8E8E93"
        />

        <Input
          placeholder="Seu E-mail cadastrado"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#8E8E93"
        />

        <Button 
          title="Validar e Enviar Link" 
          onPress={handleReset} 
          primary 
          disabled={loading}
          style={{ marginTop: 20 }}
        />
        
        {loading && <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#FFD60A" />}

        <TouchableOpacity style={styles.forgotButton} onPress={() => router.back()}>
          <Text style={[styles.toggleText, { marginTop: 0 }]}>Voltar para o Login</Text>
        </TouchableOpacity>

      </ScrollView>
    </ScreenBackground>
  );
}