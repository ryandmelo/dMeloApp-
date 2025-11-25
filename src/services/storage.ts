import { getDocs, collection, addDoc, query, where, orderBy } from 'firebase/firestore'; 
import { db } from './firebaseConfig'; 
import { Workout } from '../types'; 

const WORKOUTS_COLLECTION = 'workouts'; // Nome da coleção no Firestore

// --- FUNÇÕES DE MANIPULAÇÃO DE TREINOS (FIRESTORE) ---

/**
 * Busca os treinos salvos para um usuário específico (UID), filtrando por userId.
 * 
 * @param userId O UID do usuário logado.
 * @returns Promise<Workout[]> A lista de treinos do usuário.
 */
export async function getWorkouts(userId: string): Promise<Workout[]> {
  try {
    if (!userId) {
      throw new Error('Usuário não autenticado');
    }

    const q = query(
      collection(db, WORKOUTS_COLLECTION),
      where('userId', '==', userId), // Filtra pelo userId
      orderBy('date', 'desc') // Ordena pela data
    );

    const querySnapshot = await getDocs(q);
    const workouts: Workout[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      workouts.push({
        id: doc.id,
        date: data.date,
        exercises: data.exercises,
      });
    });

    return workouts;
  } catch (e) {
    console.error('Erro ao buscar treinos no Firestore:', e);
    return [];
  }
}

/**
 * Salva um novo treino no Firestore, associando-o ao UID.
 * @param workout O objeto Workout.
 * @param userId O UID do usuário logado.
 */
export async function saveWorkout(workout: Workout, userId: string): Promise<void> {
  try {
    // Adiciona o novo treino no Firestore, associando ao UID do usuário
    await addDoc(collection(db, WORKOUTS_COLLECTION), {
      userId: userId, // Referência ao usuário
      date: workout.date,
      exercises: workout.exercises,
      createdAt: new Date().toISOString(), // Data de criação
    });
  } catch (e) {
    console.error('Erro ao salvar treino no Firestore:', e);
  }
}