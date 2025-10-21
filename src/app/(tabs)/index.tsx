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
import { saveWorkout } from '../../services/storage';
import { Exercise, Set } from '../../types';

export default function WorkoutScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');

  const router = useRouter();

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

  /**
   * ESTA FUNÇÃO FOI MODIFICADA COM A NOVA VALIDAÇÃO
   */
  const handleSaveWorkout = async () => {
    // 1. Validação antiga (continua válida)
    if (exercises.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício para salvar.');
      return;
    }

    //
    // --- INÍCIO DA NOVA VALIDAÇÃO ---
    //
    // 2. Iterar por todos os exercícios e todas as séries
    for (const exercise of exercises) {
      // 3. Iterar por cada série do exercício
      for (const set of exercise.sets) {
        
        // 4. Verificar se 'reps' OU 'weight' estão vazios
        //    Usamos .trim() para garantir que " " (espaço) também é considerado vazio
        if (set.reps.trim() === '' || set.weight.trim() === '') {
          
          // 5. Se estiver vazio, mostrar um alerta específico e parar
          Alert.alert(
            'Campos Obrigatórios',
            `Por favor, preencha todos os campos de "Reps" e "Kg" para o exercício "${exercise.name}".`
          );
          return; // <-- Interrompe a função AQUI. Não salva.
        }
      }
    }
    // --- FIM DA NOVA VALIDAÇÃO ---
    //


    // 6. Se o loop terminar e não parar (return), significa que tudo está preenchido.
    //    Então, salvamos o treino.
    const workout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: exercises,
    };
    await saveWorkout(workout);
    Alert.alert('Sucesso!', 'Treino salvo.');
    setExercises([]);
    router.push('/history'); // Assumindo que esta é a sua rota de histórico
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
                  placeholder="Reps *" // Pode adicionar * para indicar obrigatório
                  value={set.reps}
                  onChangeText={(val) => handleSetChange(exIndex, setIndex, 'reps', val)}
                  keyboardType="numeric"
                  style={styles.setInput}
                  placeholderTextColor="#8E8E93"
                />
                <Input
                  placeholder="Kg *" // Pode adicionar * para indicar obrigatório
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

// ... (Todos os seus estilos permanecem exatamente iguais)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  addExerciseContainer: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  exerciseContainer: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD60A',
    flex: 1,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    color: '#FFF',
    padding: 8,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#D11A2A',
    marginLeft: 5,
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
    flex: 0.25,
  },
  setInput: {
    flex: 0.3,
    marginHorizontal: 2,
  },
  deleteSetButton: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  deleteSetText: {
    color: '#D11A2A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: 10,
  },
});