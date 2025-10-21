import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { getWorkouts } from '../../services/storage';
import { Workout } from '../../types';

export default function HistoryScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  // Carrega os treinos salvos
  const loadWorkouts = async () => {
    setLoading(true);
    const savedWorkouts = await getWorkouts();
    setWorkouts(savedWorkouts.reverse()); // Mostra os mais recentes primeiro
    setLoading(false);
  };

  // useFocusEffect é chamado toda vez que a tela ganha foco
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
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFD60A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 18,
  },
  workoutCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  workoutDate: {
    color: '#FFD60A',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseItem: {
    marginLeft: 10,
    marginBottom: 5,
  },
  exerciseName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  setText: {
    color: '#DDD',
    fontSize: 14,
  },
});