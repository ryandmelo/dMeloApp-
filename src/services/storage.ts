import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types'; // Importa nossa definição de tipo

const WORKOUTS_KEY = '@dMelo:workouts'; // Chave única para o storage

// Busca todos os treinos
export async function getWorkouts(): Promise<Workout[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(WORKOUTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Erro ao buscar treinos', e);
    return [];
  }
}

// Salva um novo treino
export async function saveWorkout(workout: Workout): Promise<void> {
  try {
    // 1. Busca os treinos existentes
    const existingWorkouts = await getWorkouts();
    // 2. Adiciona o novo treino à lista
    const newWorkouts = [...existingWorkouts, workout];
    // 3. Salva a lista atualizada
    const jsonValue = JSON.stringify(newWorkouts);
    await AsyncStorage.setItem(WORKOUTS_KEY, jsonValue);
  } catch (e) {
    console.error('Erro ao salvar treino', e);
  }
}