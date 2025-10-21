// Define uma única Série (ex: 10 reps com 50kg)
export interface Set {
  reps: string;
  weight: string;
}

// Define um Exercício (ex: Supino, com várias séries)
export interface Exercise {
  name: string;
  sets: Set[];
}

// Define o Treino completo (um conjunto de exercícios em uma data)
export interface Workout {
  id: string; // ID único (usaremos a data)
  date: string; // Data em formato ISO
  exercises: Exercise[];
}