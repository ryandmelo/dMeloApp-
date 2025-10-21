/**
 * src/utils/storage.ts
 *
 * Este ficheiro serve para centralizar as definições
 * que usamos para guardar coisas no AsyncStorage.
 */

/**
 * 1. A Chave (Key) para o Histórico
 * Usamos uma constante para garantir que nunca nos enganamos
 * a escrever o nome da chave noutros ficheiros.
 * O '@dMeloApp/' é uma boa prática para evitar colisões com outras apps.
 */
export const TIMER_HISTORY_KEY = '@dMeloApp/timerHistory';

/**
 * 2. O formato (Interface) do nosso item de histórico
 * Isto diz ao TypeScript "como é" um objeto do nosso histórico,
 * ajudando a prevenir bugs.
 */
export interface HistoryItem {
  timestamp: number; // Usado como ID único (ex: 1678886400000)
  text: string;      // A descrição da tarefa (ex: "Estudar React")
  duration: number;  // O tempo em segundos (ex: 120)
}