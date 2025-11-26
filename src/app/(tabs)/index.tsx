import React, { useState } from 'react';
import { 
  View, 
  Text, 
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
import { saveWorkout } from '../../services/storage'; 
import { Exercise } from '../../types';
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- NÃO PRECISA MAIS
import styles from '../../styles/stylesIndex';

export default function WorkoutScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState('');
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');

  const router = useRouter();
  const { user, userData } = useAuth(); 
  // const insets = useSafeAreaInsets(); // <-- NÃO PRECISA MAIS

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

  const handleSaveWorkout = async () => {
    if (!user || !user.uid) { 
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
      
      {/* CORREÇÃO 1: Removemos a View "absolute" que estava aqui */}

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer} // CORREÇÃO 2: Removemos o paddingTop extra
      >
        
        {/* CORREÇÃO 3: Colocamos a saudação AQUI DENTRO para controlar o espaço */}
        <View style={{ 
            alignItems: 'center', 
            marginTop: 0, // <-- Ajuste isso para aproximar/afastar do Topo (Logo)
            marginBottom: 8, // <-- Ajuste isso para afastar dos Inputs
        }}>
            {userData?.name && (
                <Text style={{ color: '#FFD60A', fontSize: 20, fontWeight: 'bold' }}>
                    Olá, {userData.name}
                </Text>
            )}
        </View>

        {/* --- BLOCO DE ADICIONAR EXERCÍCIO (Inverti a ordem para ficar igual sua foto) --- */}
        {/* Se você quer que o campo de adicionar venha ANTES da lista, mantenha aqui.
            Se preferir a lista antes, mova este bloco para baixo. 
            Na sua foto, o campo de adicionar está no topo. */}
        
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

        {/* --- LISTA DE EXERCÍCIOS ADICIONADOS --- */}
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