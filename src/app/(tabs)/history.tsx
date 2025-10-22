import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getWorkouts } from '../../services/storage';
import { Workout } from '../../types';
import ScreenBackground from '../../components/ScreenBackground'; 
import { styles } from './stylesHistory'; //ESTILOS


export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkouts = async () => {
    setLoading(true);
    const savedWorkouts = await getWorkouts();
    setWorkouts(savedWorkouts.reverse());
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <View style={styles.workoutCard}>
      <Text style={styles.workoutDate}>
        {new Date(item.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}
      </Text>
      {item.exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseItem}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.sets.map((set, setIndex) => (
            <Text key={setIndex} style={styles.setText}>
              - Série {setIndex + 1}: {set.reps} reps com {set.weight} kg
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#FFD60A" />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        
        <Text style={styles.screenTitle}>
          Seu histórico de treinos:
        </Text>

        {workouts.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhum treino registrado ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={renderWorkoutItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </ScreenBackground>
  );
}

