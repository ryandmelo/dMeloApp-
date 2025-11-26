import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  StyleSheet
} from 'react-native';
import { useFocusEffect } from 'expo-router';

// 1. IMPORTAÇÕES DO CALENDÁRIO e TIPOS
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { getWorkouts } from '../../services/storage';
import { Workout } from '../../types';
import ScreenBackground from '../../components/ScreenBackground'; 
import Button from '../../components/Button'; 
import { useAuth } from '../../context/AuthContext'; 
// --- CORREÇÃO DE IMPORTS ---
// Nota: Assumo que você corrigiu o .ts no seu ambiente
import styles from '../../styles/stylesHistory'; 
import { calendarTheme } from '../../styles/stylesHistory';

// Definimos o tipo MarkedDates localmente para evitar erros de importação
type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['D','S','T','Q','Q','S','S'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};


export default function HistoryScreen() {
  const { user } = useAuth(); 
  
  const [loading, setLoading] = useState(true);

  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]); 
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  // 1. FUNÇÃO DE CARREGAMENTO: Dependências incluem user e o tema (para o caso de ser undefined no início)
  const loadData = useCallback(async () => {
    // Validação Defensiva: Se o user não existe ou se o tema ainda não foi carregado
    if (!user || !user.uid || !calendarTheme) {
        setLoading(false);
        return;
    }

    setLoading(true);

    try {
        const today = getTodayDateString();
        // Nota: Não setamos setSelectedDate(today) aqui para não causar re-render desnecessário
        
        const savedWorkouts = await getWorkouts(user.uid); 
        setAllWorkouts(savedWorkouts); 

        // Processamento e Filtragem
        let initialFiltered: Workout[] = [];
        const marks: MarkedDates = {};

        savedWorkouts.forEach(workout => {
          const dateString = workout.date.split('T')[0]; 
          
          if (dateString === selectedDate) { // Usa a data selecionada (que é 'hoje' na primeira renderização)
            initialFiltered.push(workout);
          }

          // Usa o tema (que agora sabemos que existe)
          marks[dateString] = { marked: true, dotColor: calendarTheme.dotColor };
        });

        marks[selectedDate] = { 
          ...marks[selectedDate], 
          selected: true, 
          selectedColor: calendarTheme.selectedDayBackgroundColor 
        };
        
        setFilteredWorkouts(initialFiltered.reverse());
        setMarkedDates(marks);

    } catch (e) {
      console.error('Erro ao carregar dados do histórico: ', e);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de treinos.');
    } finally {
      setLoading(false);
    }
    // As dependências que causam re-render devem ser mínimas
}, [user, selectedDate, calendarTheme]); // Dependências: user (auth) e selectedDate (se tiver mudado)

  // 2. CORREÇÃO DO LOOP INFINITO: Usamos a dependência [user] para estabilizar o effect
  useFocusEffect(
    useCallback(() => {
        loadData();
    }, [loadData]) // Recarrega apenas quando loadData muda (o que só acontece quando user muda)
  );


  // 5. FUNÇÃO: Chamada ao clicar num dia
  const handleDayPress = (day: DateData) => {
    // Validação Defensiva Rápida (Mantida)
    if (!calendarTheme) return; 

    const { dateString } = day;

    // Apenas setamos o estado, o useFocusEffect/loadData não precisa ser chamado aqui.
    setSelectedDate(dateString); 

    // O código abaixo faz a filtragem manual para não ter delay de recarregamento
    const newFilteredWorkouts = allWorkouts.filter(w => w.date.startsWith(dateString));
    setFilteredWorkouts(newFilteredWorkouts.reverse());

    // Atualiza marcações (Mantida)
    const newMarks: MarkedDates = {};
    allWorkouts.forEach(workout => {
      const dString = workout.date.split('T')[0]; 
      newMarks[dString] = { marked: true, dotColor: calendarTheme.dotColor };
    });

    newMarks[dateString] = { 
      ...newMarks[dateString], 
      selected: true, 
      selectedColor: calendarTheme.selectedDayBackgroundColor 
    };
    
    setMarkedDates(newMarks);
  };


// 6. RENDERIZAÇÃO DO ITEM
  const renderWorkoutItem = ({ item }: { item: Workout }) => {
    
    const workoutDate = new Date(item.date);

    const timePart = workoutDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
    });

    const datePart = workoutDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });

    const fullDateString = `${datePart}, às ${timePart}:`;

    return (
      <View style={styles.workoutCard}>
        <Text style={styles.workoutDate}>
          {fullDateString}
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
  };

  // 7. Ecrã de loading
  if (loading) {
    return (
      <ScreenBackground>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color="#FFD60A" />
        </View>
      </ScreenBackground>
    );
  }

  // 8. RENDERIZAÇÃO PRINCIPAL
  return (
    <ScreenBackground>
      {/* Container principal para o FlatList */}
      <View style={styles.container}> 
        <FlatList
          data={filteredWorkouts} 
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.listContainer}

          // --- CABEÇALHO DA LISTA ---
          ListHeaderComponent={
            <>
              <Text style={styles.screenTitle}>
                {selectedDate === getTodayDateString() ? 'Treinos de Hoje:' : `Treinos em: ${selectedDate}`}
              </Text>

              <Calendar
                theme={calendarTheme}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                current={selectedDate} // Garante que o calendário mostre o mês selecionado
                enableSwipeMonths={true}
                hideExtraDays={true}
              />
            </>
          }

          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>Nenhum treino registrado para este dia.</Text>
            </View>
          }
        />
      </View>
    </ScreenBackground>
  );
}