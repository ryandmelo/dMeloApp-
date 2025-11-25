import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ScreenBackground from '../../components/ScreenBackground';
import { useAuth } from '../../context/AuthContext';
import { saveWorkout } from '../../services/storage'; // Já foi atualizado para Firestore
import { Exercise, Set } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/stylesIndex';

export default function WorkoutScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');

  const router = useRouter();
  const { signOut, user } = useAuth(); // <-- ATUALIZADO: Obtém o user
  const insets = useSafeAreaInsets();

  const handleAddExercise = () => {
    if (currentExercise.trim() === '') return;
    setExercises([
      ...exercises,
      { name: currentExercise, sets: [{ reps: '', weight: '' }] },
    ]);
    setCurrentExercise('');
  };

  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(newExercises);
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    let isValid = false;
    if (field === 'reps') {
      isValid = value === '' || /^[0-9]+$/.test(value);
    } else {
      isValid = value === '' || /^[0-9.,]+$/.test(value);
    }

    if (isValid) {
      const newExercises = [...exercises];
      const normalizedValue = (field === 'weight') ? value.replace(',', '.') : value;
      newExercises[exerciseIndex].sets[setIndex][field] = normalizedValue;
      setExercises(newExercises);
    }
  };

  // FUNÇÃO DE SALVAR ATUALIZADA PARA USAR FIRESTORE E UID
  const handleSaveWorkout = async () => {
    if (!user || !user.uid) { // Validação de segurança
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
    }
    
    if (exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício para salvar.');
      return;
    }
    
    const workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: exercises,
    };
    
    // CHAMA saveWorkout PASSANDO O UID
    await saveWorkout(workout, user.uid); 
    
    Alert.alert('Sucesso!', 'Treino salvo no seu histórico pessoal.');
    setExercises([]);
    router.push('/history');
  };

  const handleDeleteExercise = (indexToRemove: number) => {
    Alert.alert(
      'Remover Exercício',
      'Tem certeza que deseja remover este exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setExercises((prev) =>
              prev.filter((_, index) => index !== indexToRemove)
            );
          },
        },
      ]
    );
  };

  const handleDeleteSet = (exerciseIndex: number, setIndexToRemove: number) => {
    if (exercises[exerciseIndex].sets.length <= 1) {
      Alert.alert(
        'Ação inválida',
        'Todo exercício deve ter pelo menos uma série. Se desejar, remova o exercício inteiro.'
      );
      return;
    }
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter(
      (_, setIndex) => setIndex !== setIndexToRemove
    );
    setExercises(newExercises);
  };

  const handleStartEdit = (exIndex: number, currentName: string) => {
    setEditingIndex(exIndex);
    setEditedName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || editedName.trim() === '') return;
    const newExercises = [...exercises];
    newExercises[editingIndex].name = editedName;
    setExercises(newExercises);
    setEditingIndex(null);
    setEditedName('');
  };
  
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedName('');
  };


  return (
    <ScreenBackground>
      <View style={[styles.logoutContainer, { paddingTop: insets.top + 10 }]}>
        <Button 
          title="Sair (Logout)" 
          onPress={() => signOut()}
          small 
          style={styles.logoutButton}
        />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {exercises.map((exercise, exIndex) => (
          <View key={exIndex} style={styles.exerciseContainer}>
            
            <View style={styles.exerciseHeader}>
              {editingIndex === exIndex ? (
                <TextInput
                  value={editedName}
                  onChangeText={setEditedName}
                  style={styles.editInput}
                  autoFocus={true}
                />
              ) : (
                <Text style={styles.exerciseTitle}>{exercise.name}</Text>
              )}

              <View style={styles.buttonRow}>
                {editingIndex === exIndex ? (
                  <>
                    <Button title="Salvar" onPress={handleSaveEdit} small />
                    <Button title="X" onPress={handleCancelEdit} small style={styles.deleteButton} />
                  </>
                ) : (
                  <>
                    <Button title="Editar" onPress={() => handleStartEdit(exIndex, exercise.name)} small />
                    <Button title="Remover" onPress={() => handleDeleteExercise(exIndex)} small style={styles.deleteButton} />
                  </>
                )}
              </View>
            </View>

            {exercise.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setContainer}>
                <Text style={styles.setText}>Série {setIndex + 1}</Text>
                
                <Input
                  placeholder="Reps"
                  value={set.reps}
                  onChangeText={(val) => handleSetChange(exIndex, setIndex, 'reps', val)}
                  keyboardType="numeric"
                  style={styles.setInput}
                  placeholderTextColor="#8E8E93"
                />
                <Input
                  placeholder="Kg"
                  value={set.weight}
                  onChangeText={(val) => handleSetChange(exIndex, setIndex, 'weight', val)}
                  keyboardType="numeric"
                  style={styles.setInput}
                  placeholderTextColor="#8E8E93"
                />
                
                <TouchableOpacity 
                  style={styles.deleteSetButton}
                  onPress={() => handleDeleteSet(exIndex, setIndex)}
                >
                  <Text style={styles.deleteSetText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <Button title="Adicionar Série" onPress={() => handleAddSet(exIndex)} small />
          </View>
        ))}

        <View style={styles.addExerciseContainer}>
          <Input
            placeholder={
              exercises.length > 0 
                ? "Próximo exercício (ex: Agachamento)" 
                : "Nome do Exercício (ex: Supino)"
            }
            value={currentExercise}
            onChangeText={setCurrentExercise}
            placeholderTextColor="#8E8E93"
          />
          <Button 
            title={exercises.length > 0 ? "Adicionar Outro Exercício" : "Adicionar Exercício"} 
            onPress={handleAddExercise} 
          />
        </View>

        {exercises.length > 0 && (
          <Button 
            title="Salvar Treino" 
            onPress={handleSaveWorkout} 
            primary 
            style={styles.saveButton}
          />
        )}
      </ScrollView>
    </ScreenBackground>
  );
}