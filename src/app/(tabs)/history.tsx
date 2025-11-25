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
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { getWorkouts } from '../../services/storage';
import { Workout } from '../../types';
import ScreenBackground from '../../components/ScreenBackground'; 
import Button from '../../components/Button'; 
import { useAuth } from '../../context/AuthContext'; 
import styles from '../../styles/stylesHistory'; 
import { calendarTheme } from '../../styles/stylesHistory';

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

  const loadData = useCallback(async () => {
  if (!user || !user.uid) {
    Alert.alert('Erro', 'Usuário não autenticado');
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const savedWorkouts = await getWorkouts(user.uid); 
    setAllWorkouts(savedWorkouts); 

    // Processamento e Filtragem
    let initialFiltered: Workout[] = [];
    const marks: MarkedDates = {};

    savedWorkouts.forEach(workout => {
      const dateString = workout.date.split('T')[0]; 
      
      if (dateString === getTodayDateString()) {
        initialFiltered.push(workout);
      }

      marks[dateString] = { marked: true, dotColor: calendarTheme.dotColor };
    });

    marks[getTodayDateString()] = { 
      ...marks[getTodayDateString()], 
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
}, [user]); // Recarrega se o objeto user mudar (ex: login/logout)

  useFocusEffect(() => {
    loadData();
  }); 


  // 5. FUNÇÃO: Chamada ao clicar num dia
  const handleDayPress = (day: DateData) => {
    // Validação Defensiva Rápida
    if (!calendarTheme) return; 

    const { dateString } = day;

    setSelectedDate(dateString);
    const newFilteredWorkouts = allWorkouts.filter(w => w.date.startsWith(dateString));
    setFilteredWorkouts(newFilteredWorkouts.reverse());

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