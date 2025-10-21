/**
 * src/utils/storage.ts
 *
 * Define a "chave" e a "interface" (o molde)
 * dos nossos dados guardados.
 */

// 1. A Chave que usamos para guardar e ler do AsyncStorage
export const TIMER_HISTORY_KEY = '@dMeloApp/timerHistory';

// 2. A Interface (molde) que define o formato de um item do histórico
export interface HistoryItem {
  timestamp: number; // ID único (a hora em que foi salvo)
  text: string;      // Descrição da tarefa (ex: "Supino")
  duration: number;  // Duração em segundos (ex: 120)

  // --- CAMPOS ADICIONADOS ---
  // Vamos guardar os valores que vêm dos inputs de texto
  repetitions: string;
  load: string;
}