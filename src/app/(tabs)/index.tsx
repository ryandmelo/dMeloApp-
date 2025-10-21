import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { saveWorkout } from '../../services/storage';
import { Exercise, Set } from '../../types';

export default function WorkoutScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  const router = useRouter();

  // Adiciona um novo exercício à lista
  const handleAddExercise = () => {
    if (currentExercise.trim() === '') return;
    setExercises([
      ...exercises,
      { name: currentExercise, sets: [{ reps: '', weight: '' }] },
    ]);
    setCurrentExercise('');
  };

  // Adiciona uma nova série a um exercício
  const handleAddSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ reps: '', weight: '' });
    setExercises(newExercises);
  };

  // Atualiza o valor de uma série (reps ou peso)
  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight',
    value: string
  ) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  // Salva o treino completo
  const handleSaveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício para salvar.');
      return;
    }
    const workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: exercises,
    };
    await saveWorkout(workout);
    Alert.alert('Sucesso!', 'Treino salvo.');
    setExercises([]); // Limpa a tela
    router.push('/history'); // Navega para o histórico
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Registrar Treino - dMelo</Text>
      
      <View style={styles.addExerciseContainer}>
        <Input
          placeholder="Nome do Exercício (ex: Supino)"
          value={currentExercise}
          onChangeText={setCurrentExercise}
          placeholderTextColor="#8E8E93"
        />
        <Button title="Adicionar Exercício" onPress={handleAddExercise} />
      </View>

      {exercises.map((exercise, exIndex) => (
        <View key={exIndex} style={styles.exerciseContainer}>
          <Text style={styles.exerciseTitle}>{exercise.name}</Text>
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
            </View>
          ))}
          <Button title="Adicionar Série" onPress={() => handleAddSet(exIndex)} small />
        </View>
      ))}

      {exercises.length > 0 && (
        <Button title="Salvar Treino" onPress={handleSaveWorkout} primary />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  addExerciseContainer: {
    marginBottom: 20,
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
  },
  exerciseContainer: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD60A',
    marginBottom: 10,
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  setText: {
    color: '#FFF',
    fontSize: 16,
  },
  setInput: {
    flex: 0.4, // Cada input ocupa 40%
  },
});